import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OEvent } from "app/model/oevent";
import { DialogsService } from "app/shared";
import { EventService } from "../event.service";
import { MyEventsTabComponent } from "../my-events-tab/my-events-tab.component";
import { ClubEventsTabComponent } from "../club-events-tab/club-events-tab.component";
import { AllEventsTabComponent } from "../all-events-tab/all-events-tab.component";
import { MatLegacyTabsModule } from "@angular/material/legacy-tabs";
import { SidenavButtonComponent } from "../../shared/components/sidenav-button.component";

@Component({
    selector: "app-results",
    templateUrl: "./events-view.component.html",
    styleUrls: ["./events-view.component.scss"],
    standalone: true,
    imports: [SidenavButtonComponent, MatLegacyTabsModule, AllEventsTabComponent, ClubEventsTabComponent, MyEventsTabComponent]
})
export class EventsViewComponent implements OnInit {

  constructor(private router: Router,
    public es: EventService,
    private ds: DialogsService) {
  }

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

  // eslint-disable-next-line
  ngOnInit() {

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

