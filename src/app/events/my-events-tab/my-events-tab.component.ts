import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { UserResultData, OEvent } from "app/model";
import { UserDataService } from "app/user/user-data.service";
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from "firebase";

@Component({
   selector: "app-my-events-tab",
   templateUrl: "./my-events-tab.component.html",
   styleUrls: ["./my-events-tab.component.scss"]
})
export class MyEventsTabComponent implements OnInit {
   @Output()
   eventSelected = new EventEmitter();

   loggedIn: boolean;
   myResults$: Observable<UserResultData[]> = undefined;

   constructor(private us: UserDataService,
               private afAuth: AngularFireAuth ) {
                   this.afAuth.authState.subscribe( user => {
                    this.loggedIn = (user !== null);
                   });
               }

   ngOnInit() {

    this.afAuth.authState.subscribe((user: firebase.User) => {
        // If logged in then gf
        if (user !== null) {
            this.myResults$ = this.us.getUser().map(userdata => {
                return userdata.results;
             });
        }
    });
   }

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
