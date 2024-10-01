
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { MatLegacySelectChange as MatSelectChange, MatLegacySelectModule } from "@angular/material/legacy-select";
import { UntilDestroy } from '@ngneat/until-destroy';
import { Club, EventGrades, Nation, Nations, OEvent } from "app/model";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { EventService } from "../event.service";
import { MatLegacyProgressBarModule } from "@angular/material/legacy-progress-bar";
import { EventsTableComponent } from "../events-table/events-table.component";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatLegacyInputModule } from "@angular/material/legacy-input";
import { MatLegacyOptionModule } from "@angular/material/legacy-core";
import { AsyncPipe, DatePipe } from "@angular/common";
import { MatLegacyFormFieldModule } from "@angular/material/legacy-form-field";

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-club-events-tab",
    templateUrl: "./club-events-tab.component.html",
    styleUrls: ["./club-events-tab.component.scss"],
    standalone: true,
    imports: [MatLegacyFormFieldModule, MatLegacySelectModule, MatLegacyOptionModule, MatLegacyInputModule, MatExpansionModule, EventsTableComponent, MatLegacyProgressBarModule, AsyncPipe, DatePipe]
})
export class ClubEventsTabComponent implements OnInit {
   @Output() eventSelected = new EventEmitter<OEvent>();ng

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
      this.clubs$ = combineLatest([this.es.getClubs(), this.clubNationalityFilter$, this.clubNameFilter$]).pipe(
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
      console.log("=================" + club.name + "=============");
      if (club !== null) {
         this.clubEvents = [];
         this.es.getEventsForClub(club).pipe(
            tap(events => {
               for (const e of events) {
                  console.log(e.name + ' ' + e.club + '  ' + e.nationality);
               }
            })
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
