
import { ChangeDetectionStrategy, Component, inject, output } from "@angular/core";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AuthService } from 'app/auth/auth.service';
import { UserDataService } from "app/user/user-data.service";
import { OEvent } from '../model/oevent';
import { MatButtonModule } from "@angular/material/button";
import { UserResultButton } from "app/user-results/user-result-button";
import { UserResultsTableComponent } from "app/user-results/user-results-table/user-results-table";
import { SelectedEventService } from '../selected-event.service';

@Component({
   selector: "app-my-events-tab",
   templateUrl: "./my-events-tab.html",
   styleUrls: ["./my-events-tab.scss"],
   imports: [MatButtonModule, RouterLink, MatListModule, UserResultButton, UserResultsTableComponent],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventsTab {
   protected us = inject(UserDataService);
   protected ses = inject(SelectedEventService);
   protected auth = inject(AuthService);

   eventSelected = output<OEvent>();

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
