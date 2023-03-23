import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MapviewerRoutingModule } from './mapviewer-routing.module';
import { MapviewerComponent } from './mapviewer.component';

import { SharedModule } from 'app/shared/shared.module';
import { AngularImageViewerModule } from "./angular-image_viewer/angular-image-viewer.module";

@NgModule({
  declarations: [
    MapviewerComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MapviewerRoutingModule,
    AngularImageViewerModule
  ]
})
export class MapviewerModule { }

