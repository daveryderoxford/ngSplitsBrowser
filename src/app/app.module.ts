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
import { AboutComponent } from "./about/about.component";
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
import { MainComponent } from "./main/main.component";
import { GraphComponent } from "./results/graph/graph.component";
import { ResultsNavbarComponent } from "./results/results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "./results/results-search/results-search.component";
import { ResultsViewComponent } from "./results/results-view/results-view.component";
import { SplitsGridComponent } from './results/splits-grid/splits-grid.component';
import { SharedModule } from "./shared/shared.module";
import { ResultsFoundDialogComponent } from './user/results-found-dialog/results-found-dialog.component';
import { UserComponent } from "./user/user.component";
import { ResultsViewButtonComponent } from './results/results-navbar/results-view-button.component';
import { CompareWithComponent } from './results/results-navbar/compare-with.component';
import { ClassMenuButtonComponent } from './results/results-navbar/class-menu-button.component';
import { FixturesMapComponent } from './fixtures/fixtures-map/fixtures-map.component';
import { FixturesGridComponent } from './fixtures/fixtures-grid/fixtures-grid.component';
import { FixturesComponent } from './fixtures/fixtures/fixtures.component';
import { FixturesOptionsComponent } from './fixtures/fixtures-options/fixtures-options.component';
import { FilterComponent } from './fixtures/fixtures/filter/filter.component';

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
    MyResultsTableComponent,
    ResultsFoundDialogComponent,
    ResultsViewButtonComponent,
    CompareWithComponent,
    ClassMenuButtonComponent,
    FixturesMapComponent,
    FixturesGridComponent,
    FixturesComponent,
    FixturesOptionsComponent,
    FilterComponent,
  ],
  entryComponents: [
    ResultsFoundDialogComponent
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
  bootstrap: [AppComponent],
  exports: [FilterComponent]
})
export class AppModule { }
