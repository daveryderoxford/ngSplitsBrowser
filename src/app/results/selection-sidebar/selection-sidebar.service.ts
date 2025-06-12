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