import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireDatabase } from "angularfire2/database";
import { OEvent } from "app/model/oevent";
import { Observable } from "rxjs/Observable";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {

  events: Observable<OEvent[]>;

  constructor( private db: AngularFireDatabase,
               private router: Router) { }

 ngOnInit() {

    const opts = {
      query: {
        orderByChild: "date_club_index",
        limitToFirst: 4
      }
    };

    this.events = this.db.list<OEvent>("/events", ref => ref.orderByChild("date_club_index").limitToFirst(4) ).valueChanges();

  }

  eventClicked(event: OEvent) {
     this.router.navigate(["/graph", event.key ]);
  }

}
