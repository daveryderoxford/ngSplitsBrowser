
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatSelectChange } from "@angular/material";
import { Club, EventGrades, Nations, OEvent, Nation } from "app/model";
import { BehaviorSubject, combineLatest, Observable, Subject } from "rxjs";
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { EventService } from "../event.service";

@Component({
   selector: "app-club-events-tab",
   templateUrl: "./club-events-tab.component.html",
   styleUrls: ["./club-events-tab.component.scss"]
})
export class ClubEventsTabComponent implements OnInit {
   @Output() eventSelected = new EventEmitter();

   clubNationalityFilter$ = new BehaviorSubject<string>("");
   clubNameFilter$ = new BehaviorSubject<string>("");

   loading$: Observable<boolean>;

   clubs$: Observable<Club[]> = undefined;
   clubEvents: Array<OEvent> = [];

   grades: EventGrades[];
   nations: Nation[];

   constructor(private es: EventService) {
      this.loading$ = this.es.loading;

      this.grades = EventGrades.grades;
      this.nations = Nations.getNations();
      this.nations.unshift(Nations.nullNation);
   }

   ngOnInit() {
      // Club filter
      this.clubs$ = combineLatest(this.es.getClubs(), this.clubNationalityFilter$, this.clubNameFilter$).pipe(
         map(([clubs, nat, name]) => this.filterClubs(clubs, nat, name))
      );
   }

   clubNationalFilterChange(event: MatSelectChange) {
      this.clubNationalityFilter$.next(event.value);
   }

   filterClubs(clubs: Club[], natFilter: string, nameFilter: string) {
      return clubs
         .filter(club => natFilter === "" || club.nationality === natFilter)
         .filter(club => nameFilter === "" || club.name.includes(nameFilter.toUpperCase())
         );
   }

   setSelectedClub(club: Club) {
      if (club !== null) {
         this.es.getEventsForClub(club).pipe(
            tap(events => console.log(JSON.stringify(events)))
         ).subscribe(events => this.clubEvents = events);
      }
   }

   clubNameFilterChange(event: any) {
      this.clubNameFilter$.next(event.target.value);
   }

   eventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}
