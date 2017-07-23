import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppMaterialModule } from 'app/app-material.module';

import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularFireModule } from 'angularfire2';

import { AuthGuard } from 'app/auth/guards/auth-guard';

// Custom components
import { UploadModule } from './upload/upload.module';
import { AppComponent } from './app.component';

import 'hammerjs';

// Components
import { LoginComponent } from './auth/login/login.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MainComponent } from './main/main.component';
import { SharedModule } from 'app/app.shared.module';
import { EventsComponent } from './results/events/events.component';
import { firebaseConfig } from 'app/app.firebase-config';
import { UserComponent } from 'app/user/user.component';
import { AboutComponent } from './about/about.component';
import { GraphComponent } from './results/graph/graph.component';
import { VirtualScrollModule } from 'angular2-virtual-scroll';

// Services
import { ResultsSelectionService } from './results/results-selection.service';
import { UserDataService } from 'app/user/user-data.service';

export const appRoutes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'recover', component: RecoverComponent },
  { path: 'events', component: EventsComponent },
  { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
  { path: 'about', component: AboutComponent },
  { path: 'graph/:id', component: GraphComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RecoverComponent,
    SignupComponent,
    MainComponent,
    EventsComponent,
    UserComponent,
    AboutComponent,
    GraphComponent,
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AppMaterialModule,
    UploadModule,
    SharedModule,
    VirtualScrollModule,
  ],
  providers: [
    AuthGuard,
    ResultsSelectionService,
    UserDataService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
