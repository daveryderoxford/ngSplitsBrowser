/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginSnackbarService {
      private snackbar = inject(MatSnackBar);
      private router = inject(Router);
  target: string;

  open(message: string, target?: string) {
    const snackBarRef = this.snackbar.open( message, "Login", { duration: 3000 });

    snackBarRef.onAction().subscribe( () => {
       this.router.navigate(["/auth/login"]);
       this.target = target;
    } );
  }
}
