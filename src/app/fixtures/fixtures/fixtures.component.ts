import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { FixtureFilter } from 'app/model/fixture-filter';
import { Observable, combineLatest } from 'rxjs';
import { FixturesService } from '../fixtures.service';
import { tap, map } from 'rxjs/operators';
import { FixtureEntryDetails } from 'app/model/entry';
import { EntryService } from 'app/entry/entry.service';
import { ThrowStmt } from '@angular/compiler';
import { AngularFireAuth } from '@angular/fire/auth';

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
   filteredFixtures$: Observable<Fixture[]>;
   selectedFixture$: Observable<Fixture>;
   entries$: Observable<FixtureEntryDetails[]>;

   hideMobleFilter = true;

   handset: boolean;
   mapview = false;
   loggedIn: boolean;

   constructor(
      private auth: AngularFireAuth,
      private fs: FixturesService,
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

      /* Array of of entries expanded for the fixtures */
      this.entries$ = combineLatest(this.filteredFixtures$, this.es.fixtureEntryDetails$).pipe(
         map(([fixtures, entries]) =>
            fixtures.map(fix => entries.find(details => details.fixtureId === fix.id)))
      );
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


