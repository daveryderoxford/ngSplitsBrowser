import { Component, inject, signal } from "@angular/core";
import { provideNativeDateAdapter } from '@angular/material/core';
import { Toolbar } from 'app/shared/components/toolbar';
import { OEvent } from "../../events/model/oevent";
import { DialogsService } from "../../shared/dialogs/dialogs.service";
import { EventAdminService, EventFilter } from "../event-admin.service";
import { EventList } from "../event-list/event-list";
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from 'app/auth/auth.service';
import { MatProgressBar } from "@angular/material/progress-bar";
import { EventDetailsPanel } from "./event-detail-panel/event-detail-panel";
import { AppBreakpoints } from 'app/shared/services/breakpoints';
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";

interface SplitsUpload {
  event: OEvent;
  files: File[];
}

@Component({
  selector: "app-event-admin",
  templateUrl: "./event-admin-page.html",
  styleUrls: ["./event-admin-page.scss"],
  imports: [Toolbar, EventList, MatButtonModule, RouterLink, MatIconModule, MatProgressBar, EventDetailsPanel, MatInputModule, MatSelectModule],
  providers: [provideNativeDateAdapter()]
})
export class EventAdminComponent {
  protected eventAdmin = inject(EventAdminService);
  protected dialogsService = inject(DialogsService);
  protected auth = inject(AuthService);
  private router = inject(Router);
  protected breakpoints = inject(AppBreakpoints);

  protected detailEvent = signal<OEvent | undefined>(undefined);

  private _loading = false;

  protected resultsViews: { type: EventFilter, name: string; }[] = [
    { type: 'unset', name: '' },
    { type: 'recent', name: 'Recent events' },
    { type: 'invalid-splits', name: 'Failed uploads' },
    { type: 'all', name: 'All events' },
  ];

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
      this._loading = true;
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
        this._loading = false;
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
        this._loading = true;
        await this.eventAdmin.delete(event);
      } catch (err) {
        console.log("EventAdminComponnet: Error deleting event" + err);
      } finally {
        this._loading = false;
      }
    }
  }

  viewChanged(change: MatSelectChange<EventFilter>) {
    this.eventAdmin.loadEvents(change.value);
  }
}
