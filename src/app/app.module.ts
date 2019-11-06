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
import { AboutModule } from './about/about.module';
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { firebaseConfig } from "./app.firebase-config";
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { LoginComponent } from "./auth/login/login.component";
import { RecoverComponent } from "./auth/recover/recover.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EventAdminModule } from "./event-admin/event-admin.module";
import { AllEventsTabComponent } from './events/all-events-tab/all-events-tab.component';
import { ClubEventsTabComponent } from './events/club-events-tab/club-events-tab.component';
import { EventsTableComponent } from './events/events-table/events-table.component';
import { EventsViewComponent } from "./events/eventsview/events-view.component";
import { MyEventsTabComponent } from './events/my-events-tab/my-events-tab.component';
import { MyResultsTableComponent } from './events/my-results-table/my-results-table.component';
import { FixturesModule } from './fixtures/fixtures.module';
import { PaymentModule } from './payments/payment.module';
import { ResultsModule } from "./results/results.module";
import { SharedModule } from "./shared/shared.module";
import { ResultsFoundDialogComponent } from './user/results-found-dialog/results-found-dialog.component';
import { UserComponent } from "./user/user.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    ChangePasswordComponent,
    EventsViewComponent,
    UserComponent,
    EventsTableComponent,
    AllEventsTabComponent,
    ClubEventsTabComponent,
    MyEventsTabComponent,
    MyResultsTableComponent,
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
    ResultsModule,
    AboutModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
