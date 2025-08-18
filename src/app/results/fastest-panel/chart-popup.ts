/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, computed, input, signal } from '@angular/core';
import { Results } from '../model/results';
import { Course } from '../model/course';
import { CourseClass } from '../model/course-class';
import { FormatTimePipe } from '../model/results-pipes';

@Component({
   selector: 'app-fastest-panel',
   imports: [FormatTimePipe],
   template: `
   <div class="chartPopup" style="position: absolute; left: 496px; top: 278.5px;">
      <div class="chartPopupHeader">
         <span>title()</span>
      </div>
      <div class="chartPopupTableContainer">
         <table>
            @for (split of fastestSplitsForLeg(); track split.name) {
               <tr [class.primary]="split.className.localeCompare(selectedClass()?.name)">
                  <td class="mat-body-medium"> {{split.name}}</td>
                  <td class="mat-body-medium"> {{split.split | formatTime}}</td>
               </tr>
            }
         </table>
      </div>
</div>
    `, 
   styles: `
   `
})
export class LegSplitsPopup {

   results = input.required<Results>();
   leg = input<number>(0);
   course = input.required<Course>();
   selectedClass = input.required<CourseClass>();

   startCode = computed(() => this.leg() === 0 ? '' : this.course()?.getControlCode(this.leg() - 1));

   endCode = computed(() => this.leg() === 0 ? '' : this.course()?.getControlCode(this.leg()));

   fastestSplitsForLeg = computed(() =>
      this.results().getFastestSplitsForLeg(this.startCode(), this.endCode()));

}
