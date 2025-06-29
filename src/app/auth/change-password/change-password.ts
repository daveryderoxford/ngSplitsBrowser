import { Component, inject } from '@angular/core';
import { Auth, updatePassword } from '@angular/fire/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { Toolbar } from '../../shared/components/toolbar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseError } from '@angular/fire/app';
import { getFirebaseErrorMessage } from '../firebase-error-messages';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.scss'],
  imports: [FlexModule, MatCardModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, Toolbar]
})
export class ChangePassword {
  private router = inject(Router);
  private formBuilder = inject(FormBuilder);
  private afAuth = inject(Auth);
  private snackBar = inject(MatSnackBar);

  form = this.formBuilder.group({
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validator: this.passwordMissMatch });

  passwordMissMatch(g: FormGroup): ValidationErrors | null {
    const p1 = g.get('password')!;
    const p2 = g.get('confirmPassword')!;
    let ret: ValidationErrors = {};

    if ((p1.touched || p2.touched) &&
      (p1.value !== p2.value) &&
      (p2 !== null)) {
      ret = { passwordMissMatch: true };
    }

    return (ret);
  }

  async changePassword() {

    const user = await this.afAuth.currentUser!;
    const password = this.form.get('password')!.value;

    try {
      await updatePassword(user, password);
      this.router.navigateByUrl('/');

    } catch (e: unknown) {
      let msg = 'Unexpected error updating passowrd. Please try again.';
      if (e instanceof FirebaseError) {
        msg = getFirebaseErrorMessage(e);
        console.log(`SignupComponent: Error updating password  Error code: ${e.code} msg: ${msg}`);
      } else if (e instanceof Error) {
        console.log('SignupComponent: Error updating password:' + msg);
      } else {
        console.log('SignupComponent: Unexpected error updating password');
      }
      this.snackBar.open('Error updating password', 'Close', { duration: 3000 });
    }
  }
}
