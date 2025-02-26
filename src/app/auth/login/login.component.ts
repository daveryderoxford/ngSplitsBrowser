import { Component, OnInit, inject, input } from '@angular/core';
import {
   Auth,
   FacebookAuthProvider, GoogleAuthProvider, UserCredential, getRedirectResult,
   signInWithEmailAndPassword, signInWithPopup, signInWithRedirect
} from '@angular/fire/auth';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { ToolbarComponent } from 'app/shared/components/toolbar.component';

export type AuthType = "EmailAndPassword" | "Google" | "Facebook";

const facebookAuthProvider = new FacebookAuthProvider();
const googleAuthProvider = new GoogleAuthProvider();

const isInStandaloneMode = () =>
   (window.matchMedia('(display-mode: standalone)').matches) ||
   ((window.navigator as any).standalone) ||
   document.referrer.includes('android-app://');

@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.scss'],
   imports: [MatCardModule, ToolbarComponent, FlexModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, RouterLink]
})
export class LoginComponent {
   private router = inject(Router);
   private formBuilder = inject(NonNullableFormBuilder);
   private afAuth = inject(Auth);
   private snackBar = inject(MatSnackBar);

   loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
   });

   loading = false;

   returnUrl = input(''); //Route parameter

   async loginFormSubmit() {
      if (this.loginForm.valid) {
         await this.signInWith("EmailAndPassword", this.loginForm.getRawValue());
      }
   }

   async signInWith(provider: AuthType, credentials?: { email: string, password: string; }) {

      try {
         this.loading = true;

         switch (provider) {

            case "EmailAndPassword":
               await signInWithEmailAndPassword(this.afAuth, credentials!.email, credentials!.password);
               break;

            case "Google":
               await this._thirdPartySignIn(googleAuthProvider);
               break;

            case "Facebook":
               await this._thirdPartySignIn(facebookAuthProvider);
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
   private async _thirdPartySignIn(provider: GoogleAuthProvider | FacebookAuthProvider): Promise<UserCredential | null> {
      if (isInStandaloneMode()) {
         await signInWithRedirect(this.afAuth, provider);
         const result = await getRedirectResult(this.afAuth);
         if (result === null || result.user === null) {
            return null;
         }
         return result;
      } else {
         return await signInWithPopup(this.afAuth, provider);
      }
   }

   private _handleSigninError(err: any) {
      console.log('LoginComponent: Error loging in.  Error code:' + + err.code + '  ' + err.message);
      this.snackBar.open('Error updating password', 'Close', { duration: 3000 });
   }

   private _handleSignInSuccess() {
      console.log('LoginComponent: Successful login');
      this.router.navigateByUrl(this.returnUrl());
   }
}
