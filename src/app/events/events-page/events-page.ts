import { Component, computed, inject, signal } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs";
import { Router, RouterLink } from "@angular/router";
import { OEvent } from "app/events/model/oevent";
import { DialogsService } from "app/shared";
import { Toolbar } from 'app/shared/components/toolbar';
import { AllEventsTabComponent } from "../all-events-tab/all-events-tab.component";
import { ClubEventsTabComponent } from "../club-events-tab/club-events-tab";
import { EventService } from "../event.service";
import { MyEventsTab } from "../my-events-tab/my-events-tab";
import { AppBreakpoints } from 'app/shared/services/breakpoints';


@Component({
   selector: "app-results",
   templateUrl: "./events-page.html",
   styleUrls: ["./events-page.scss"],
   imports: [MatTabsModule, AllEventsTabComponent, ClubEventsTabComponent, MyEventsTab, Toolbar, MatButtonModule, RouterLink]
})
export class EventsPage {
   private router = inject(Router);
   public es = inject(EventService);
   private ds = inject(DialogsService);
   private breakpoints = inject(AppBreakpoints);

   pageTitle = computed(() => this.breakpoints.narrowScreen() ? "Events" : "Splitsbrowser Events");
   uploadButtonTitle = computed(() => this.breakpoints.narrowScreen() ? "Upload" : "Upload results");

   async eventClicked(event: OEvent) {

      if (!event.splits || event.splits.valid === false) {
         this.ds.message("No valid splits avaliable for event", "Press OK to select another event");
      } else {
         this.router.navigate(["results", "graph", event.key], {
            queryParams: {
               eventName: event.name,
               eventDate: event.date ? event.date.toISOString() : undefined
            }
         });
      }
   }
}
