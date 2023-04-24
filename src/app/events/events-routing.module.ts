import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventsViewComponent } from './eventsview/events-view.component';

const routes: Routes = [
   { path: "", component: EventsViewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
