import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, User, authState, signOut } from '@angular/fire/auth';

@Injectable({
   providedIn: 'root'
})
export class AuthService {
   auth = inject(Auth);
   
   user = toSignal<User | null | undefined >(authState(this.auth));

   loggedIn = computed<boolean>( () => this.user() !== null );

   isAdmin = computed( () => this.user().uid ==='xxxxxxx');

   async signOut(): Promise<void> {
      return signOut(this.auth);
   }
}
