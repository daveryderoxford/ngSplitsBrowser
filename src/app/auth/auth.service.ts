import { Injectable, computed, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, User, authState } from '@angular/fire/auth';

@Injectable( {
    providedIn: 'root'
  } )
  export class AuthService {
      private auth = inject(Auth);
    user: Signal<User | null | undefined>;
    isTreasurer = computed( () => this.user()?.uid == 'mSHcPGvXG0NxYPqBlMopoKDjrty1');

    constructor( ) {

        this.user = toSignal( this.authState(auth) );
    }
  }

