/** Edit  map reservation details from the database
 *  Takes fixture id as a route parameter.
 *  Uses EntryService to create FixtureEntryDetails for the fixture of they do not already exist
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { EntryCourse, FixtureEntryDetails } from 'app/model/entry';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { EntryService } from '../entry.service';

@Component({
   selector: 'app-map-registration-admin',
   templateUrl: './map-registration-admin.component.html',
   styleUrls: ['./map-registration-admin.component.scss'],
})
export class MapRegistrationAdminComponent implements OnInit {

   form: FormGroup;
   details: FixtureEntryDetails;
   error = '';
   coursesChanged = false;
   minDate = new Date();

   constructor(private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      public snackbar: MatSnackBar,
      private es: EntryService) { }

   private new = false;

   ngOnInit() {

      this.form = this.formBuilder.group({
         closingDate: ["", [Validators.required]],
      });

      this.route.paramMap.subscribe((params: ParamMap) => {
         this.new = params.has('new');
         if (this.new) {
            this.details = {
               fixtureId: params.get('id'),
               userId: "1",
               type: 'MapReservation',
               closingDate: new Date().toISOString(),
               hasAgeClasses: false,
               courses: []
            };
            this.form.patchValue(this.details);

         } else {
            this.es.getEntryDetails(params.get('id')).pipe(
               take(1),
               tap((details) => {
                  this.form.patchValue(details);
                  this.details = details;
               })
            );
         }
      });

   }

   /** Add Course via dialog */
   addCourse() {
      const course: EntryCourse = {
         name: "",
         maxMaps: 0,
         reservedMaps: 0,
      };

      this._displayCourseDialog(course).subscribe(c => {
         if (c) {
            this.details.courses.push(c);
            this.coursesChanged = true;
         }
      });
   }

   removeCourse(course: EntryCourse) {
      const index = this.details.courses.indexOf(course);

      if (index >= 0) {
         this.details.courses.splice(index, 1);
         this.coursesChanged = true;
      }
   }

   courseSelected(course: EntryCourse) {
      this._displayCourseDialog(course).subscribe(c => {
         if (c) {
            course = c;
            this.coursesChanged = true;
         }
      });
   }

   private _displayCourseDialog(course: EntryCourse): Observable<EntryCourse> {

      const dialogRef = this.dialog.open(CourseDialogComponent, {
         width: '250px',
         maxWidth: '100vw',
         maxHeight: '100vh',
         data: { hasAgeClasses: false, course: course },
      });

      return dialogRef.afterClosed();
   }

   /** Returns array of duplicate course names */
   private _duplicateCourseNames(courses: EntryCourse[]): string[] {
      const names = courses.map((course => course.name));
      const duplicateNames = names.filter((name, index) => names.indexOf(name) !== index);
      return duplicateNames;
   }

   async onSubmit() {
      if (this._duplicateCourseNames(this.details.courses).length !== 0) {
         this.snackbar.open("Error - Course names numst be unique", "", { duration: 2000 });
         return;
      }
      if (this.new) {
         await this.es.createEntryDetails(this.details);
      } else {
         await this.es.updateEntryDetails(this.details);
      }
      await this.router.navigateByUrl("/fixtures");
   }
}
