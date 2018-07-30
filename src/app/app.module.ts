import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";
import { AboutComponent } from "app/about/about.component";
import { AppComponent } from "app/app.component";
import { firebaseConfig } from "app/app.firebase-config";
import { LoginComponent } from "app/auth/login/login.component";
import { RecoverComponent } from "app/auth/recover/recover.component";
import { SignupComponent } from "app/auth/signup/signup.component";
import { EventAdminModule } from "app/event-admin/event-admin.module";
import { EventsViewComponent } from "app/events/eventsview/events-view.component";
import { MainComponent } from "app/main/main.component";
import { GraphComponent } from "app/results/graph/graph.component";
import { ResultsNavbarComponent } from "app/results/results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "app/results/results-search/results-search.component";
import { ResultsViewComponent } from "app/results/results-view/results-view.component";
import { SharedModule } from "app/shared/shared.module";
import { UserComponent } from "app/user/user.component";
import "hammerjs";
import { AppRoutingModule } from "./app-routing.module";
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SplitsGridComponent } from './results/splits-grid/splits-grid.component';

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
