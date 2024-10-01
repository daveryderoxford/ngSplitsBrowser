import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventsViewComponent } from './events/eventsview/events-view.component';

const routes: Routes = [
   { path: "", component: EventsViewComponent },
   { path: "events", component: EventsViewComponent },
   { path: "graph", loadChildren: () => import( './results/results.module' ).then( m => m.ResultsModule ) },
   { path: "auth", loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
   { path: "user", loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ) },
   { path: "about", loadChildren: () => import( './about/about.module' ).then( m => m.AboutModule ) },
];

@NgModule( {
   imports: [RouterModule.forRoot(routes, {})],
   exports: [RouterModule]
} )
export class AppRoutingModule { }
