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

   /** Reformat ISO date into displayed date string */
   dateString( date: string ) {
      // For the next week display days in the future

   }

   distanceFromHome( fix: Fixture ): string {
      const kmToMiles = 0.62137119224;
      if ( !this.homeLocation || !fix.latLong ) {
         return "";
      }
      const dist = this.getDistanceFromLatLonInKm( this.homeLocation, fix.latLong );
      return Math.round( dist * kmToMiles ).toString();
   }

   bingURL( fix: Fixture ): string {
      if ( !fix.latLong || !fix.latLong.lat ) {
         return "";
      }
      return 'https://www.bing.com/maps/?cp=' + this.latLongStr( fix.latLong, '~' ) + "&lvl=15&style=s&sp=" +
                           this.latLongStr( fix.latLong, '_' ) + "_" + fix.area;
   }

   googleURL( fix: Fixture ): string {
      return "https://www.google.com/maps/search/?api=1&query=" + this.latLongStr( fix.latLong ) + "&query_place_id=" + fix.area;
   }

   /** Returns URL for  directions between home location and area */
   googleDirectonsURL(fix: Fixture ): string {
      if ( !this.homeLocation || !fix.latLong ) {
         return "";
      }
      return "https://www.google.com/maps/dir/?api=1&origin=" + this.latLongStr( this.homeLocation)
                + "&destination= " + this.latLongStr(fix.latLong);
   }

   private latLongStr(loc: LatLong, seperator = ","): string {
      return loc.lat.toString() + seperator + loc.lng.toString();
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

