import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FlexModule } from '@ngbracket/ngx-layout';
import { ToolbarComponent } from 'app/shared/components/toolbar.component';
import { OEvent } from "../../events/model/oevent";
import { DialogsService } from "../../shared/dialogs/dialogs.service";
import { EventAdminService } from "../event-admin.service";
import { EventForm } from "../event-edit/event-form";
import { FileButtonComponent } from "../file-button/file-button.component";

@Component({
  selector: "app-event-admin",
  templateUrl: "./event-admin.component.html",
  styleUrls: ["./event-admin.component.scss"],
  standalone: true,
  imports: [
    ToolbarComponent,
    EventForm,
    FileButtonComponent,
    AsyncPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    FlexModule
  ],
  providers: [provideNativeDateAdapter()],
})
export class EventAdminComponent {
  protected eventAdmin = inject(EventAdminService);
  protected dialogsService = inject(DialogsService);

  selectedEvent: OEvent = null;
  new = true;
  loading = false;

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
        if (results.warnings && results.warnings.length > 0) {
          const msg = results.warnings.reduce((acc = '', warn) => acc + '\n' + warn);
          console.log("EventAdminComponnet: Splits uploaded with warnings\n Event key: " + this.selectedEvent.key + '\n' + msg);
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
