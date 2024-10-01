import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AllEventsTabComponent } from './all-events-tab/all-events-tab.component';
import { ClubEventsTabComponent } from './club-events-tab/club-events-tab.component';
import { EventsRoutingModule } from './events-routing.module';
import { EventsTableComponent } from './events-table/events-table.component';
import { EventsViewComponent } from "./eventsview/events-view.component";
import { MyEventsTabComponent } from './my-events-tab/my-events-tab.component';
import { MyResultsTableComponent } from './my-results-table/my-results-table.component';

@NgModule({
  declarations: [
    EventsViewComponent,
    AllEventsTabComponent,
    ClubEventsTabComponent,
    EventsTableComponent,
    MyEventsTabComponent,
    MyResultsTableComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    EventsRoutingModule,
  ],
  exports: [
    EventsViewComponent
  ]
})
export class EventsModule { }
