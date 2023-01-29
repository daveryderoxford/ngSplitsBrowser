import { HttpClientModule } from "@angular/common/http";
import { ErrorHandler, NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { firebaseConfig } from "./app.firebase-config";
import { GlobalErrorHandler } from './errorHandler';
import { FixturesModule } from './fixtures/fixtures.module';
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ServiceWorkerModule.register( '/ngsw-worker.js', { enabled: environment.production } ),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    SharedModule,
    HttpClientModule,
    FixturesModule,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
})
export class AppModule { }
