import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AuthGuard } from "./auth/guards/auth-guard";
import { LoginComponent } from "./auth/login/login.component";
import { RecoverComponent } from "./auth/recover/recover.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EventsViewComponent } from "./events/eventsview/events-view.component";
import { MainComponent } from "./main/main.component";
import { GraphComponent } from "./results/graph/graph.component";
import { ResultsResolver } from './results/results.resolver';
import { UserComponent } from './user/user.component';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { SplitsGridComponent } from './results/splits-grid/splits-grid.component';
import { PendingChangesGuard } from './shared/services/pending-changes-guard-service.guard';

const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "recover", component: RecoverComponent },
    { path: "events", component:  EventsViewComponent },
    { path: "user", component: UserComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
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
