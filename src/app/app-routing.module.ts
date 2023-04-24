import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FixturesComponent } from './fixtures/fixtures/fixtures.component';

const routes: Routes = [
   { path: "", component: FixturesComponent },
   { path: "fixtures", component: FixturesComponent },
   { path: "fixtures/:mapview", component: FixturesComponent },
   { path: "auth", loadChildren: () => import( './auth/auth.module' ).then( m => m.AuthModule ) },
   { path: "user", loadChildren: () => import( './user/user.module' ).then( m => m.UserModule ) },
   { path: "about", loadChildren: () => import( './about/about.module' ).then( m => m.AboutModule ) },
   { path: "entry", loadChildren: () => import( './entry/entry.module' ).then( m => m.EntryModule ) },
   { path: 'mapviewer', loadChildren: () => import('./mapviewer/mapviewer.module').then(m => m.MapviewerModule) },
];

@NgModule( {
   imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
   exports: [RouterModule]
} )
export class AppRoutingModule { }
