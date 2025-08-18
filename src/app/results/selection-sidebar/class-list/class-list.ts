/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { CourseClass } from 'app/results/model';

@Component({
    selector: 'app-class-list',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatListModule],
    templateUrl: './class-list.html',
    styleUrl: './class-list.scss'
})
export class ClassList {

  classes = input.required<CourseClass[]>();
  selectedClass = input.required<CourseClass>();
  selected = output<CourseClass>()
}
