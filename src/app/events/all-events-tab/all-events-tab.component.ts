import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { EventGrades, Nations, OEvent } from 'app/model';
import { Observable } from 'rxjs';
import { EventService } from 'app/events/event.service';
import { DataSource } from '@angular/cdk/table';

@Component({
  selector: 'app-all-events-tab',
  templateUrl: './all-events-tab.component.html',
  styleUrls: ['./all-events-tab.component.scss']
})
export class AllEventsTabComponent implements OnInit {

  @Output() eventSelected = new EventEmitter();

  dataSource: EventDataSource | null;

  grades = EventGrades.grades;
  nations = Nations.getNations();

  loading: Observable<boolean>;

  constructor(private es: EventService) { }

  ngOnInit() {
    this.loading = this.es.loading.delay(0);
    this.dataSource = new EventDataSource(this.es);
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
 }

  // EVENT TABLE
  onTableScroll(e) {
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
