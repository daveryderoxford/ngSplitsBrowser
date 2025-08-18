/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Routes } from '@angular/router';
import { ChangePassword } from './change-password/change-password';
import { AuthGuard } from './guards/auth-guard';
import { LoginComponent } from './login/login';
import { RecoverComponent } from './recover/recover-password';
import { Signup } from './signup/signup';

export const AUTH_ROUTES: Routes = [
  { path: "login", component: LoginComponent, title: 'Splitsbrowser Login' },
  { path: "signup", component: Signup, title: 'SplitsbrowserSignup' },
  { path: "recover", component: RecoverComponent, title: 'Splitsbrowser Recover password' },
  { path: "change-password", component: ChangePassword, canActivate: [AuthGuard], title: 'Splitsbrowser Change password'},
];
