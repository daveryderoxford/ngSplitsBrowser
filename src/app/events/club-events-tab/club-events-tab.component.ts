import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Club, OEvent, Nations, EventGrades } from "app/model";
import { MatSelectChange } from "@angular/material";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject, Subject } from "rxjs";
import { EventService } from "../event.service";
import { map } from "rxjs/operators";

@Component({
   selector: "app-club-events-tab",
   templateUrl: "./club-events-tab.component.html",
   styleUrls: ["./club-events-tab.component.scss"]
})
export class ClubEventsTabComponent implements OnInit {
   @Output() eventSelected = new EventEmitter();

   selctedClub = new Subject<Club>();
   clubNationalityFilter = new BehaviorSubject("");
   clubNameFilter = new BehaviorSubject("");

   clubs$: Observable<Club[]> = undefined;
   clubEvents: Array<OEvent> = [];

   grades = EventGrades.grades;
   nations = Nations.getNations();

   constructor(private es: EventService) {}

   ngOnInit() {
      // Club filter
      this.clubs$ = Observable.combineLatest(
         this.es.getClubs(),
         this.clubNationalityFilter,
         this.clubNameFilter
      ).pipe(map(obs => this.filterClubs(obs[0], obs[1], obs[2])));

      this.selctedClub
         .filter(club => club !== null)
         .switchMap(club => this.es.getEventsForClub(club))
         .subscribe(events => (this.clubEvents = events));
   }

   clubNationalFilterChange(event: MatSelectChange) {
      this.clubNationalityFilter.next(event.value);
   }

   filterClubs(clubs: Club[], natFilter: string, nameFilter: string) {
      return clubs
         .filter(club => natFilter === "" || club.nationality === natFilter)
         .filter(
            club =>
               nameFilter === "" || club.name.includes(nameFilter.toUpperCase())
         );
   }

   setSelectedClub(club: Club) {
      const c = club;
      this.selctedClub.next(c);
   }

   clubNameFilterChange(event: any) {
      this.clubNameFilter.next(event.target.value);
   }

   eventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
