import { Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/guards/auth-guard';
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';
import { UserPage } from './user-page';

export const USER_ROUTES: Routes = [
  { path: "", title: 'User details', component: UserPage, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
];
