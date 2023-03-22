import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MapviewerRoutingModule } from './mapviewer-routing.module';
import { MapviewerComponent } from './mapviewer.component';

import { MapImageComponent } from './map-image/map-image.component';
import { SharedModule } from 'app/shared/shared.module';
import { PinchZoomModule } from './ngx-pinch-zoom/pinch-zoom.module';

@NgModule({
  declarations: [
    MapviewerComponent,
    MapImageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MapviewerRoutingModule,
    PinchZoomModule
  ]
})
export class MapviewerModule { }
