
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { UntilDestroy } from '@ngneat/until-destroy';
import { OEvent, UserResult } from "app/model";
import { UserDataService } from "app/user/user-data.service";
import { Observable } from "rxjs";
import { filter, map } from 'rxjs/operators';
import { MatLegacyListModule } from "@angular/material/legacy-list";
import { RouterLink } from "@angular/router";
import { MatLegacyButtonModule } from "@angular/material/legacy-button";
import { AsyncPipe } from "@angular/common";

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-my-events-tab",
    templateUrl: "./my-events-tab.component.html",
    styleUrls: ["./my-events-tab.component.scss"],
    standalone: true,
    imports: [MatLegacyButtonModule, RouterLink, MatLegacyListModule, AsyncPipe]
})
export class MyEventsTabComponent implements OnInit {
   @Output() eventSelected = new EventEmitter();

   loggedIn: boolean;
   myResults$: Observable<UserResult[]>;

   constructor(private us: UserDataService,
      private afAuth: AngularFireAuth) {

         this.afAuth.authState.subscribe( user => this.loggedIn = (user !== null));

         this.myResults$ = this.us.user$.pipe(
            filter( userdata => userdata !== null ),
            map(userdata => userdata.results)
         );
      }

   ngOnInit() {}

   oeventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
