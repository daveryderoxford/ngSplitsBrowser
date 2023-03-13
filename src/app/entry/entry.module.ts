import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { EntryRoutingModule } from './entry-routing.module';
import { MapRegistrationAdminComponent } from './map-registration-admin/map-registration-admin.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EnterComponent } from './enter/enter.component';
import { FixtureSelectComponent } from './fixture-select/fixture-select.component';
import { FilterPipeModuleModule } from "../fixtures/fixture-pipes";

@NgModule({
    declarations: [
        MapRegistrationAdminComponent,
        CourseDialogComponent,
        EntryListComponent,
        EnterComponent,
        FixtureSelectComponent
    ],
    exports: [
        MapRegistrationAdminComponent,
        EntryListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        EntryRoutingModule,
        FilterPipeModuleModule
    ]
})
export class EntryModule { }
