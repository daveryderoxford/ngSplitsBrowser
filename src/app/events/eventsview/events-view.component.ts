import { Component, OnInit, inject } from "@angular/core";
import { Router } from "@angular/router";
import { OEvent } from "app/model/oevent";
import { DialogsService } from "app/shared";
import { EventService } from "../event.service";
import { MyEventsTabComponent } from "../my-events-tab/my-events-tab.component";
import { ClubEventsTabComponent } from "../club-events-tab/club-events-tab.component";
import { AllEventsTabComponent } from "../all-events-tab/all-events-tab.component";
import { MatTabsModule } from "@angular/material/tabs";
import { SidenavButtonComponent } from "../../shared/components/sidenav-button.component";

@Component({
    selector: "app-results",
    templateUrl: "./events-view.component.html",
    styleUrls: ["./events-view.component.scss"],
    standalone: true,
    imports: [SidenavButtonComponent, MatTabsModule, AllEventsTabComponent, ClubEventsTabComponent, MyEventsTabComponent]
})
export class EventsViewComponent{
      private router = inject(Router);
      public es = inject(EventService);
      private ds = inject(DialogsService);

  eventClicked(event: OEvent) {
      if (!event.splits || event.splits.valid === false) {
         this.ds.message("Results display failed", "No valid results uploaded for event");
      } else {
      this.router.navigate(["/graph", event.key]).catch((err) => {
        console.log('Errror in loading results for ' + event.name + ' ' + err);
        this.ds.message('Error loading results', 'Error loading results for event');
      });
    }
  }

  graphMenuSelected() {
  }

  summaryMenuSelected() {
  }

  adminMenuSelected() {
  }

  eventEditable() {

  }

}

