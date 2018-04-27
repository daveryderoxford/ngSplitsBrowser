import { NgModule } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterModule, Routes } from "@angular/router";

import { VirtualScrollModule } from "angular2-virtual-scroll";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorageModule } from "angularfire2/storage";

import { AboutComponent } from "app/about/about.component";
import { AppMaterialModule } from "app/app-material.module";
import { AppComponent } from "app/app.component";
import { firebaseConfig } from "app/app.firebase-config";
import { SharedModule } from "app/app.shared.module";
import { AuthGuard } from "app/auth/guards/auth-guard";
import { LoginComponent } from "app/auth/login/login.component";
import { RecoverComponent } from "app/auth/recover/recover.component";
import { SignupComponent } from "app/auth/signup/signup.component";
import { EventService } from 'app/events/event.service';
import { EventsListComponent } from "app/events/eventslist/eventslist.component";
import { MainComponent } from "app/main/main.component";
import { GraphComponent } from "app/results/graph/graph.component";
import { ResultsNavbarComponent } from "app/results/results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "app/results/results-search/results-search.component";
import { ResultsSelectionService } from "app/results/results-selection.service";
import { ResultsViewComponent } from "app/results/results-view/results-view.component";
import { UploadModule } from "app/upload/upload.module";
import { UserDataService } from "app/user/user-data.service";
import { UserComponent } from "app/user/user.component";

import "hammerjs";


export const appRoutes: Routes = [
  { path: "", component: MainComponent },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
  { path: "recover", component: RecoverComponent },
  { path: "events", component:  EventsListComponent },
  { path: "user", component: UserComponent, canActivate: [AuthGuard] },
  { path: "about", component: AboutComponent },
  { path: "graph/:id", component: GraphComponent }
];

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
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireStorageModule,
    AppMaterialModule,
    UploadModule,
    SharedModule,
    VirtualScrollModule,
    HttpClientModule,
  ],
  providers: [
    AuthGuard,
    ResultsSelectionService,
    UserDataService,
    EventService
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
