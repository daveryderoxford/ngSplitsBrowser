import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { firebaseConfig } from './app.firebase-config';
import { APP_ROUTES } from './app-routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
   providers: [
      provideFirebaseApp(() => initializeApp(firebaseConfig)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideStorage(() => getStorage()), 
      provideHttpClient(),
      provideRouter(APP_ROUTES, 
         withPreloading(PreloadAllModules),
         withDebugTracing(),
      ),
      provideAnimationsAsync(), 
   ],
};
