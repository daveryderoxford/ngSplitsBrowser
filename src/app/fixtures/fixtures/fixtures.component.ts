import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EntryService } from 'app/entry/entry.service';
import { Fixture } from 'app/model';
import { Entry, FixtureEntryDetails } from 'app/model/entry';
import { LatLong } from 'app/model/fixture';
import { FixtureFilter } from 'app/model/fixture-filter';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FixturesService } from '../fixtures.service';

@UntilDestroy( { checkProperties: true } )
@Component({
   selector: 'app-fixtures',
   templateUrl: './fixtures.component.html',
   styleUrls: ['./fixtures.component.scss']
})

export class FixturesComponent implements OnInit {
   selectedFixture: Fixture;

   homeLocation$: Observable<LatLong>;
   postcode$: Observable<string>;
   fixtures$: Observable<Fixture[]>;
   selectedFixture$: Observable<Fixture>;
   entries$: Observable<FixtureEntryDetails[]>;
   userEntries$: Observable<Entry[]>;

   hideMobleFilter = true;

   handset = false;
   mapview = false;
   loggedIn: boolean;

   constructor(
      private auth: AngularFireAuth,
      public fs: FixturesService,
      private es: EntryService,
      private breakpointObserver: BreakpointObserver,
      public dialog: MatDialog) { }

   ngOnInit() {
      this.breakpointObserver.observe(['(min-width: 500px) and (min-height: 400px)'])
         .pipe(tap(state => console.log('state: ' + state.matches.toString())))
         .subscribe(state => this.handset = !state.matches);

      this.auth.authState.subscribe((user: firebase.User) => {
         this.loggedIn = (user !== null);
      });

      this.homeLocation$ = this.fs.getHomeLocation();
      this.postcode$ = this.fs.getPostcode();
      this.fixtures$ = this.fs.getFixtures();
      this.selectedFixture$ = this.fs.getSelectedFixture$();
      this.entries$ = this.es.fixtureEntryDetails$;
      this.userEntries$ = this.es.userEntries$;

      /* Array of of entries expanded for the fixtures */
     /* this.entries$ = combineLatest([this.fixtures$, this.es.fixtureEntryDetails$]).pipe(
         map(([fixtures, entries]) =>
            fixtures.map(fix => {
               const index = entries.findIndex(details => details.fixtureId === fix.id);
               return (index === -1) ? null : entries[index];
            })),
         )
      ); */
   }

   onFixtureSelected(fixture: Fixture) {
      this.selectedFixture = fixture;
      this.fs.setSelectedFixture(fixture);
   }

   postcodeChanged(p: string) {
      this.fs.setPostcode(p);
   }

   filterChanged(f: FixtureFilter) {
      this.fs.setFilter(f);
   }

   toggleMobileFilter() {
      this.hideMobleFilter = !this.hideMobleFilter;
   }
}


