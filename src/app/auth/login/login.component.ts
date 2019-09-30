import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

export type AuthProvider = "EmailAndPassword" | "Google" | "Facebook";

const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
   error: string;
   loading = false;

   constructor(private router: Router,
      private formBuilder: FormBuilder,
      private afAuth: AngularFireAuth) { }

   ngOnInit() {
      this.loginForm = this.formBuilder.group({
         email: ['', [Validators.required, Validators.email]],
         password: ['', Validators.required]
      });

      this.error = '';
   }

   async loginFormSubmit() {
      if (this.loginForm.valid) {
         await this.signInWith("EmailAndPassword", this.loginForm.value);
      }
   }

   async signInWith(provider: AuthProvider, credentials?: any) {

      try {
         this.loading = true;
         this.error = '';

         switch (provider) {

            case "EmailAndPassword":
               await this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password);
               break;

            case "Google":
               await this.afAuth.auth.signInWithPopup(googleAuthProvider);
               break;

            case "Facebook":
               await this.afAuth.auth.signInWithPopup(facebookAuthProvider);
               break;
         }
         this._handleSignInSuccess();
      } catch (err) {
         this._handleSigninError(err);
      } finally {
         this.loading = false;
      }
   }

   private _handleSigninError(err: any) {
      console.log('LoginComponent: Error loging in.  Error code:' + + err.code + '  ' + err.message);
      this.error = 'Login attempt failed';
   }

   private _handleSignInSuccess() {
      console.log('LoginComponent: Successful login');
      this.error = '';
      this.router.navigate(['/']);
   }
}
