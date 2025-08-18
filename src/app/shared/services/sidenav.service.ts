/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable( {
   providedIn: 'root'
} )
export class SidenavService {

   private sidenav: MatSidenav | null = null;

   constructor () { }

   public setSidenav( sidenav: MatSidenav ) {
      this.sidenav = sidenav;
   }

   public open() {
      return this.sidenav!.open();
   }

   public close() {
      return this.sidenav!.close();
   }

   public toggle(): void {
      this.sidenav!.toggle();
   }
}
