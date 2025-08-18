/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, OnInit, input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
    selector: 'app-spinner',
    template: `
     @if (loading()) {
       <div class="loading-spinner">
         <mat-spinner mode="indeterminate" color="accent" diameter="40"  />
       </div>
     }
     `,
    styleUrls: ['./spinner.scss'],
    imports: [MatProgressSpinnerModule]
})
export class SpinnerComponent {

  loading = input(false);
}
