import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from 'app/about/about.component';
import { AuthGuard } from "app/auth/guards/auth-guard";
import { LoginComponent } from "app/auth/login/login.component";
import { RecoverComponent } from "app/auth/recover/recover.component";
import { SignupComponent } from "app/auth/signup/signup.component";
import { EventsListComponent } from "app/events/eventslist/eventslist.component";
import { MainComponent } from "app/main/main.component";
import { GraphComponent } from "app/results/graph/graph.component";
import { ResultsResolver } from 'app/results/results.resolver';
import { UserComponent } from 'app/user/user.component';

const routes: Routes = [
    { path: "", component: MainComponent },
    { path: "login", component: LoginComponent },
    { path: "signup", component: SignupComponent },
    { path: "recover", component: RecoverComponent },
    { path: "events", component:  EventsListComponent },
    { path: "user", component: UserComponent, canActivate: [AuthGuard] },
    { path: "about", component: AboutComponent },
    { path: "graph/:id",
     component: GraphComponent,
     resolve: {
      results: ResultsResolver
    }}
  ];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
