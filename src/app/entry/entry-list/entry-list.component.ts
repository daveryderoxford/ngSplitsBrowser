import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntryService } from 'app/entry/entry.service';
import { FixtureDetailsAndEntries, Entry } from 'app/model/entry';
import { Course } from 'app/results/model';
import { map, switchMap } from 'rxjs/operators';

/** Display all the entries for a fixture */
@Component({
   selector: 'app-entry-list',
   templateUrl: './entry-list.component.html',
   styleUrls: ['./entry-list.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntryListComponent implements OnInit {

   entryDetails: FixtureDetailsAndEntries = { details: null, entries: null};
   entries: Entry[];

   constructor(private route: ActivatedRoute,
      private es: EntryService) { }

   ngOnInit() {

     this.route.params.pipe(
         map(params => params.get('id')),
         switchMap(fixtureId => this.es.getEntries$(fixtureId))
      ).subscribe( details => this.entryDetails = details );
   }

   applyFilter(filterValue: string) {
     const str = filterValue.trim().toLowerCase();
     this.entries = this.entryDetails.entries.filter( (entry) => {
        return entry.firstname.startsWith( str) ||
            entry.surname.startsWith(str) ||
            entry.club.startsWith(str);
     });
   }

   entriesForCourse(course: Course): Entry[] {
      return this.entries.filter((entry) => entry.course === course.name);
   }
}
