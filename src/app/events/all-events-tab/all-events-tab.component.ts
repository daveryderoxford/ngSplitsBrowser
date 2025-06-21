
import { DataSource } from '@angular/cdk/table';
import { Component, OnInit, output, inject } from '@angular/core';
import { EventService } from 'app/events/event.service';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AsyncPipe } from '@angular/common';
import { EventsTableComponent } from '../events-table/events-table.component';
import { EventGrades, OEvent } from '../model/oevent';
import { Nations } from '../model/nations';
import { EventsList } from '../events-list/events-list';

@Component({
  selector: 'app-all-events-tab',
  templateUrl: './all-events-tab.component.html',
  styleUrls: ['./all-events-tab.component.scss'],
  imports: [EventsList, MatProgressBarModule, AsyncPipe]
})
export class AllEventsTabComponent implements OnInit {
  private es = inject(EventService);
  
  eventSelected = output<OEvent>();

  grades = EventGrades.grades;
  nations = Nations.getNations();

  loading: Observable<boolean>;

  ngOnInit() {
    this.loading = this.es.loading.pipe(delay(0));
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

  
}
