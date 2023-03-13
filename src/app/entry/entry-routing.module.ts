import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';
import { AuthGuard } from 'app/auth/guards/auth-guard';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EnterComponent } from './enter/enter.component';
import { PendingChangesGuard } from 'app/shared/services/pending-changes-guard-service.guard';

const routes: Routes = [
  { path: "entrylist/:id", component: EntryListComponent },
  { path: "mapregistration", component: MapRegistrationAdminComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard] },
  { path: "mapregistration/:id", component: MapRegistrationAdminComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard] },
  { path: "enter/:fixtureId", component: EnterComponent, canDeactivate: [PendingChangesGuard], canActivate: [AuthGuard]  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
