/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    selector: 'app-about-item',
    template: `
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>
        {{title()}}
      </mat-panel-title>
    </mat-expansion-panel-header>
    <ng-content  />
  </mat-expansion-panel>
  `,
  styles: `
  `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatExpansionModule]
})
export class AboutItem {

  title = input<string>();

}
