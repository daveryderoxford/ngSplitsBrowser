import { Component, OnInit, Input } from "@angular/core";
import { Router } from "@angular/router";

import { OEvent, EventInfo } from "app/model/oevent";

import { AngularFireDatabase } from "angularfire2/database";
import { AngularFireAuth } from "angularfire2/auth";

import { DialogsService } from "app/dialogs/dialogs.service";
import { EventAdminService } from "app/upload/event-admin.service";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-event-admin",
  templateUrl: "./event-admin.component.html",
  styleUrls: ["./event-admin.component.css"]
})
export class EventAdminComponent implements OnInit {

  events: Observable<any[]>;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private eventAdmin: EventAdminService,
    private db: AngularFireDatabase,
    private dialogsService: DialogsService) { }

  ngOnInit() {

    const opts = {
      query: {
        orderByChild: "user",
        equalTo: this.afAuth.auth.currentUser.uid
      }
    };

    this.events = this.db.list<OEvent>("/events", ref => ref.orderByChild("user").equalTo(this.afAuth.auth.currentUser.uid) ).valueChanges()
                     .map( arr => arr.sort( (a, b) => this.compareDates(a, b) ));
  }

  compareDates(a: OEvent, b: OEvent) {
    if (a.eventdate < b.eventdate) {
       return(1);
    } else {
      return(-1);
    }
  }

  async uploadSplits(files: File[]) {
    let confirm = true;
    if (this.selectedEvent.splits) {
      confirm = await this.dialogsService.confirm("Confirm Dialog", "Are you sure you want to overwrite splits?");
    }
    if (confirm) {
      const splitsFile = files[0];
      try {
        await this.eventAdmin.uploadSplits(this.selectedEvent, splitsFile);
      } catch (err) {
        console.log("EventAdminComponnet: Error uploading splits" + err);
      }
    }
  }

  addEvent() {
    this.selectedEvent = null;
    this.new = true;
  }

  async deleteEvent() {
    const confirm = await this.dialogsService.confirm("Confirm Dialog", "Are you sure you want to delete is event?");
    if (confirm) {
      try {
        await this.eventAdmin.delete(this.selectedEvent);
        this.selectedEvent = null;
      } catch (err) {
        console.log("EventAdminComponnet: Error deleting event" + err);
      }
    }
  }

  eventClicked(event: OEvent) {
    this.selectedEvent = event;
    this.new = false;
  }

}

