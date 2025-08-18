/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
   name: 'ellipsis',
   standalone: true
})
export class EllipsisPipe implements PipeTransform {
   transform(val: string | null, args: number | undefined) {
      if (args === undefined) {
         return val;
      }

      if (val && val.length > args) {
         return val.substring(0, args) + '...';
      } else {
         return val;
      }
   }
}
