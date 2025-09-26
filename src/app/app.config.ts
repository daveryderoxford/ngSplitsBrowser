import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection, provideCheckNoChangesConfig } from '@angular/core';
import { getApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAppCheck, initializeAppCheck, ReCaptchaV3Provider, ReCaptchaEnterpriseProvider } from '@angular/fire/app-check';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { firebaseConfig } from './app.firebase-config';

export const appConfig: ApplicationConfig = {
   providers: [
      provideZonelessChangeDetection(),
      provideCheckNoChangesConfig({exhaustive: true, interval: 1000}),
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideAppCheck(() =>
         initializeAppCheck(getApp(), {
            provider: new ReCaptchaEnterpriseProvider('6LfC1dUrAAAAAH6_S3uOuk--gDUsbLivZ4lDEgH0'), isTokenAutoRefreshEnabled: true
         })),
      provideHttpClient(),
      provideRouter(APP_ROUTES, 
         withPreloading(PreloadAllModules),
         withComponentInputBinding(),
      //  withDebugTracing(),
      ),
   ],
};
