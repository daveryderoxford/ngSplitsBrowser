import { Component, inject, signal } from "@angular/core";
import { provideNativeDateAdapter } from '@angular/material/core';
import { Toolbar } from 'app/shared/components/toolbar';
import { OEvent } from "../../events/model/oevent";
import { DialogsService } from "../../shared/dialogs/dialogs.service";
import { EventAdminService } from "../event-admin.service";
import { EventList } from "../event-list/event-list";
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'app/auth/auth.service';
import { MatProgressBar } from "@angular/material/progress-bar";
import { EventDetailsPanel } from "./event-detail-panel/event-detail-panel";
import { AppBreakpoints } from 'app/shared/services/breakpoints';

interface SplitsUpload {
  event: OEvent;
  files: File[];
}

@Component({
  selector: "app-event-admin",
  templateUrl: "./event-admin.html",
  styleUrls: ["./event-admin.scss"],
  imports: [Toolbar, EventList, MatButtonModule, RouterLink, MatIconModule, MatProgressBar, EventDetailsPanel],
  providers: [provideNativeDateAdapter()]
})
export class EventAdminComponent {
  protected eventAdmin = inject(EventAdminService);
  protected dialogsService = inject(DialogsService);
  protected auth = inject(AuthService);
  private router = inject(Router);
  protected breakpoints = inject(AppBreakpoints);

  detailEvent = signal<OEvent | undefined>(undefined);

  loading = false;

  constructor() {
    this.eventAdmin.loadEvents('invalid-splits');
  }

  async uploadSplits(upload: SplitsUpload) {
    const event = upload.event;

    let confirm = true;
    if (event.splits) {
      confirm = await this.dialogsService.confirm("Confirm Dialog", "Are you sure you want to overwrite splits?");
    }
    if (confirm) {
      this.loading = true;
      const splitsFile = upload.files[0];
      try {
        const results = await this.eventAdmin.uploadResults(event, splitsFile);
        if (results.warnings && results.warnings.length > 0) {
          const msg = results.warnings.reduce((acc = '', warn) => acc + '\n' + warn);
          console.log(`EventAdminComponnet: Splits uploaded with warnings\n Event key: ${event.key} \n${msg}`);
          await this.dialogsService.message(`Warnings uploading splits`,
            `Splits uploaded sucessfully with the following warning messages \n${msg}`);
        }
      } catch (err) {
        console.log(`EventAdminComponnet: Error uploading splits ${err}`);
        this.dialogsService.message(`Error uploading splits`, `Error uploading splits \n${err}`);
      } finally {
        this.loading = false;
      }
    }
  }

  editEvent(event: OEvent) {
    this.router.navigate(["/admin/edit-event/", event.key]);
  }

  async deleteEvent(event: OEvent) {
    const confirm = await this.dialogsService.confirm("Confirm Dialog", "Are you sure you want to delete is event?");
    if (confirm) {
      try {
        this.loading = true;
        await this.eventAdmin.delete(event);
      } catch (err) {
        console.log("EventAdminComponnet: Error deleting event" + err);
      } finally {
        this.loading = false;
      }
    }
  }
}
