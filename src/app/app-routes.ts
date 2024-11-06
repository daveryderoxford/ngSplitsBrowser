import { Routes } from '@angular/router';
import { EventsViewComponent } from './events/eventsview/events-view.component';

export const APP_ROUTES: Routes = [
   { path: "", redirectTo: "events" },
   { path: "events", loadComponent: () => import('./events/eventsview/events-view.component').then(c => c.EventsViewComponent) },
   { path: "results", loadChildren: () => import( './results/results.routes' ).then( r => r.RESULTS_ROUTES ) },
   { path: "auth", loadChildren: () => import( './auth/auth.routes' ).then( r => r.AUTH_ROUTES ) },
   { path: "admin", loadChildren: () => import('./event-admin/event-admin.routes').then(r => r.EVENT_ADMIN_ROUTES )},

   { path: "user", loadChildren: () => import( './user/user.routes' ).then( r => r.USER_ROUTES ) },
   { path: "about", loadComponent: () => import( './about/about.component' ).then( c => c.AboutComponent ) },
];






