import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { EntryRoutingModule } from './entry-routing.module';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';

@NgModule({
  declarations: [
    MapRegistrationAdminComponent,
    CourseDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    EntryRoutingModule
  ],
  exports: [
    MapRegistrationAdminComponent,
  ],
  entryComponents: [CourseDialogComponent]
})
export class EntryModule { }
