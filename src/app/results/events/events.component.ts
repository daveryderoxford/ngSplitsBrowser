import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { OEvent, EventGrades } from 'app/model/oevent';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventAdminService } from 'app/upload/event-admin.service';

import { ChangeEvent } from 'angular2-virtual-scroll';
import { Observable } from 'rxjs/Observable';
import { Club } from 'app/model/club';
import { DataSnapshot } from '@firebase/database';
import * as _ from 'lodash';

@Component({
  selector: 'app-results',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  clubs: Observable<Club[]>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: EventDataSource | null;

  displayedColumns = ['date', 'name', 'nationality', 'club', 'grade', 'disapline', 'type', 'website', 'actions'];
  currentRow: any = null;
  grades = EventGrades.grades;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(['/graph', event.key]);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.dataSource = new EventDataSource(this.db, this.paginator);
    this.clubs = this.db.list<Club>('/clubs/').valueChanges();
  }

  onMouseEnter(row) {
    this.currentRow = row;
  }

  onMouseLeave(row) {
    this.currentRow = null;
  }

  rowStyle(row): string {
    if (this.currentRow === row) {
      return ('selected');
    } else {
      return ('');
    }
  }

}

//  ===========================  Data source ========================

class EventDataSource extends DataSource<any> {

  protected oevents: OEvent[] = [];
  protected visibleEvents: OEvent[] = [];
  protected loading = false;

  constructor(private db: AngularFireDatabase,
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
      startAt = oevents[oevents.length - 1].date_club_index;
    } else {
      startAt = 0;
    };

    const query = this.db.list<OEvent>('/events',
      res => res.orderByChild('date_club_index').startAt(startAt).limitToFirst(pageSize));

    const obs: Observable<OEvent[]> = query.snapshotChanges().map( (actions) => {
      const events = actions.map( (action) => {
        const oevent = action.payload.val();
        oevent.key = action.payload.key;
        return (oevent as OEvent);
      });
      return(events);
    });

    return (obs);
  }

}

