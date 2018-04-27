import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { OEvent } from "app/model/oevent";
import { Observable } from "rxjs/Observable";
import { AngularFirestore } from "angularfire2/firestore";

@Component({
  selector: "app-main",
  templateUrl: "./main.component.html",
  styleUrls: ["./main.component.scss"]
})
export class MainComponent implements OnInit {

  events: Observable<OEvent[]>;

  constructor( private afs: AngularFirestore,
               private router: Router) { }

 ngOnInit() {

    this.events = this.afs.collection<OEvent>("/events",
      ref => ref.orderBy("date", "desc").limit(4) ).valueChanges();
  }

  eventClicked(event: OEvent) {
     this.router.navigate(["/graph", event.key ]);
  }

}
