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
        'You have unsaved changes.  \n Press Cancel to go back and save these changes, or OK to lose these changes.');
    }
  }
}
