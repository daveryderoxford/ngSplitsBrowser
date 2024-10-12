import { Component, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { DialogsService } from "../../shared/dialogs/dialogs.service";
import { OEvent } from "../../model/oevent";
import { EventAdminService } from "../event-admin.service";
import { Observable } from "rxjs";
import { MatListModule } from '@angular/material/list';
import { FileButtonComponent } from "../file-button/file-button.component";
import { EventEditComponent } from "../event-edit/event-edit.component";
import { NgFor, NgIf, AsyncPipe, DatePipe } from "@angular/common";
import { SidenavButtonComponent } from "../../shared/components/sidenav-button.component";
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
    selector: "app-event-admin",
    templateUrl: "./event-admin.component.html",
    styleUrls: ["./event-admin.component.scss"],
    standalone: true,
    imports: [
        SidenavButtonComponent,
        NgFor,
        NgIf,
        EventEditComponent,
        FileButtonComponent,
        AsyncPipe,
        DatePipe,
        MatCardModule,
        MatSidenavModule,
        MatListModule
    ],
})
export class EventAdminComponent implements OnInit {

  events: Observable<OEvent[]>;

  selectedEvent: OEvent = null;
  new = false;
  loading = false;

  constructor( private eventAdmin: EventAdminService,
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
      this.loading = true;
      const splitsFile = files[0];
      try {
        const results = await this.eventAdmin.uploadResults(this.selectedEvent, splitsFile);
        if (results.warnings && results.warnings.length > 0 ) {
          const msg = results.warnings.reduce( (acc = '', warn) => acc + '\n'  + warn);
          console.log("EventAdminComponnet: Splits uploaded with warnings\n Event key: " + this.selectedEvent.key + '\n' + msg );
          await this.dialogsService.message("Warnings uploading splits",
                                            "Splits uploaded sucessfully with the following warning messages\n" + msg);
        }
      } catch (err) {
        console.log("EventAdminComponnet: Error uploading splits" + err);
        this.dialogsService.message("Error uploading splits", "Error uploading splits\n" + err);
      } finally {
        this.loading = false;
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
        this.loading = true;
        await this.eventAdmin.delete(this.selectedEvent);
        this.selectedEvent = null;
      } catch (err) {
        console.log("EventAdminComponnet: Error deleting event" + err);
      } finally {
        this.loading = false;
      }
    }
  }

  eventClicked(event: OEvent) {
    this.selectedEvent = event;
    this.new = false;
  }

}

