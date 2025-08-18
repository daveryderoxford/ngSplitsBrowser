/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Pipe, PipeTransform } from '@angular/core';
import { sbTime, TimeUtilities } from './time';
import { isNotNullNorNaN } from './results_util';

@Pipe({
   name: 'formatTime',
   standalone: true
})
export class FormatTimePipe implements PipeTransform {
   transform(time: sbTime, hoursOnly: boolean = false): string {
      return TimeUtilities.formatTime(time, hoursOnly);
   }
}

@Pipe({
   name: 'bracketed',
   standalone: true
})
export class BracketedPipe implements PipeTransform {
   transform(pos: number): string {
      return isNotNullNorNaN(pos) ? `(${pos.toString()})` : "";
   }
}
