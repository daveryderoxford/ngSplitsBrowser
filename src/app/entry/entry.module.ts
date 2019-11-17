import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EntryRoutingModule } from './entry-routing.module';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';

@NgModule({
  declarations: [
    MapRegistrationAdminComponent,
    CourseDialogComponent
  ],
  imports: [
    CommonModule,
    EntryRoutingModule
  ],
  exports: [
    MapRegistrationAdminComponent,
  ],
  entryComponents: [CourseDialogComponent]
})
export class EntryModule { }
