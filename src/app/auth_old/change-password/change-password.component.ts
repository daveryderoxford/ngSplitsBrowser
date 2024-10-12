import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, UntypedFormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';

import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { ToolbarComponent } from '../../shared/components/toolbar.component';

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss'],
    standalone: true,
    imports: [ToolbarComponent, FlexModule, MatLegacyCardModule, ReactiveFormsModule, MatLegacyFormFieldModule, MatLegacyInputModule, MatLegacyButtonModule]
})
export class ChangePasswordComponent {
  form: UntypedFormGroup;
  error = '';

  constructor(private router: Router,
    private formBuilder: UntypedFormBuilder,
    private afAuth: AngularFireAuth) {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMissMatch });

  }

  passwordMissMatch(g: UntypedFormGroup): any {
    const p1 = g.get('password');
    const p2 = g.get('confirmPassword');
    let ret: { [error: string]: any } = {};

    if ((p1.touched || p2.touched) &&
      (p1.value !== p2.value) &&
      (p2 !== null)) {
      ret = { passwordMissMatch: true };
    }

    return (ret);
  }

  async changePassword() {

    const user = await this.afAuth.currentUser;
    const password = this.form.get('password').value;

    this.error = '';

    try {
      await user.updatePassword(password);
      this.router.navigateByUrl('/');

    } catch (error) {
      console.log('SignupComponent: Error updating password:' + error.code + '  ' + error.message);
      this.error = 'Error updating password';
    }
  }
}

