import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import "hammerjs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { firebaseConfig } from "./app.firebase-config";
import { EventAdminModule } from "./event-admin/event-admin.module";
import { FixturesModule } from './fixtures/fixtures.module';
import { PaymentModule } from './payments/payment.module';
import { SharedModule } from "./shared/shared.module";
import { ResultsFoundDialogComponent } from './user/results-found-dialog/results-found-dialog.component';
import { UserComponent } from "./user/user.component";


@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    ResultsFoundDialogComponent,
  ],
  entryComponents: [
    ResultsFoundDialogComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    EventAdminModule,
    SharedModule,
    HttpClientModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    FixturesModule,
    PaymentModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
