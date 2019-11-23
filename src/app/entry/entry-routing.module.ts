import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';
import { AuthGuard } from 'app/auth/guards/auth-guard';
import { EntryListComponent } from './entry-list/entry-list.component';

const routes: Routes = [
  {
    path: "",
    canActivate: [AuthGuard],
    children: [
      { path: "mapregistration/:id",  component: MapRegistrationAdminComponent  },
      { path: "entrylist/:id", component: EntryListComponent  }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryRoutingModule { }
