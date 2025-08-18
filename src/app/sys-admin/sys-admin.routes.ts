/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
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
