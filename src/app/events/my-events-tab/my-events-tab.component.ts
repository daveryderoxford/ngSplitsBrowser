
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { OEvent, UserResult } from "app/model";
import { UserDataService } from "app/user/user-data.service";
import * as firebase from "firebase";
import { Observable } from "rxjs";
import { map, filter } from 'rxjs/operators';

@Component({
   selector: "app-my-events-tab",
   templateUrl: "./my-events-tab.component.html",
   styleUrls: ["./my-events-tab.component.scss"]
})
export class MyEventsTabComponent implements OnInit {
   @Output() eventSelected = new EventEmitter();

   loggedIn: boolean;
   myResults$: Observable<UserResult[]>;

   constructor(private us: UserDataService,
      private afAuth: AngularFireAuth) {

         this.afAuth.authState.subscribe( user => this.loggedIn = (user !== null));

         this.myResults$ = this.us.userData().pipe(
            filter( userdata => userdata !== null ),
            map(userdata => userdata.results)
         );
      }

   ngOnInit() {}

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
