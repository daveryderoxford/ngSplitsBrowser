/** Edit  map reservation details from the database
 *  Takes fixture id as a route parameter.
 *  Uses EntryService to create FixtureEntryDetails for the fixture of they do not already exist
*/
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Fixture } from 'app/model';
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
   error = '';
   coursesChanged = false;
   minDate = new Date();

   // Edit date
   courses: EntryCourse[];
   id: string;
   new = false;
   fixture: Fixture = null;

   constructor(private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      public dialog: MatDialog,
      public snackbar: MatSnackBar,
      private es: EntryService) { }

   ngOnInit() {
      this.form = this.formBuilder.group({
         closingDate: ["", [Validators.required]],
      });

      this.route.paramMap.subscribe((params: ParamMap) => {
         this.id = params.get('id');
         this.new = params.has('new');
         if (params.has('fixture')) {
            this.fixture = JSON.parse(params.get('fixture'));
         }

         if (this.new) {
            this.courses = [];
            this.form.patchValue({ closingDate: new Date().toISOString() });
         } else {
            this.es.getEntryDetails(this.id).pipe(take(1))
               .subscribe(details => {
                  this.form.patchValue(details);
                  this.courses = JSON.parse(JSON.stringify(details.courses));
               });
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
            this.courses.push(c);
            this.coursesChanged = true;
         }
      });
   }

   removeCourse(course: EntryCourse) {
      const index = this.courses.indexOf(course);

      if (index >= 0) {
         this.courses.splice(index, 1);
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
      if (this.courses.length === 0) {
         this.snackbar.open("Error - At least one course must be defined", "", { duration: 2000 });
         return;
      }

      if (this._duplicateCourseNames(this.courses).length !== 0) {
         this.snackbar.open("Error - Course names must be unique", "", { duration: 2000 });
         return;
      }

      // TODO Make the control return an ISO string
      // Temp workaround
      const closingDate = new Date(this.form.get('closingDate').value).toISOString();

      if (this.new) {
         // Create new instance and save it
         const details = this.es.createNewEntryDetails(this.id, this.fixture);
         details.closingDate = closingDate;
         details.courses = this.courses;
         await this.es.saveNewEntryDetails(details);
      } else {
         const update: Partial<FixtureEntryDetails> = {
            closingDate: closingDate,
            courses: this.courses
         };
         await this.es.updateEntryDetails(this.id, update);
      }
      await this.router.navigateByUrl("/fixtures");
   }
}
