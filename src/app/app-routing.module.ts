import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutModule } from './about/about.module';
import { ChangePasswordComponent } from './auth/change-password/change-password.component';
import { AuthGuard } from "./auth/guards/auth-guard";
import { LoginComponent } from "./auth/login/login.component";
import { RecoverComponent } from "./auth/recover/recover.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { EventsViewComponent } from "./events/eventsview/events-view.component";
import { FixturesComponent } from './fixtures/fixtures/fixtures.component';

import { PendingChangesGuard } from './shared/services/pending-changes-guard-service.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
   { path: "", component: FixturesComponent },
   { path: "login", component: LoginComponent },
   { path: "signup", component: SignupComponent },
   { path: "recover", component: RecoverComponent },
   { path: "events", component: EventsViewComponent },
   { path: "fixtures", component: FixturesComponent },
   { path: "user", component: UserComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
   { path: "change-password", component: ChangePasswordComponent, canActivate: [AuthGuard] },
   { path: "about", loadChildren: () => import( './about/about.module' ).then( m => m.AboutModule ) },
   {  path: "graph", loadChildren: () => import( './results/results.module' ).then( m => m.ResultsModule )
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
