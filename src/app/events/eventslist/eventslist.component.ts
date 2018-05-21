import { DataSource } from "@angular/cdk/collections";
import { Component, ViewChild } from "@angular/core";
import { MatPaginator, MatSelectChange } from "@angular/material";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { EventService } from "app/events/event.service";
import { Nations } from "app/model";
import { Club } from "app/model/club";
import { EventGrades, OEvent } from "app/model/oevent";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";


@Component({
  selector: "app-results",
  templateUrl: "./eventslist.component.html",
  styleUrls: ["./eventslist.component.scss"]
})
export class EventsListComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: EventDataSource | null;

  displayedColumns = ["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"];
  currentRow: any = null;
  grades = EventGrades.grades;
  clubs$: Observable<Club[]>;
  events: Array<OEvent> = [];

  // Club related fields
  nations = Nations.getNations();
  selctedClub = new BehaviorSubject('');

  selectedEvent: OEvent = null;
  loading: Observable<boolean>;


  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private es: EventService) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(["/graph", event.key]);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.dataSource = new EventDataSource(this.es);

    this.clubs$ = this.es.getClubs();

    this.selctedClub.switchMap(name => this.es.getEventsForClub(name))
      .subscribe(events => this.events = events);

    this.loading = this.es.loading;

  }

  setSelectedClub(name: string) {
    this.selctedClub.next(name);
  }

  clubNationalFilterChange($event: MatSelectChange) {
    // TODO handle this or use obasevable stream
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

  onMouseEnter(row) {
    this.currentRow = row;
  }

  onMouseLeave(row) {
    this.currentRow = null;
  }

  rowStyle(row): string {
    if (this.currentRow === row) {
      return ("selected");
    } else {
      return ("");
    }
  }

  graphMenuSelected(event: OEvent) {
  }

  summaryMenuSelected(event: OEvent) {
  }

  adminMenuSelected(event: OEvent) {
  }

  eventEditable(event: OEvent) {

  }

}

//  ===========================  Data source ========================

class EventDataSource extends DataSource<OEvent> {

  protected oevents$: Observable<OEvent[]>;

  constructor(private es: EventService) {
    super();
  }

  connect(): Observable<OEvent[]> {
    // Intialise query
    return this.es.search("date", null, 30);
  }

  disconnect() { }

  fetchNextChunk() {
    this.es.extendSearch();
  }

}

