import { Component, OnInit } from '@angular/core';
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

   fixtures: Fixture[];
   fixtures1: Fixture[] = [];


   constructor ( public fs: FixturesService ) { }

   ngOnInit() {
      this.homeLocation$ = this.fs.getHomeLocation();
      this.postcode$ = this.fs.getPostcode();

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

   filterChanged(filter: FixtureFilter) {
      this.fs.setFilter( filter);
   }
}


