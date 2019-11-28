import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserData } from 'app/model';
import { Entry, EntryCourse, FixtureEntryDetails } from 'app/model/entry';
import { take } from 'rxjs/operators';
import { EntryService } from '../entry.service';
import { UserDataService } from 'app/user/user-data.service';

interface FormData {
   firstname?: string;
   surname?: string;
   club?: string;
   course?: string;
}

@Component({
   selector: 'app-enter',
   templateUrl: './enter.component.html',
   styleUrls: ['./enter.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class EnterComponent implements OnInit {

   form: FormGroup;

   fixtureId: string;
   id: string;
   entry: Entry;
   fixture: FixtureEntryDetails;
   user: UserData;

   constructor(private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      private snackbar: MatSnackBar,
      private es: EntryService,
      private usd: UserDataService) { }

   ngOnInit() {

      this.route.paramMap.subscribe((params: ParamMap) => {
         this.fixtureId = params.get('FixtureId');
         this.id = params.get('EntryId');

         if (!this.fixtureId) {
            throw Error ("Fixture must be specified when creating an entry");
         }

         // Read event details (for courses)
         this.es.getEntryDetails(this.fixtureId).pipe(take(1)).subscribe(e => this.fixture);

         if (!this.id) {
            // If logged in populate initial fields from user data
            if (this.usd.currentUserData) {
               this._createForm({
                  firstname: this.user.firstname,
                  surname: this.user.surname,
                  club: this.user.club
               });
            } else {
               this._createForm( {} );
            }
         } else {
            this.es.getEntry$(this.fixtureId, this.id).pipe(take(1))
               .subscribe(entry => this._createForm(entry));
         }
      });
   }

   private _createForm(data: FormData | null) {
      this.form = this.formBuilder.group({
         firstname: [data.firstname, Validators.required],
         surname: [data.surname, Validators.required],
         club: data.club,
         course: [data.course, this.numMapValidator]
      });
   }

   async onSubmit() {

         // Check entry limit

          if (this.id) {
             // Create new instance and save it
          //   const details = this.es.createEntry();
             await this.es.enter(this.fixture, this.form.value);
          } else {
             await this.es.updateEntry(this.fixtureId, this.id, this.form.value);
          }
      await this.router.navigateByUrl("/fixtures");
   }

    numMapValidator(control: FormControl) {
      const course: EntryCourse = (this.fixture.courses.find(control.value));
      if (course.reservedMaps < course.maxMaps) {
          return null;
      } else {
          return { 'maxMapsExceeded': true };
      }
    }
}
