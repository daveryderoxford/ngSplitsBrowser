import { ChangeDetectionStrategy, Component, EventEmitter,
   Input, OnInit, Output, QueryList, ViewChildren, ViewContainerRef, PipeTransform, Pipe, NgModule, ViewChild } from '@angular/core';
import { Fixture, UserData } from 'app/model';
import { LatLong } from 'app/model/fixture';
import { differenceInCalendarDays, format } from 'date-fns';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { UserDataService } from 'app/user/user-data.service';
import { Observable } from 'rxjs';

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
      if ( f !== this._selectedFixture ) {
         this.showElement( f );
      }
      this._selectedFixture = f;
   }

   @Input() homeLocation: LatLong;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   @ViewChild( CdkVirtualScrollViewport, { static: false} ) viewPort: CdkVirtualScrollViewport;

   likedEvents: string[] = [];

   constructor (private usd: UserDataService) { }

   ngOnInit() {
      this.usd.userData().subscribe( userdata => {
         if (userdata) {
         this.likedEvents = userdata.reminders;
        }
      } );
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
         this.viewPort.scrollToIndex( index );
      }
   }

   isLiked( eventId: string): boolean {
      if ( !this.likedEvents ) { return false; }
      return this.likedEvents.includes( eventId );
   }
}
