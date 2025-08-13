
import { ChangeDetectionStrategy, Component, computed, inject, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AuthService } from 'app/auth/auth.service';
import { UserDataService } from "app/user/user-data.service";
import { OEvent } from '../model/oevent';
import { MatTableModule } from "@angular/material/table";
import { DatePipe } from '@angular/common';

@Component({
   selector: "app-my-events-tab",
   templateUrl: "./my-events-tab.html",
   styleUrls: ["./my-events-tab.scss"],
   imports: [MatButtonModule, RouterLink, MatListModule, MatTableModule, DatePipe],
   changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyEventsTab {
   protected us = inject(UserDataService);
   protected auth = inject(AuthService);

   eventSelected = output<OEvent>();

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
