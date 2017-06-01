import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AngularFireAuth } from 'angularfire2/auth';


@Injectable()
export class UnauthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.afAuth.authState
      .take(1)
      .map(user => !user)
      .do(unauthenticated => {
        if (!unauthenticated) {
          this.router.navigate(['/']);
        }
      });
  }
}
