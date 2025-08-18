/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { firebaseConfig } from './app.firebase-config';

export const appConfig: ApplicationConfig = {
   providers: [
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideAppCheck(() =>
         initializeAppCheck(getApp(), {
            provider: new ReCaptchaV3Provider('6LeZk6ErAAAAAGgWJC1Fascom_OnVKNlondSp0eL'), isTokenAutoRefreshEnabled: true
         })),
      provideHttpClient(),
      provideRouter(APP_ROUTES, 
         withPreloading(PreloadAllModules),
         withComponentInputBinding(),
      //  withDebugTracing(),
      ),
   ],
};
