import { Component, OnInit } from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { Observable, BehaviorSubject } from 'rxjs';
import { FixturesService } from '../fixtures.service';
import { tap, delay } from 'rxjs/operators';

@Component( {
   selector: 'app-fixtures',
   templateUrl: './fixtures.component.html',
   styleUrls: [ './fixtures.component.scss' ]
} )

export class FixturesComponent implements OnInit {
   selectedFixture: Fixture;

   fixtures: Fixture[];
   homeLocation: Observable<LatLong>;
   postcode: Observable<string>;

   constructor ( public fs: FixturesService ) { }

   ngOnInit() {

      // TODO As a hack for grid performnce issue we initially set the first 100 elements and then add the rest
      // Once infinite scroll is avalaibe then this will not be required.
      this.fs.getFixtures().pipe(
            tap( f => this.fixtures = f.slice(0, 100)),
            delay(500),
         ).subscribe(  f => this.fixtures = f );

      this.homeLocation = this.fs.getHomeLocation();
      this.postcode = this.fs.getPostcode();
   }

   onFeatureSelected( fixture: Fixture ) {
      this.selectedFixture = fixture;
   }

   postcodeChanged( p: string ) {
      this.fs.setPostcode( p );
   }

}


