import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material";

import { OEvent, EventGrades } from "app/model/oevent";
import { AngularFirestore, AngularFirestoreDocument } from "angularfire2/firestore";

import { AngularFireAuth } from "angularfire2/auth";
import { EventAdminService } from "app/upload/event-admin.service";

import { ChangeEvent } from "angular2-virtual-scroll";
import { Observable } from "rxjs/Observable";
import { Club } from "app/model/club";
import { DataSnapshot } from "@firebase/database";
import * as _ from "lodash";

@Component({
  selector: "app-results",
  templateUrl: "./eventslist.component.html",
  styleUrls: ["./eventslist.component.css"]
})
export class EventsListComponent {

  clubs: Observable<Club[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: EventDataSource | null;

  displayedColumns = ["date", "name", "nationality", "club", "grade", "disapline", "type", "website", "actions"];
  currentRow: any = null;
  grades = EventGrades.grades;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(["/graph", event.key]);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.dataSource = new EventDataSource(this.afs, this.paginator);
    this.clubs = this.afs.collection<Club>("/clubs/").valueChanges();
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

