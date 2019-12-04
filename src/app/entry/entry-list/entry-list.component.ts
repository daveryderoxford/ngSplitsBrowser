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

   fixture: FixtureDetailsAndEntries = { details: null, entries: null};
   entries: Entry[];

   displayedColumns = ["id", "name", "class", ];

   constructor(private route: ActivatedRoute,
      private es: EntryService) { }

   ngOnInit() {

     this.route.params.pipe(
         map(params => params.get('id')),
         switchMap(fixtureId => this.es.getEntries$(fixtureId))
     ).subscribe( entry => this.fixture = entry );
   }

   applyFilter(filterValue: string) {
     const str = filterValue.trim().toLowerCase();
      this.entries = this.fixture.entries.filter( (entry) => {
        return entry.firstname.startsWith( str) ||
            entry.surname.startsWith(str) ||
            entry.club.startsWith(str);
     });
   }

   entriesForCourse(course: Course): Entry[] {
      return this.entries.filter((entry) => entry.course === course.name);
   }
}
