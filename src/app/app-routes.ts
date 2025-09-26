import { Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard';

export const APP_ROUTES: Routes = [
   { path: "", redirectTo: "events", pathMatch: 'full' },
   { path: "events", title: 'Splitsbrower Events', loadComponent: () => import('./events/events-page/events-page').then(c => c.EventsPage) },
   { path: "results", loadChildren: () => import( './results/results.routes' ).then( r => r.RESULTS_ROUTES ) },
   { path: "auth", loadChildren: () => import( './auth/auth.routes' ).then( r => r.AUTH_ROUTES ) },
   { 
      path: "admin",
      canActivate: [authGuard],
      loadChildren: () => import('./event-admin/event-admin.routes').then(r => r.EVENT_ADMIN_ROUTES )
   },
   { path: "user", loadChildren: () => import( './user/user.routes' ).then( r => r.USER_ROUTES ) },
   { path: "settings", title: 'Settings', loadComponent: () => import('./settings/settings-page').then(c => c.SettingsPage) },
   { path: "about", title: 'About Splitsbrowser', loadComponent: () => import( './about/about-page' ).then( c => c.AboutComponent ) },
   { path: "sys-admin", title: 'System  Admin', loadComponent: () => import('./sys-admin/sys-admin-switchboard').then(c => c.SysAdminSwitchboard) },

];


