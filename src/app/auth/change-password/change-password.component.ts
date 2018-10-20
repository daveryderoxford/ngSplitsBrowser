import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  form: FormGroup;
  error = '';

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private afAuth: AngularFireAuth) {
    this.form = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    }, { validator: this.passwordMissMatch });

  }

  passwordMissMatch(g: FormGroup): any {
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

    const user = this.afAuth.auth.currentUser;
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

