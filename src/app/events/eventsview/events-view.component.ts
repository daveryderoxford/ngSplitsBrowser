import { Component, OnInit, ViewChild } from "@angular/core";
import { MatTab } from "@angular/material";
import { Router } from "@angular/router";
import { OEvent } from "app/model/oevent";
import { DialogsService } from "app/shared";
import { UserDataService } from "app/user/user-data.service";
import { EventService } from "../event.service";

@Component({
  selector: "app-results",
  templateUrl: "./events-view.component.html",
  styleUrls: ["./events-view.component.scss"],
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

  // tslint:disable-next-line:use-life-cycle-interface
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

