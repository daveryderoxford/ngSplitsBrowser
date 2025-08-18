/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import {LoginComponent} from './login/login';
import {Signup} from './signup/signup';
import {RecoverComponent} from './recover/recover-password';
// import {MobileLoginComponent} from "./login.component.mobile";

export const AUTH_DECLARATIONS = [
  LoginComponent,
  Signup,
  RecoverComponent
];
