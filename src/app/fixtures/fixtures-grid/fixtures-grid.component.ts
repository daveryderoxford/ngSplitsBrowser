import {
   ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit,
   Output, QueryList, ViewChildren, ViewContainerRef
} from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { format, differenceInCalendarDays, isSaturday, isSunday, isWeekend, differenceInMonths } from 'date-fns';
import { FixtureFilter } from '../fixtures-options/fixtures-options.component';


@Component( {
   selector: 'app-fixtures-grid',
   templateUrl: './fixtures-grid.component.html',
   styleUrls: [ './fixtures-grid.component.scss' ],
   changeDetection: ChangeDetectionStrategy.OnPush

} )
export class FixturesGridComponent implements OnInit {

   private _selectedFixture: Fixture;

   fixtures1 = [];

   @Input() fixtures: Fixture[];

   @Input() set selectedFixture( f: Fixture ) {
      this._selectedFixture = f;
      this.showElement( f );
   }

   @Input() homeLocation: LatLong;

   @Input() flilter: FixtureFilter;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   @ViewChildren( 'tableRows', { read: ViewContainerRef } ) rows: QueryList<ViewContainerRef>;

   displayedColumns = [ "date", "distance", "name", "club", "level", "area", "location", "directions" ];

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

   trackBy( index, fix: Fixture ) {
      return fix ? fix.id : undefined;
   }

   flilterFixture( fix: Fixture ): boolean {
      const fiilter = this.flilter;
      
         const fixdate = new Date( fix.date );

         const timeOK = ( isSaturday( fixdate ) && fiilter.time.sat === true ) ||
            ( isSunday( fixdate ) && fiilter.time.sun === true ) ||
            ( !isWeekend( fixdate ) && fiilter.time.weekday === true );

         let gradeOK: boolean;
         if ( fiilter.gradesEnabled ) {
            const f = fiilter.grades.find( ( g ) => fix.grade === g.name );
            gradeOK = f.enabled &&
               ( differenceInMonths( new Date(), fixdate ) <= f.time );
            // fix.distance < f.distance &&
         } else {
            gradeOK = true;
         }

         return timeOK && gradeOK;

   }


   /** Reformat ISO date into displayed date string */
   dateString( date: string ) {
      // For the next week display days in the future
      const d = new Date( date );

      const daysFrom = differenceInCalendarDays( d, Date() );

      if ( daysFrom > 7 ) {
         return format( d, "ddd DD-MMM-YY");
      } else if ( daysFrom <= 7 && daysFrom > 1 ) {
         return "Next " + format( d, "ddd Do" );
      } else if ( daysFrom === 1 ) {
         return "Tommorow ";
      } else if ( daysFrom === 0 ) {
         return "Today ";
      }

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
      return 'https://www.bing.com/maps/?cp=' + this.latLongStr( fix.latLong, '~' ) + "&lvl=15&style=s&sp=" +
         this.latLongStr( fix.latLong, '_' ) + "_" + fix.area;
   }

   googleURL( fix: Fixture ): string {
      return "https://www.google.com/maps/search/?api=1&query=" +
            this.latLongStr( fix.latLong ) + "&query_place_id=" + fix.area + "&zoom=10";
   }

   /** Returns URL for  directions between home location and area */
   googleDirectionsURL( fix: Fixture ): string {
      if (!this.homeLocation ) {
         return "";
      }

      return "https://www.google.com/maps/dir/?api=1&origin=" + this.latLongStr( this.homeLocation )
         + "&destination= " + this.latLongStr( fix.latLong );
   }

   private latLongStr( loc: LatLong, seperator = "," ): string {
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

