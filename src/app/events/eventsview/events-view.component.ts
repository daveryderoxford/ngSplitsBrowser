import { DataSource } from "@angular/cdk/collections";
import { Component, ViewChild, OnInit } from "@angular/core";
import { MatSelectChange, MatTab, MatTabChangeEvent } from "@angular/material";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { EventService } from "../event.service";
import { Nations, UserResultData } from "../../model";
import { Club } from "../../model/club";
import { EventGrades, OEvent } from "../../model/oevent";
import { DialogsService } from "../../shared";
import { BehaviorSubject, Subject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { map } from "rxjs/operators";
import { UserDataService } from "../../user/user-data.service";

@Component({
  selector: "app-results",
  templateUrl: "./events-view.component.html",
  styleUrls: ["./events-view.component.scss"],
})
export class EventsViewComponent implements OnInit {

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('tabAll') tabAll: MatTab;
  @ViewChild('tabClub') tabClub: MatTab;
  @ViewChild('tabMyEvents') tabMyEvents: MatTab;
  @ViewChild('tabUpload') tabUpload: MatTab;

  dataSource: EventDataSource | null;

  displayedColumns = ["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"];
  grades = EventGrades.grades;
  nations = Nations.getNations();

  myResults$: Observable<UserResultData[]> = undefined;

    // Club related fields
  clubs$: Observable<Club[]> = undefined;
  clubEvents: Array<OEvent> = [];
  selctedClub = new Subject<Club>();
  clubNationalityFilter = new BehaviorSubject('');
  clubNameFilter = new BehaviorSubject('');

  selectedEvent: OEvent = null;
  loading: Observable<boolean>;

  constructor(private router: Router,
    public es: EventService,
    private ds: DialogsService,
    private us: UserDataService) {
  }

  oeventClicked(event: OEvent) {
    if (!event.splits || event.splits.valid === false) {
       this.ds.message("Results display failed", "No valid results uploaded for event");
    } else {
    this.router.navigate(["/graph", event.key]).catch((err) => {
      console.log('Errror in loading results for ' + event.name + ' ' + err);
      this.ds.message('Error loading results', 'Error loading results for event');
    });
  }
  }

  filterClubs(clubs: Club[], natFilter: string, nameFilter: string) {
    return clubs.
      filter(club => (natFilter === "" || club.nationality === natFilter)).
      filter(club => (nameFilter === "" || club.name.includes(nameFilter.toUpperCase())));
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.loading = this.es.loading.delay(0);
    this.dataSource = new EventDataSource(this.es);
  }

  initAll() {

  }

  initClub() {
    // Club filter
    this.clubs$ = Observable.combineLatest(this.es.getClubs(), this.clubNationalityFilter, this.clubNameFilter)
      .pipe(
        map(obs => this.filterClubs(obs[0], obs[1], obs[2]))
      );

    this.selctedClub
      .filter((club) => club !== null)
      .switchMap(club => this.es.getEventsForClub(club))
      .subscribe(events => this.clubEvents = events);
  }

  tabChanged(selection: MatTabChangeEvent) {
    // Lazily load clubs list

    if (selection.tab === this.tabClub && !this.clubs$) {
      this.initClub();
    } else if (selection.tab === this.tabMyEvents && !this.myResults$) {
      this.myResults$ = this.us.getUser().map((userdata) => {
        return userdata.results;
      });
    } else if (selection.tab === this.tabAll) {
    }
  }

  setSelectedClub(club: Club) {
    const c = club;
    this.selctedClub.next(c);
  }

  clubNationalFilterChange(event: MatSelectChange) {
    this.clubNationalityFilter.next(event.value);
  }

  clubNameFilterChange(event: any) {
    this.clubNameFilter.next(event.target.value);
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


  graphMenuSelected() {
  }

  summaryMenuSelected() {
  }

  adminMenuSelected() {
  }

  eventEditable() {

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

