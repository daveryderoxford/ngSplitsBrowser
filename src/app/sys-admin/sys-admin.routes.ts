import { Routes } from '@angular/router';
import { SysAdminSwitchboard } from './sys-admin-switchboard';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { UserListComponent } from './user-list/user-list.component';

export const SYS_ADMIN_ROUTES: Routes = [
   { path: '', redirectTo: 'switchboard', pathMatch: 'full' },
   {
      path: 'switchboard',
      component: SysAdminSwitchboard,
      title: 'System Administration',
      providers: [
         provideFunctions(() => getFunctions()),
      ],
   }, 
   {
      path: 'users',
      component: UserListComponent,
      title: 'User Administration'
   },
];
