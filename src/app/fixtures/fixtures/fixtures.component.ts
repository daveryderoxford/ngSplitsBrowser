import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { FixtureFilter } from 'app/model/fixture-filter';
import { Observable } from 'rxjs';
import { FixturesService } from '../fixtures.service';

@Component( {
   selector: 'app-fixtures',
   templateUrl: './fixtures.component.html',
   styleUrls: [ './fixtures.component.scss' ]
} )

export class FixturesComponent implements OnInit {
   selectedFixture: Fixture;

   homeLocation$: Observable<LatLong>;
   postcode$: Observable<string>;
   fixtures$: Observable<Fixture[]>;
   filteredFixtures$: Observable<Fixture[]>;
   selectedFixture$: Observable<Fixture>;

   hideMobleFilter = true;

   handset: boolean;
   mapview = false;

   constructor ( public fs: FixturesService,
      private breakpointObserver: BreakpointObserver,
      public dialog: MatDialog ) {}

   ngOnInit() {
      this.handset = this.breakpointObserver.isMatched( Breakpoints.Handset );
      this.homeLocation$ = this.fs.getHomeLocation();
      this.postcode$ = this.fs.getPostcode();
      this.fixtures$ = this.fs.getFixtures();
      this.selectedFixture$ = this.fs.getSelectedFixture$();
   }

   onFixtureSelected( fixture: Fixture ) {
      this.selectedFixture = fixture;
      this.fs.setSelectedFixture( fixture);
   }

   postcodeChanged( p: string ) {
      this.fs.setPostcode( p );
   }

   filterChanged( f: FixtureFilter ) {
      this.fs.setFilter( f );
   }

   toggleMobileFilter() {
      this.hideMobleFilter = !this.hideMobleFilter;
   }
}


