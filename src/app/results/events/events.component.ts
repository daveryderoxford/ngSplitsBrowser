import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { DataSource } from '@angular/cdk';
import { MdPaginator } from '@angular/material';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { OEvent } from 'app/model/oevent';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventAdminService } from 'app/upload/event-admin.service';

import { ChangeEvent } from 'angular2-virtual-scroll';
import { Observable } from 'rxjs/Observable';
import { Club } from 'app/model/club';

@Component({
  selector: 'app-results',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent {

  clubs: FirebaseListObservable<Club[]>;

  @ViewChild(MdPaginator) paginator: MdPaginator;

  dataSource: EventDataSource | null;

  displayedColumns = ['date', 'name', 'nationality', 'club', 'type', 'website', 'actions'];
  currentRow: any = null;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router) { }

  oeventClicked(event: OEvent) {
    this.router.navigate(['/graph', event.$key]);
  }

  ngOnInit() {
    this.dataSource = new EventDataSource(this.db, this.paginator);
    this.clubs = this.db.list('/clubs/');
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
    private paginator: MdPaginator) {
    super();
  }

  connect(): Observable<OEvent[]> {
    return (this.fetchNextChunk());
  }

  disconnect() { }

  private fetchNextChunk(): FirebaseListObservable<OEvent[]> {

    const oevents = this.oevents;
    let opts: any;
    const pageSize = this.paginator.pageSize;

    if (oevents.length > 0) {
      opts = {
        query: {
          orderByChild: 'date_club_index',
          startAt: oevents[oevents.length - 1].date_club_index,
          limitToFirst: pageSize
        }
      };
    } else {
      opts = {
        query: {
          orderByChild: 'date_club_index',
          limitToFirst: pageSize
        }
      };
    };
    return (this.db.list('/events', opts));
  }

}
