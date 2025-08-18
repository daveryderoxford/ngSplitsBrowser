/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, inject } from '@angular/core';
import { SidenavService } from 'app/shared/services/sidenav.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-sidenav-button',
    template: `
  <a mat-icon-button class="menu" (click)='openSidenav()'>
    <mat-icon class= "material-icons md-26"> menu </mat-icon>
  </a>
    `,
    imports: [MatButtonModule, MatIconModule]
})
export class SidenavButton {
      public sidenavService = inject(SidenavService);

  openSidenav() {
    this.sidenavService.open();
  }
}
