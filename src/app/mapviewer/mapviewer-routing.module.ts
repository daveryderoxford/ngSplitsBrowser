import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapviewerComponent } from './mapviewer.component';

const routes: Routes = [{ path: '', component: MapviewerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapviewerRoutingModule { }
