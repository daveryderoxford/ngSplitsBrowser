/** Entry course dialog  */
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntryCourse } from 'app/model/entry';


@Component( {
  selector: 'app-course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
} )
export class CourseDialogComponent implements OnInit {

  form: UntypedFormGroup;
  hasAgeClasses: boolean;

  constructor ( private formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject( MAT_DIALOG_DATA ) public data: { hasAgeClasses: boolean, course: EntryCourse } ) { }

  ngOnInit() {
    const course = this.data.course;
    this.hasAgeClasses = this.data.hasAgeClasses;

    this.form = this.formBuilder.group( {
      name: [course.name, Validators.required],
      maxMaps: [course.maxMaps, [Validators.min( 0 ), Validators.pattern( "^[0-9]+$" )]],
      distance: [course.distance, Validators.min( 0 )],
      climb: [course.climb, [Validators.min( 0 ), Validators.pattern( "^[0-9]+$" )]],
      ageClasses: [course.ageClasses],
      reservedMaps: [course.reservedMaps]  // No associated control
    } );
  }

  onSubmit() {
    this.dialogRef.close( this.form.value );
  }

}
