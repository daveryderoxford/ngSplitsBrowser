import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { FixtureFilter } from 'app/model/fixture-filter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FixturesService } from '../fixtures.service';
import { FixtureActionPopupComponent } from './fixture-action-popup.component';

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


   hideMobleFilter = true;

   isHandSet: boolean;

   constructor ( public fs: FixturesService,
      breakpointObserver: BreakpointObserver,
      public dialog: MatDialog ) {
      this.isHandSet = breakpointObserver.isMatched( Breakpoints.Handset );
      this.homeLocation$ = this.fs.getHomeLocation();
      this.postcode$ = this.fs.getPostcode();
      this.fixtures$ = this.fs.getFixtures();
   }

   ngOnInit() {
   }

   onFeatureSelected( fixture: Fixture ) {
      this.selectedFixture = fixture;
   }

   postcodeChanged( p: string ) {
      this.fs.setPostcode( p );
   }

   filterChanged( f: FixtureFilter ) {
      this.fs.setFilter( f );
   }

   displayMobileActions( fixture: Fixture ) {

      this.dialog.open( FixtureActionPopupComponent, {
         data: fixture,
      } );
   }
}


