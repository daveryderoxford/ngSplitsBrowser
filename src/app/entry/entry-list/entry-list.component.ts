import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EntryService } from 'app/entry/entry.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Entry } from 'app/model/entry';
import { Course } from 'app/results/model';

/** Display all the entries for a fixture */
@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryListComponent implements OnInit {

   constructor(private route: ActivatedRoute,
      private es: EntryService) { }

   ngOnInit() {
      this.route.params.pipe(
         map(params => params.get('id')),
         switchMap(fixtureId => this.es.getEntries$(fixtureId))
      );
   }

   entriesForCourse(course: Course, entries: Entry[]): Entry[] {
      return entries.filter((entry) => entry.course === course.name);
   }
}
