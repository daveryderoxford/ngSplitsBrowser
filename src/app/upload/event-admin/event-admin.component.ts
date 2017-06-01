import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { OEvent, EventInfo } from 'app/model/oevent';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import { EventAdminService } from 'app/upload/event-admin.service';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {

  events: FirebaseListObservable<OEvent[]>;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private eventAdmin: EventAdminService,
    private db: AngularFireDatabase) { }

  ngOnInit() {

    const opts = {
      query: {
        orderByChild: 'user',
        equalTo: this.afAuth.auth.currentUser.uid
      }
    };

    this.events = this.db.list('/events', opts);

  }

  uploadsplits() {

  }

  async upload(files: File[]) {
    const splitsFile = files[0];
    try {
      await this.eventAdmin.uploadSplits(this.selectedEvent, splitsFile);
     } catch (err) {
        console.log('EventAdminComponnet: Error uploading splits' + err );
     }
  }

  addEvent() {
    this.selectedEvent = null;
    this.new = true;
  }

  eventClicked(event: OEvent) {
    this.selectedEvent = event;
    this.new = false;
  }

}
