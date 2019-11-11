import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';

const routes: Routes = [
  { path: "mapregistration", component: MapRegistrationAdminComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
