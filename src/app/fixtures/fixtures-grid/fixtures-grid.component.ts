import { ChangeDetectionStrategy, Component, EventEmitter,
   Input, OnInit, Output, QueryList, ViewChildren, ViewContainerRef, PipeTransform, Pipe } from '@angular/core';
import { Fixture } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { differenceInCalendarDays, format } from 'date-fns';

@Component( {
   selector: 'app-fixtures-grid',
   templateUrl: './fixtures-grid.component.html',
   styleUrls: [ './fixtures-grid.component.scss' ],
   changeDetection: ChangeDetectionStrategy.OnPush

} )
export class FixturesGridComponent implements OnInit {

   private _selectedFixture: Fixture;
   displayData: Array<any> = [];

   @Input() fixtures: Fixture[];

   @Input() set selectedFixture( f: Fixture ) {
      this._selectedFixture = f;
      this.showElement( f );
   }

   @Input() homeLocation: LatLong;

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
      if ( this._selectedFixture && fixture) {
         return this._selectedFixture.id === fixture.id;
      } else {
         return false;
      }
   }

   trackBy( index, fix: Fixture ) {
      return fix.id;
   }

   private showElement( fixture: Fixture ) {
      const index = this.fixtures.findIndex( f => f === fixture );

      if ( index !== -1 ) {
         const row = this.rows.toArray()[ index ];
         row.element.nativeElement.scrollIntoViewIfNeeded( true, { behavior: 'instant' } );
      }
   }

   private bingURL( fix: Fixture ): string {
      return 'https://www.bing.com/maps/?cp=' + this.latLongStr( fix.latLong, '~' ) + "&lvl=15&style=s&sp=" +
         this.latLongStr( fix.latLong, '_' ) + "_" + fix.area;
   }

   private googleURL( fix: Fixture ): string {
      return "https://www.google.com/maps/search/?api=1&query=" +
         this.latLongStr( fix.latLong ) + "&query_place_id=" + fix.area + "&zoom=10";
   }

   /** Returns URL for  directions between home location and area */
   private googleDirectionsURL( fix: Fixture ): string {
      if ( !this.homeLocation ) {
         return "";
      }

      return "https://www.google.com/maps/dir/?api=1&origin=" + this.latLongStr( this.homeLocation )
         + "&destination= " + this.latLongStr( fix.latLong );
   }

   private latLongStr( loc: LatLong, seperator = "," ): string {
      return loc.lat.toString() + seperator + loc.lng.toString();
   }
}

/** Reformat ISO date into displayed date string */
@Pipe( {
   name: 'fixturedate',
   pure: true
} )
export class FixtureDatePipe implements PipeTransform {
   transform( date: string ): string {

      // For the next week display days in the future
      const d = new Date( date );

      const daysFrom = differenceInCalendarDays( d, Date() );

      if ( daysFrom > 7 ) {
         return format( d, "ddd DD-MMM-YY" );
      } else if ( daysFrom <= 7 && daysFrom > 1 ) {
         return "Next " + format( d, "ddd Do" );
      } else if ( daysFrom === 1 ) {
         return "Tommorow ";
      } else if ( daysFrom === 0 ) {
         return "Today ";
      }
   }
}

