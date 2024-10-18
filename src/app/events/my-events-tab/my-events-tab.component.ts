
import { AsyncPipe } from "@angular/common";
import { Component, OnInit, output, inject } from "@angular/core";
import { Auth, authState } from '@angular/fire/auth';
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { RouterLink } from "@angular/router";
import { UntilDestroy } from '@ngneat/until-destroy';
import { OEvent, UserResult } from "app/model";
import { UserDataService } from "app/user/user-data.service";
import { Observable } from "rxjs";
import { filter, map } from 'rxjs/operators';

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-my-events-tab",
    templateUrl: "./my-events-tab.component.html",
    styleUrls: ["./my-events-tab.component.scss"],
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatListModule, AsyncPipe]
})
export class MyEventsTabComponent implements OnInit {
      private us = inject(UserDataService);
      private auth = inject(Auth);
   eventSelected = output<OEvent>();

   loggedIn: boolean;
   myResults$: Observable<UserResult[]>;

   constructor() {

         authState(this.auth).subscribe( user => this.loggedIn = (user !== null));

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
