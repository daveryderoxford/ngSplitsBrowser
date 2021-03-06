import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { Utils } from 'app/shared';

export type AuthProvider = "EmailAndPassword" | "Google" | "Facebook";

const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

interface LoginCredentials {
   email: string;
   passord: string;
}

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginForm: FormGroup;
   error: string;
   loading = false;
   returnUrl: string;

   constructor (private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder,
      private afAuth: AngularFireAuth) { }

   ngOnInit() {
      this.route.queryParams.subscribe( params => {
         this.returnUrl = params[ 'returnUrl' ];
      } );

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

      let user: firebase.auth.UserCredential;

      try {
         this.loading = true;
         this.error = '';

         switch (provider) {

            case "EmailAndPassword":
              user = await this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password);
               break;

            case "Google":
               user = await this._thirdPartySignIn(googleAuthProvider);
               break;

            case "Facebook":
               user = await this._thirdPartySignIn(facebookAuthProvider);
               break;
         }
         this._handleSignInSuccess();
      } catch (err) {
         this._handleSigninError(err);
      } finally {
         this.loading = false;
      }
   }

   /** Sign in with redirect for PWA and popup for browser.
    * Sign in with popup avoids re-loading the application on the browser.
    * TODO Review which method is better for mobile devices where popups are not handled as well
   */
   private async _thirdPartySignIn(provider): Promise<firebase.auth.UserCredential> {
      if (Utils.isInStandaloneMode()) {
         firebase.auth().signInWithRedirect(provider);
         return await firebase.auth().getRedirectResult();
      } else {
         return await this.afAuth.signInWithPopup(provider);
      }
   }

   private _handleSigninError(err: any) {
      console.log('LoginComponent: Error loging in.  Error code:' + + err.code + '  ' + err.message);
      this.error = 'Login attempt failed';
   }

   private _handleSignInSuccess() {
      console.log('LoginComponent: Successful login');
      this.error = '';
      this.router.navigateByUrl(this.returnUrl);
   }
}

