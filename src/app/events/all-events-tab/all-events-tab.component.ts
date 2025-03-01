
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

@Component({
  selector: 'app-all-events-tab',
  templateUrl: './all-events-tab.component.html',
  styleUrls: ['./all-events-tab.component.scss'],
  imports: [EventsTableComponent, MatProgressBarModule, AsyncPipe]
})
export class AllEventsTabComponent implements OnInit {
  private es = inject(EventService);
  
  eventSelected = output<OEvent>();

  dataSource: EventDataSource | null;

  grades = EventGrades.grades;
  nations = Nations.getNations();

  loading: Observable<boolean>;

  ngOnInit() {
    this.loading = this.es.loading.pipe(delay(0));
    this.dataSource = new EventDataSource(this.es);
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

  // EVENT TABLE
  onTableScroll(e: any) {
    const tableViewHeight = e.target.offsetHeight; // viewport: ~500px
    const tableScrollHeight = e.target.scrollHeight; // length of all table
    const scrollLocation = e.target.scrollTop; // how far user scrolled

    // If the user has scrolled within 200px of the bottom, add more data
    const buffer = 200;
    const limit = tableScrollHeight - tableViewHeight - buffer;
    if (scrollLocation > limit) {
      this.dataSource.fetchNextChunk();
    }
  }
}

//  ===========================  Data source ========================
class EventDataSource extends DataSource<OEvent> {

  protected oevents$: Observable<OEvent[]> = null;

  constructor(private es: EventService) {
    super();
  }

  connect(): Observable<OEvent[]> {
    // Intialise query
    this.oevents$ = this.es.search("date", null, 40);
    return this.oevents$;
  }

  disconnect() { }

  fetchNextChunk() {
    this.es.extendSearch();
  }
}
