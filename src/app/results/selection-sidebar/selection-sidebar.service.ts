/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Injectable, signal } from '@angular/core';

@Injectable({
   providedIn: 'root',
})
export class SelectionSidebarService {

    _isOpen = signal(true);

   isOpen = this._isOpen.asReadonly();

   toggle() {
      this._isOpen.set(!this._isOpen());
   }
}
