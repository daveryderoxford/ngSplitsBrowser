import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy } from '@angular/core';
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

   @Input() selectedFixture: Fixture;

   @Input() homeLatLong: LatLong;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

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
      if ( !this.homeLatLong ) {
         return "";
      }
      const dist = this.getDistanceFromLatLonInKm( this.homeLatLong, pos );
      return Math.round( dist ).toString();
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

}

