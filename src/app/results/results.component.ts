import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { OEvent } from 'app/model/oevent';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventAdminService } from 'app/upload/event-admin.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  events: FirebaseListObservable<OEvent[]>;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private eventAdmin: EventAdminService,
    private db: AngularFireDatabase) { }

  ngOnInit() {

    const opts = {
      query: {
        orderByChild: 'eventdate',
      }
    };

    this.events = this.db.list('/events', opts);

  }
  eventClicked(event: OEvent) {

  }

}
