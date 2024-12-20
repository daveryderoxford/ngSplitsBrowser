
import { Component, computed, inject, output } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { AuthService } from 'app/auth/auth.service';
import { UserDataService } from "app/user/user-data.service";
import { OEvent } from '../model/oevent';

@Component({
   selector: "app-my-events-tab",
   templateUrl: "./my-events-tab.component.html",
   styleUrls: ["./my-events-tab.component.scss"],
   imports: [MatButtonModule, RouterLink, MatListModule]
})
export class MyEventsTabComponent {
   private us = inject(UserDataService);
   private auth = inject(AuthService);
   eventSelected = output<OEvent>();

   loggedIn = computed(() => this.auth.user() !== null);

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
