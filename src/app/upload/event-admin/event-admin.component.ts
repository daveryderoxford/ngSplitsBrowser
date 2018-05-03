import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase } from "angularfire2/database";
import { DialogsService } from "app/dialogs/dialogs.service";
import { OEvent } from "app/model/oevent";
import { EventAdminService } from "app/upload/event-admin.service";
import { Observable } from "rxjs/Observable";


@Component({
  selector: "app-event-admin",
  templateUrl: "./event-admin.component.html",
  styleUrls: ["./event-admin.component.css"]
})
export class EventAdminComponent implements OnInit {

  events: Observable<OEvent[]>;

  selectedEvent: OEvent = null;
  new = false;

  constructor(private afAuth: AngularFireAuth,
    private eventAdmin: EventAdminService,
    private db: AngularFireDatabase,
    private dialogsService: DialogsService) { }

  ngOnInit() {
    this.events = this.eventAdmin.getUserEvents();
  }

  async uploadSplits(files: File[]) {
    let confirm = true;
    if (this.selectedEvent.splits) {
      confirm = await this.dialogsService.confirm("Confirm Dialog", "Are you sure you want to overwrite splits?");
    }
    if (confirm) {
      const splitsFile = files[0];
      try {
        await this.eventAdmin.uploadResults(this.selectedEvent, splitsFile);
      } catch (err) {
        console.log("EventAdminComponnet: Error uploading splits" + err);
        this.dialogsService.message("Error uploading splits", "Error uploading splits\n" + err);
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

