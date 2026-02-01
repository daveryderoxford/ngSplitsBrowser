import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideCheckNoChangesConfig, provideZonelessChangeDetection } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { initializeAppCheck, provideAppCheck, ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { firebaseConfig } from './app.firebase-config';

if  (isDevMode()) {
   (<any>window).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
   console.log('AppCheck configured in debug mode')
}

export const appConfig: ApplicationConfig = {
   providers: [
      provideZonelessChangeDetection(),
      provideCheckNoChangesConfig({exhaustive: true, interval: 1000}),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFunctions(() => getFunctions(getApp(), 'europe-west2')),
      provideAppCheck(() =>
         initializeAppCheck(getApp(), {
            provider: new ReCaptchaEnterpriseProvider('6LfC1dUrAAAAAH6_S3uOuk--gDUsbLivZ4lDEgH0'), isTokenAutoRefreshEnabled: true
         })),
      provideRouter(APP_ROUTES, 
         withComponentInputBinding(),
      //  withDebugTracing(),
      ),
   ],
};
