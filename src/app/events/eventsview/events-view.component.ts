import { DataSource } from "@angular/cdk/collections";
import { Component, ViewChild } from "@angular/core";
import { MatPaginator, MatSelectChange, MatTab, MatTabChangeEvent } from "@angular/material";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { EventService } from "app/events/event.service";
import { Nations, UserData, UserResultData } from "app/model";
import { Club } from "app/model/club";
import { EventGrades, OEvent } from "app/model/oevent";
import { DialogsService } from "app/shared";
import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { UserDataService } from "app/user/user-data.service";

@Component({
  selector: "app-results",
  templateUrl: "./events-view.component.html",
  styleUrls: ["./events-view.component.scss"]
})
export class EventsViewComponent {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tabAll') tabAll: MatTab;
  @ViewChild('tabClub') tabClub: MatTab;
  @ViewChild('tabMyEvents') tabMyEvents: MatTab;
  @ViewChild('tabUpload') tabUpload: MatTab;

  dataSource: EventDataSource | null;

  displayedColumns = ["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"];
  currentRow: any = null;
  grades = EventGrades.grades;
  clubs$: Observable<Club[]> = undefined;
  myResults$: Observable<UserResultData[]> = undefined;

  events: Array<OEvent> = [];

  // Club related fields
  nations = Nations.getNations();
  selctedClub = new BehaviorSubject('');
  clubFilter = new BehaviorSubject('');

  selectedEvent: OEvent = null;
  loading: Observable<boolean>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private es: EventService,
    private ds: DialogsService,
    private us: UserDataService ) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(["/graph", event.key]).catch(e => {
      console.log('Errror in van');
      this.ds.message('Error loading results', 'Error loading results for event');
    });
  }

  applyFilter(clubs: Club[], natFilter: string) {
    if (natFilter === "") {
      return clubs;
    } else {
      const ret = clubs.filter(club => (club.nationality === natFilter));
      return ret;
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.dataSource = new EventDataSource(this.es);

    this.loading = this.es.loading;

  }

  tabChanged(selection: MatTabChangeEvent) {
    // Lazily load clubs list
    if (selection.tab === this.tabClub && !this.clubs$) {
      this.clubs$ = Observable.combineLatest(this.es.getClubs(), this.clubFilter).pipe(
        map((obs) => this.applyFilter(obs[0], obs[1]))
      );

      this.selctedClub.switchMap(name => this.es.getEventsForClub(name))
        .subscribe(events => this.events = events);

    } else if (selection.tab === this.tabMyEvents && !this.myResults$) {
      this.myResults$ = this.us.getUser().map( (userdata) => {
        return userdata.results;
      });
    }
  }

  setSelectedClub(name: string) {
    this.selctedClub.next(name);
  }

  clubNationalFilterChange(event: MatSelectChange) {
    this.clubFilter.next(event.value);
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

