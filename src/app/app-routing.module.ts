import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./auth/guards/auth-guard";
import { FixturesComponent } from './fixtures/fixtures/fixtures.component';
import { PendingChangesGuard } from './shared/services/pending-changes-guard-service.guard';
import { UserComponent } from './user/user.component';

const routes: Routes = [
   { path: "", component: FixturesComponent },
   { path: "auth", loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
   { path: "events", loadChildren: () => import( './events/events.module' ).then( m => m.EventsModule ) },
   { path: "fixtures", component: FixturesComponent },
   { path: "user", component: UserComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
   { path: "about", loadChildren: () => import( './about/about.module' ).then( m => m.AboutModule ) },
   { path: "graph", loadChildren: () => import( './results/results.module' ).then( m => m.ResultsModule )
   },
];

@NgModule({
   imports: [RouterModule.forRoot(routes)],
   exports: [RouterModule]
})
export class AppRoutingModule { }
