import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { GradeFilter } from 'app/fixtures/fixtures-options/fixtures-options.component';
import { EventGrade, EventGrades } from 'app/model';


@Component( {
  selector: 'app-filter',
  templateUrl: './grade-filter-dialog.component.html',
  styleUrls: [ './grade-filter-dialog.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
} )

export class GradeFilterComponent implements OnInit {

  grades = EventGrades.grades;

  form: FormGroup;
  items: FormArray;

  constructor ( private formBuilder: FormBuilder,
               public dialogRef: MatDialogRef<GradeFilterComponent>,
              @Inject( MAT_DIALOG_DATA ) public data: GradeFilter[] ) { }

  ngOnInit() {
    this.form = this.formBuilder.group( {
      items: this.formBuilder.array( [] )
    } );

    this.items = this.form.get( 'items' ) as FormArray;

    for (const gradeItem of this.data ) {
      this.items.push( this.createItem( gradeItem) );
    }
  }

  createItem( grade: GradeFilter): FormGroup {
    return this.formBuilder.group( {
      name: grade.name,
      enabled: grade.enabled,
      distance: grade.distance,
      time: grade.time
    } );
  }

  onSubmit() {
    const grades = this.items.value;
    this.dialogRef.close( grades );
  }

}
