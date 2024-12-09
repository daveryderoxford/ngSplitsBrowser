import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PreloadAllModules, provideRouter, withDebugTracing, withPreloading } from '@angular/router';
import { APP_ROUTES } from './app-routes';
import { firebaseConfig } from './app.firebase-config';

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
