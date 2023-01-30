import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventGrades } from 'app/model';
import { GradeFilter } from 'app/model/fixture-filter';

@Component({
   selector: 'app-filter',
   templateUrl: './grade-filter-dialog.component.html',
   styleUrls: ['./grade-filter-dialog.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})

export class GradeFilterComponent implements OnInit {

   grades = EventGrades.grades;

   form: UntypedFormGroup;
   items: UntypedFormArray;

   constructor(private formBuilder: UntypedFormBuilder,
      public dialogRef: MatDialogRef<GradeFilterComponent>,
      @Inject(MAT_DIALOG_DATA) public data: GradeFilter[]) { }

   ngOnInit() {
      this.form = this.formBuilder.group({
         items: this.formBuilder.array([])
      });

      this.items = this.form.get('items') as UntypedFormArray;

      for (const gradeItem of this.data) {
         this.items.push(this.createItem(gradeItem));
      }
   }

   createItem(grade: GradeFilter): UntypedFormGroup {
      return this.formBuilder.group({
         name: grade.name,
         enabled: grade.enabled,
         distance: grade.distance,
         time: grade.time
      });
   }

   onSubmit() {
      const grades = this.items.value;
      this.dialogRef.close(grades);
   }

}
