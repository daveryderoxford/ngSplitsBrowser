import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AboutComponent } from "./about/about.component";
import { AppComponent } from "./app.component";
import { firebaseConfig } from "./app.firebase-config";
import { LoginComponent } from "./auth/login/login.component";
import { RecoverComponent } from "./auth/recover/recover.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EventAdminModule } from "./event-admin/event-admin.module";
import { EventsViewComponent } from "./events/eventsview/events-view.component";
import { MainComponent } from "./main/main.component";
import { GraphComponent } from "./results/graph/graph.component";
import { ResultsNavbarComponent } from "./results/results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "./results/results-search/results-search.component";
import { ResultsViewComponent } from "./results/results-view/results-view.component";
import { SharedModule } from "./shared/shared.module";
import { UserComponent } from "./user/user.component";
import "hammerjs";
import { AppRoutingModule } from "./app-routing.module";
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from 'environments/environment';
import { SplitsGridComponent } from './results/splits-grid/splits-grid.component';
import { EventsTableComponent } from './events/events-table/events-table.component';
import { AllEventsTabComponent } from './events/all-events-tab/all-events-tab.component';
import { ClubEventsTabComponent } from './events/club-events-tab/club-events-tab.component';
import { MyEventsTabComponent } from './events/my-events-tab/my-events-tab.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    MainComponent,
    EventsViewComponent,
    UserComponent,
    AboutComponent,
    GraphComponent,
    ResultsViewComponent,
    ResultsNavbarComponent,
    ResultsSearchComponent,
    ChangePasswordComponent,
    SplitsGridComponent,
    EventsTableComponent,
    AllEventsTabComponent,
    ClubEventsTabComponent,
    MyEventsTabComponent,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
