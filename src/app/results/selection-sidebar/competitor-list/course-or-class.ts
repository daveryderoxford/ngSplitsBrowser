/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResultsSelectionService } from 'app/results/results-selection.service';

@Component({
   selector: 'app-course-or-class',
   template: `
      <mat-checkbox labelPosition="before" [formControl]="courseOrClassCheck"> 
         Course 
      </mat-checkbox>
  `,
   imports: [MatCheckboxModule, ReactiveFormsModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourseOrClassCheckbox {
   rs = inject(ResultsSelectionService);

   courseOrClassCheck = new FormControl(false);

   ngOnInit() {
      this.courseOrClassCheck.valueChanges.subscribe((courseDisplayed: boolean) => {
         this.rs.setCourseOrClass(courseDisplayed);
      });
   }
}
