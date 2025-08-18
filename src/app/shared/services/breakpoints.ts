/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { BreakpointObserver } from '@angular/cdk/layout';
import { computed, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
   providedIn: 'root'
})
export class AppBreakpoints {
   static readonly narrowBreakpoint = '(max-width: 500px)';

   private observer = inject(BreakpointObserver);

   private _narrowSignal = toSignal(this.observer.observe([AppBreakpoints.narrowBreakpoint]));

   readonly narrowScreen = computed(() => this._narrowSignal().matches);

}
