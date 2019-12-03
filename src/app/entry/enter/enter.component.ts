import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { UserData } from 'app/model';
import { Entry, EntryCourse, FixtureEntryDetails } from 'app/model/entry';
import { take } from 'rxjs/operators';
import { EntryService } from '../entry.service';
import { UserDataService } from 'app/user/user-data.service';
import { forkJoin } from 'rxjs';

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
         this.fixtureId = params.get('fixtureId');
         this.id = params.get('entryId');

         // Read event details (for courses)

         const fixture$ = this.es.getEntryDetails(this.fixtureId).pipe(take(1));

         if (!this.id) {
            fixture$.subscribe(fix => {
               this.fixture = fix;

               if (this.usd.currentUserData) {
                  const user = this.usd.currentUserData;
                  this._createForm({
                     firstname: user.firstname,
                     surname: user.surname,
                     club: user.club,
                     course: ""
                  });
               } else {
                  this._createForm({});
               }
            });
         } else {
            const entry$ = this.es.getEntry$(this.fixtureId, this.id).pipe(take(1));
            forkJoin(fixture$, entry$).subscribe(([fix, entry]) => {
               this.fixture = fix;
               this._createForm(entry);
            });
         }
      });
   }


   private _createForm(data: FormData | null) {
      this.form = this.formBuilder.group({
         firstname: [data.firstname, Validators.required],
         surname: [data.surname, Validators.required],
         club: [data.club, [Validators.minLength( 2 ), Validators.maxLength( 10 )]],
         course: [data.course, Validators.required]
      });
   }

   async onSubmit() {

      // Check entry limit

      if (!this.id) {
         // Create new instance and save it
         //   const details = this.es.createEntry();
         await this.es.enter(this.fixture, this.form.value);
      } else {
         await this.es.updateEntry(this.fixtureId, this.id, this.form.value);
      }
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
