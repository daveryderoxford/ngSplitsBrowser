import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import firebase from "firebase/compat/app";

export type AuthProvider = "EmailAndPassword" | "Google" | "Facebook";

const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

 const isInStandaloneMode = () =>
   ( window.matchMedia( '(display-mode: standalone)' ).matches ) ||
   ( ( window.navigator as any ).standalone ) ||
   document.referrer.includes( 'android-app://' )

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
   loginForm: UntypedFormGroup;
   error: string;
   loading = false;
   returnUrl: string;

   constructor (private route: ActivatedRoute,
      private router: Router,
      private formBuilder: UntypedFormBuilder,
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

   async signInWith(provider: AuthProvider, credentials?: {email: string, password: string} ) {

      let userCredentials: firebase.auth.UserCredential;

      try {
         this.loading = true;
         this.error = '';

         switch (provider) {

            case "EmailAndPassword":
               userCredentials = await this.afAuth.signInWithEmailAndPassword( credentials.email, credentials.password );
               break;

            case "Google":
               userCredentials = await this._thirdPartySignIn(googleAuthProvider);
               break;

            case "Facebook":
               userCredentials = await this._thirdPartySignIn(facebookAuthProvider);
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
      if (isInStandaloneMode()) {
         await firebase.auth().signInWithRedirect(provider);
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
