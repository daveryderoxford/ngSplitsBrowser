import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResultsSelectionService } from 'app/results/results-selection.service';

@Component({
   selector: 'app-course-or-class',
   template: `
      <mat-checkbox labelPosition="before" [checked]="this.rs.courseOrClass()" [formControl]="courseOrClassCheck">
         Course 
      </mat-checkbox>
  `,
   imports: [MatCheckboxModule, ReactiveFormsModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseOrClassCheckbox {
   rs = inject(ResultsSelectionService);

   courseOrClassCheck = new FormControl(this.rs.courseOrClass());

   ngOnInit() {
      this.courseOrClassCheck.valueChanges.subscribe((courseDisplayed: boolean) => {
         this.rs.setCourseOrClass(courseDisplayed);
      });
   }
}
