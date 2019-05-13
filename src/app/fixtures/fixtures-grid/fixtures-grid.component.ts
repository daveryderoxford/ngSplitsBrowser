import { ChangeDetectionStrategy, Component, EventEmitter,
   Input, OnInit, Output, QueryList, ViewChildren, ViewContainerRef, PipeTransform, Pipe, NgModule } from '@angular/core';
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
}


