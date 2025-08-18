/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState, signOut } from '@angular/fire/auth';
import { from, map, of, switchMap } from 'rxjs';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   auth = inject(Auth);

   private user$ = authState(this.auth).pipe(
      map(val => val === null ? undefined : val)
   );
   
   user = toSignal(this.user$);

   loggedIn = computed<boolean>( () => this.user() !== undefined );

   // TODO could implement with secure firestore collection or custom claim at some point
   isAdmin = computed <boolean>( () => {
      return this.user() ? this.user().uid === 'l8Rex76EDGTME2i44gbpcF7EKOH2' : false;
   });
   
   async signOut(): Promise<void> {
      return signOut(this.auth);
   }
}
