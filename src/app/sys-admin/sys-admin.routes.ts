import { Routes } from '@angular/router';
import { SysAdminSwitchboard } from './sys-admin-switchboard';
import { getFunctions, provideFunctions } from '@angular/fire/functions';

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
];
