import { Component, inject } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from "@angular/material/tabs";
import { Router, RouterLink } from "@angular/router";
import { OEvent } from "app/events/model/oevent";
import { DialogsService } from "app/shared";
import { ToolbarComponent } from 'app/shared/components/toolbar.component';
import { AllEventsTabComponent } from "../all-events-tab/all-events-tab.component";
import { ClubEventsTabComponent } from "../club-events-tab/club-events-tab.component";
import { EventService } from "../event.service";
import { MyEventsTabComponent } from "../my-events-tab/my-events-tab.component";

@Component({
    selector: "app-results",
    templateUrl: "./events-view.component.html",
    styleUrls: ["./events-view.component.scss"],
    imports: [MatTabsModule, AllEventsTabComponent, ClubEventsTabComponent, MyEventsTabComponent, ToolbarComponent, MatButtonModule, RouterLink]
})
export class EventsViewComponent {
  private router = inject(Router);
  public es = inject(EventService);
  private ds = inject(DialogsService);

  eventClicked(event: OEvent) {
    if (!event.splits || event.splits.valid === false) {
      this.ds.message("Results display failed", "No valid splits avaliable for event");
    } else {
      this.router.navigate(["results", "graph", event.key]).catch((err) => {
        console.log('Errror in loading results for ' + event.name + ' \n' + err.toString());
        this.ds.message('Error loading results', 'Error loading results for event');
      });
    }
  }
}
