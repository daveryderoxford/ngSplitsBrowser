/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { DialogsService } from '../dialogs/dialogs.service';

export interface ComponentCanDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PendingChangesGuard {
  private ds = inject(DialogsService);

  canDeactivate(component: ComponentCanDeactivate, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (component.canDeactivate()) {
      return true;
    } else {
      return this.ds.confirm(' Unsaved changes',
        'You have unsaved changes.  
 Press Cancel to go back and save these changes, or OK to lose these changes.');
    }
  }
}
