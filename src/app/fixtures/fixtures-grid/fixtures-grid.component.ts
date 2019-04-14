import {
   ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit,
   Output, QueryList, ViewChildren, ViewContainerRef
} from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';

@Component( {
   selector: 'app-fixtures-grid',
   templateUrl: './fixtures-grid.component.html',
   styleUrls: [ './fixtures-grid.component.scss' ],
   changeDetection: ChangeDetectionStrategy.OnPush

} )
export class FixturesGridComponent implements OnInit {

   _selectedFixture: Fixture;

   @Input() fixtures: Fixture[];

   @Input() set selectedFixture( f: Fixture ) {
      this._selectedFixture = f;
      this.showElement( f );
   }

   @Input() homeLocation: LatLong;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   @ViewChildren( 'tableRows', { read: ViewContainerRef } ) rows: QueryList<ViewContainerRef>;

   // displayedColumns = [ "date", "name", "club", "level", "distance", "location", "postcode" ];
   displayedColumns = [ "date", "name", "club", "level", "distance", "location" ];

   constructor () { }

   ngOnInit() {
   }

   eventClicked( row: Fixture ) {
      this._selectedFixture = row;
      this.fixtureSelected.emit( row );
   }

   selected( fixture: Fixture ): boolean {
      return ( this._selectedFixture === fixture );
   }

   distanceFromHome( pos: LatLong ): string {
      const kmToMiles = 0.62137119224;
      if ( !this.homeLocation ) {
         return "";
      }
      const dist = this.getDistanceFromLatLonInKm( this.homeLocation, pos );
      return Math.round( dist * kmToMiles ).toString();
   }

   bingURL( loc: LatLong ): string {
      return 'https://www.bing.com/maps/?cp=' + loc.lat.toString() + '~' + loc.lng.toString() +
         '&lvl=13&style=s&where1=' + loc.lat.toString() + ',' + loc.lng.toString();
   }

   googleURL( row: Fixture ): string {
      return "";
   }

   private getDistanceFromLatLonInKm( pos1: LatLong, pos2: LatLong ): number {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad( pos2.lat - pos1.lat );  // deg2rad below
      const dLon = this.deg2rad( pos2.lng - pos1.lng );
      const a =
         Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
         Math.cos( this.deg2rad( pos1.lat ) ) * Math.cos( this.deg2rad( pos2.lat ) ) *
         Math.sin( dLon / 2 ) * Math.sin( dLon / 2 );
      const c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) );
      const d = R * c; // Distance in km
      return d;
   }

   private deg2rad( deg: number ): number {
      return deg * ( Math.PI / 180 );
   }

   private showElement( fixture: Fixture ) {
      const index = this.fixtures.findIndex( f => f === fixture );

      if ( index !== -1 ) {
         const row = this.rows.toArray()[ index ];
         row.element.nativeElement.scrollIntoViewIfNeeded( true, { behavior: 'instant' } );
      }
   }

}

