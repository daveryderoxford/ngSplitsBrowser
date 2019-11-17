/** Edit  map reservation details from the database
 *  Takes fixture id as a route parameter.
 *  Uses EntryService to create FixtureEntryDetails for the fixture of they do not already exist
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipList } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { EntryCourse, FixtureEntryDetails } from 'app/model/entry';
import { Observable } from 'rxjs';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { EntryService } from '../entry.service';
import { switchMap, tap } from 'rxjs/operators';

@Component( {
  selector: 'app-map-registration-admin',
  templateUrl: './map-registration-admin.component.html',
  styleUrls: ['./map-registration-admin.component.scss'],
} )
export class MapRegistrationAdminComponent implements OnInit {

  @ViewChild( "MatChipList", { static: true } ) matChipList: MatChipList;

  form: FormGroup;
  details: FixtureEntryDetails;

  constructor ( private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    public snackbar: MatSnackBar,
    private es: EntryService ) { }

  ngOnInit() {

    this.route.paramMap.pipe(
      tap( ( params: ParamMap ) => this.es.setSelectedEntry( params.get( 'id' ) ) )
    );

    this.es.selectedEntryDetails$.subscribe( ( details ) => this.details = details );

    this.form = this.formBuilder.group( {
      closingDate: [this.details.closeingDate, [Validators.required]],
    } );

    this.matChipList.chipSelectionChanges.subscribe( ( evt ) => {
      const course = evt.source.value as EntryCourse;
      this._displayCourseDialog( course);
    } );

    // Subscribe to router events to display dialog

  }

  /** Add Course via dialog */
  addCourse(): void {
    const course: EntryCourse = {
      name: "",
      maxMaps: 0,
      reservedMaps: 0,
    };

    this._displayCourseDialog( course );

    this.details.courses.push( course );

  }

  removeCourse( course: EntryCourse ): void {
    const index = this.details.courses.indexOf( course );

    if ( index >= 0 ) {
      this.details.courses.splice( index, 1 );
    }
  }

  private _displayCourseDialog( course: EntryCourse ): Observable<EntryCourse> {

    const dialogRef = this.dialog.open( CourseDialogComponent, {
      width: '320px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      data: { hasAgeClasses: false, course: course },
    } );

    return dialogRef.afterClosed();
  }

  /** Validate course name is unique */
  validateCourses( courses: EntryCourse[] ) {
    const names = courses.map( ( course => course.name ) );
    return names.filter( ( name, index ) => names.indexOf( name ) !== index );
  }

  async onSubmit() {
    if ( !this.validateCourses( this.details.courses ) ) {
      this.snackbar.open( "Duplicate course names", "", { duration: 2000 } );
      return;
    }
    await this.es.updateEntryDetails( this.details );
  }
}
