import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryRoutingModule } from './entry-routing.module';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';

@NgModule({
  declarations: [MapRegistrationAdminComponent],
  imports: [
    CommonModule,
    EntryRoutingModule
  ],
  exports: [
    MapRegistrationAdminComponent,
  ]
})
export class EntryModule { }
