/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Component, inject, signal } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { Toolbar } from 'app/shared/components/toolbar';

@Component({
  selector: 'app-recover',
  templateUrl: './recover-password.html',
  styleUrls: ['./recover-password.scss'],
  imports: [FlexModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink, Toolbar]
})
export class RecoverComponent {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private afAuth = inject(Auth);
  private snackBar = inject(MatSnackBar);

  loading = signal(false);

  recoverForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
  });

  async recover() {
    const emailAddress = this.recoverForm.get('email')!.value!;

    try {
      this.loading.set(true);
      await sendPasswordResetEmail(this.afAuth, emailAddress);
      this.router.navigate(["/auth/login"]);
    } catch (err) {
      console.log('RecoverComponent: Error requesting password reset for email');
      this.snackBar.open('Error requesting password reset for email', 'Close', { duration: 3000 });
    } finally {
      this.loading.set(false);
    }
  }
}
