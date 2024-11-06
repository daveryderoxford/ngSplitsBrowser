import { Routes } from '@angular/router';
import { AuthGuard } from 'app/auth/guards/auth-guard';
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';
import { UserComponent } from './user.component';

export const USER_ROUTES: Routes = [
  { path: "", component: UserComponent, canActivate: [AuthGuard], canDeactivate: [PendingChangesGuard] },
];
