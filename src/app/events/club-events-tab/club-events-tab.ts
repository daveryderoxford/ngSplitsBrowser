
import { AsyncPipe, DatePipe } from "@angular/common";
import { Component, OnInit, output, inject } from "@angular/core";
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { map, tap } from 'rxjs/operators';
import { EventService } from "../event.service";
import { EventGrades, OEvent } from '../model/oevent';
import { Club } from '../model/club';
import { Nation, Nations } from '../model/nations';
import { EventListItem } from "../event-list-item";
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-club-events-tab",
    templateUrl: "./club-events-tab.html",
    styleUrls: ["./club-events-tab.scss"],
    imports: [MatFormFieldModule, 
      MatSelectModule, 
      MatOptionModule, 
      MatInputModule, 
      MatExpansionModule, 
      MatProgressBarModule, 
      MatDividerModule, 
      AsyncPipe, 
      DatePipe, 
      MatListModule,
      EventListItem]
})
export class ClubEventsTabComponent implements OnInit {
      private es = inject(EventService);
   eventSelected = output<OEvent>();

   clubNationalityFilter$ = new BehaviorSubject<string>("");
   clubNameFilter$ = new BehaviorSubject<string>("");

   loading$: Observable<boolean>;

   clubs$: Observable<Club[]> = undefined;
   clubEvents: Array<OEvent> = [];

   grades: EventGrades[];
   nations: Nation[];

   constructor() {
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
