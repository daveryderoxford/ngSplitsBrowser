import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixturesComponent } from './fixtures/fixtures/fixtures.component';

const routes: Routes = [
   { path: "", component: FixturesComponent },
   { path: "fixtures", component: FixturesComponent },
   { path: "auth", loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
   { path: "events", loadChildren: () => import( './events/events.module' ).then( m => m.EventsModule ) },
   { path: "events-admin", loadChildren: () => import( './event-admin/event-admin.module' ).then( m => m.EventAdminModule ) },
   { path: "user", loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ) },
   { path: "about", loadChildren: () => import( './about/about.module' ).then( m => m.AboutModule ) },
   { path: "graph", loadChildren: () => import( './results/results.module' ).then( m => m.ResultsModule ) },
   { path: "entry", loadChildren: () => import( './entry/entry.module' ).then( m => m.EntryModule ) },
];

@NgModule( {
   imports: [RouterModule.forRoot( routes )],
   exports: [RouterModule]
} )
export class AppRoutingModule { }
