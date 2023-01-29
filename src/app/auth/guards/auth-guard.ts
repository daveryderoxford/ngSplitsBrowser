
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private afAuth: AngularFireAuth,
              private router: Router) { }

  canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState.pipe(
      take(1),
      map(user => !!user),
      tap(authenticated => {
        if (!authenticated) {
          // set query parameter returnUrl to redirect to the target url
          const redirectQueryParame = {
            queryParams: { returnUrl: state.url }
          };
          this.router.navigate( [ '/auth/login' ], redirectQueryParame );

        }
      })
    );
  }
}

