import { Component, OnInit } from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { FixtureFilter } from 'app/model/fixture-filter';
import { Observable } from 'rxjs';
import { FixturesService } from '../fixtures.service';
import { filter, map } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
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

   fixtures: Fixture[];
   fixtures1: Fixture[] = [];

   hideMobleFilter = true;

   isHandSet: boolean;

   constructor ( public fs: FixturesService,
                 breakpointObserver: BreakpointObserver,
                 public dialog: MatDialog  ) {
      this.isHandSet = breakpointObserver.isMatched( Breakpoints.Handset );
   }

   ngOnInit() {
      this.homeLocation$ = this.fs.getHomeLocation();
      this.postcode$ = this.fs.getPostcode();

      this.filteredFixtures$ = this.fs.getFixtures().pipe(
         map( fixtures => fixtures.filter (fix => !fix.hidden))
      );

      this.fs.getFixtures().subscribe( f =>  {
         this.fixtures = f;
      });
   }

   onFeatureSelected( fixture: Fixture ) {
      this.selectedFixture = fixture;
   }

   postcodeChanged( p: string ) {
      this.fs.setPostcode( p );
   }

   filterChanged(f: FixtureFilter) {
      this.fs.setFilter( f );
   }

   displayMobileActions(fixture: Fixture) {

   const dialogRef = this.dialog.open( FixtureActionPopupComponent, {
      data: fixture,
   } );
  }
}


