/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth-guard';

export const APP_ROUTES: Routes = [
   { path: "", redirectTo: "events", pathMatch: 'full' },
   { path: "events", title: 'Splitsbrower Events', loadComponent: () => import('./events/events-page/events-page').then(c => c.EventsPage) },
   { path: "results", loadChildren: () => import( './results/results.routes' ).then( r => r.RESULTS_ROUTES ) },
   { path: "auth", loadChildren: () => import( './auth/auth.routes' ).then( r => r.AUTH_ROUTES ) },
   { 
      path: "admin",
      canActivate: [AuthGuard],
      loadChildren: () => import('./event-admin/event-admin.routes').then(r => r.EVENT_ADMIN_ROUTES )
   },
   { path: "user", loadChildren: () => import( './user/user.routes' ).then( r => r.USER_ROUTES ) },
   { path: "about", title: 'About Splitsbrowser', loadComponent: () => import( './about/about-page' ).then( c => c.AboutComponent ) },
   { path: "sys-admin", title: 'System  Admin', loadComponent: () => import('./sys-admin/sys-admin-switchboard').then(c => c.SysAdminSwitchboard) },

];
