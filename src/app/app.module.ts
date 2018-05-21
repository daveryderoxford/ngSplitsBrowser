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
import { AuthGuard } from "app/auth/guards/auth-guard";
import { LoginComponent } from "app/auth/login/login.component";
import { RecoverComponent } from "app/auth/recover/recover.component";
import { SignupComponent } from "app/auth/signup/signup.component";
import { EventAdminModule } from "app/event-admin/event-admin.module";
import { EventService } from 'app/events/event.service';
import { EventsListComponent } from "app/events/eventslist/eventslist.component";
import { MainComponent } from "app/main/main.component";
import { GraphComponent } from "app/results/graph/graph.component";
import { ResultsNavbarComponent } from "app/results/results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "app/results/results-search/results-search.component";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { ResultsViewComponent } from "app/results/results-view/results-view.component";
import { ResultsResolver } from "app/results/results.resolver";
import { SharedModule } from "app/shared/shared.module";
import { UserDataService } from "app/user/user-data.service";
import { UserComponent } from "app/user/user.component";
import "hammerjs";
import { AppRoutingModule } from "./app-routing.module";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    MainComponent,
    EventsListComponent,
    UserComponent,
    AboutComponent,
    GraphComponent,
    ResultsViewComponent,
    ResultsNavbarComponent,
    ResultsSearchComponent,
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
  ],
  providers: [
    AuthGuard,
    ResultsSelectionService,
    UserDataService,
    EventService,
    ResultsResolver,
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
