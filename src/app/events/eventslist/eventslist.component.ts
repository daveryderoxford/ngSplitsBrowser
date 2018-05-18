import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataSource } from "@angular/cdk/collections";
import { MatPaginator, MatSelectChange } from "@angular/material";

import { OEvent, EventGrades } from "app/model/oevent";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";

import { AngularFireAuth } from "angularfire2/auth";
import { EventAdminService } from "app/upload/event-admin.service";

import { ChangeEvent } from "angular2-virtual-scroll";
import { Observable } from "rxjs/Observable";
import { Club } from "app/model/club";
import { DataSnapshot } from "@firebase/database";
import * as _ from "lodash";
import { EventService } from "app/events/event.service";
import { BehaviorSubject } from "rxjs";
import { Nations } from "app/model";

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

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private es: EventService) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(["/graph", event.key]);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.dataSource = new EventDataSource(this.afs, this.paginator);
    this.clubs$ = this.es.getClubs();

    this.selctedClub.switchMap( name => this.es.getEventsForClub(name))
      .subscribe(events => this.events = events);
  }

  setSelectedClub(name: string) {
    this.selctedClub.next(name);
  }

  clubNationalFilterChange($event: MatSelectChange) {
    // TODO handle this or use obasevable stream
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

}

//  ===========================  Data source ========================

class EventDataSource extends DataSource<any> {

  protected oevents: OEvent[] = [];
  protected visibleEvents: OEvent[] = [];
  protected loading = false;

  constructor(private afs: AngularFirestore,
    private paginator: MatPaginator) {
    super();
  }

  connect(): Observable<OEvent[]> {
    return (this.fetchNextChunk());
  }

  disconnect() { }

  private fetchNextChunk(): Observable<OEvent[]> {

    const oevents = this.oevents;
    const pageSize = this.paginator.pageSize;
    let startAt;

    if (oevents.length > 0) {
      startAt = oevents[oevents.length - 1].date;
    } else {
      startAt = 0;
    }

    //  const query = this.db.list<OEvent>("/events",
    const query = this.afs.collection<OEvent>("/events",
      res => res.where("splits.valid", "==", true)
        .orderBy("date", "desc")
        .orderBy("name")
        .limit(pageSize));


    const obs: Observable<OEvent[]> = query.valueChanges();

    return (obs);
  }

}

