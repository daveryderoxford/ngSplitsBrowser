
import { enableProdMode, ErrorHandler, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from 'environments/environment';
import { AppComponent } from './app/app.component';
import { ResultsModule } from './app/results/results.module';
import { EventsModule } from './app/events/events.module';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { SharedModule } from './app/shared/shared.module';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { firebaseConfig } from './app/app.firebase-config';
import { AngularFireModule } from '@angular/fire/compat';
import { AppRoutingModule } from './app/app-routing.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ReactiveFormsModule } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { GlobalErrorHandler } from './app/errorHandler';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBarModule } from '@angular/material/legacy-snack-bar';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, ReactiveFormsModule, ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }), AppRoutingModule, AngularFireModule.initializeApp(firebaseConfig), AngularFirestoreModule, AngularFireStorageModule, SharedModule, EventsModule, ResultsModule),
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(MatLegacyDialogModule, MatLegacySnackBarModule),

    ]
});
