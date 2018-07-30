import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'app/about/about.component';
import { AuthGuard } from "app/auth/guards/auth-guard";
import { LoginComponent } from "app/auth/login/login.component";
import { RecoverComponent } from "app/auth/recover/recover.component";
import { SignupComponent } from "app/auth/signup/signup.component";
import { EventsViewComponent } from "app/events/eventsview/events-view.component";
import { MainComponent } from "app/main/main.component";
import { GraphComponent } from "app/results/graph/graph.component";
import { ResultsResolver } from 'app/results/results.resolver';
import { UserComponent } from 'app/user/user.component';
import { ChangePasswordComponent } from 'app/auth/change-password/change-password.component';
import { SplitsGridComponent } from 'app/results/splits-grid/splits-grid.component';

const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "recover", component: RecoverComponent },
    { path: "events", component:  EventsViewComponent },
    { path: "user", component: UserComponent, canActivate: [AuthGuard] },
    { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard] },
    { path: "about", component: AboutComponent },
    { path: "graph/:id",
     component: GraphComponent,
    resolve: {
      results: ResultsResolver
    }},
    { path: "table/:id",
    component: SplitsGridComponent,
   resolve: {
     results: ResultsResolver
   }},
   { path: "table", component: SplitsGridComponent },
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
