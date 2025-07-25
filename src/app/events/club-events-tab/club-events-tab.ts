
import { DatePipe } from "@angular/common";
import { Component, computed, inject, output, signal } from "@angular/core";
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { AppBreakpoints } from 'app/shared/services/breakpoints';
import { Observable } from "rxjs";
import { EventListItem } from "../event-list-item";
import { EventService } from "../event.service";
import { Club } from '../model/club';
import { Nation, Nations } from '../model/nations';
import { EventGrades, OEvent } from '../model/oevent';

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
      DatePipe,
      MatListModule,
      EventListItem]
})
export class ClubEventsTabComponent {
   protected es = inject(EventService);
   breakpoints = inject(AppBreakpoints);

   eventSelected = output<OEvent>();

   natFilter = signal<string>("");
   nameFilter = signal<string>("");

   filteredClubs = computed(() => filterClubs(
      this.es.clubs(),
      this.natFilter(),
      this.nameFilter()));

   clubEvents: OEvent[] = [];

   grades = EventGrades.grades;
   nations = Nations.getNations();

   constructor() {
      this.es.loadClubs();
      this.nations.unshift(Nations.nullNation);
   }

   clubNationalFilterChange(event: MatSelectChange) {
      this.natFilter.set(event.value);
   }

   setSelectedClub(club: Club) {
      this.es.setSelectedClub(club);
   }

   clubNameFilterChange(event: any) {
      this.nameFilter.set(event.target.value);
   }

   eventClicked(event: OEvent) {
      this.eventSelected.emit(event);
   }
}

function filterClubs(clubs: Club[], natFilter: string, nameFilter: string) {
   return clubs
      .filter(club => natFilter === "" || club.nationality === natFilter)
      .filter(club => nameFilter === "" || club.name.includes(nameFilter.toUpperCase())
      );
}

