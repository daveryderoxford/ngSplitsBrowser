import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UntilDestroy } from '@ngneat/until-destroy';
import { EntryService } from 'app/entry/entry.service';
import { Fixture } from 'app/model';
import { Entry, FixtureEntryDetails } from 'app/model/entry';
import { LatLong } from 'app/model/fixture';
import { LoginSnackbarService } from 'app/shared/services/login-snackbar.service';
import { UserDataService } from 'app/user/user-data.service';

interface StyledFixture extends Fixture {
   shaded?: boolean;
}

@UntilDestroy( { checkProperties: true } )
@Component( {
   selector: 'app-fixtures-grid',
   templateUrl: './fixtures-grid.component.html',
   styleUrls: ['./fixtures-grid.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush

} )
export class FixturesGridComponent implements OnInit, OnChanges {

   private _selectedFixture: Fixture;
   public _fixtures: StyledFixture[];

   displayData: Array<any> = [];
   itemSize: number;

   @Input() set fixtures( f: Fixture[] ) {
      this._fixtures = [...f];
      // Set Shaded property for date row styling
      let shaded = false;
      let previousFix = null;
      for ( const fix of this._fixtures ) {
         if ( previousFix && fix.date !== previousFix.date ) {
            shaded = !shaded;
         }
         fix.shaded = shaded;
         previousFix = fix;
      }
   }

   @Input() entries: FixtureEntryDetails[];
   @Input() userEntries: Entry[];

   @Input() set selectedFixture( f: Fixture ) {
      if ( f !== this._selectedFixture ) {
         this.showElement( f );
      }
      this._selectedFixture = f;
   }

   @Input() homeLocation: LatLong;
   @Input() handset: boolean;
   @Input() loggedIn: boolean;

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   @ViewChild( CdkVirtualScrollViewport ) viewPort: CdkVirtualScrollViewport;

   likedEvents: string[] = [];

   constructor ( private usd: UserDataService,
      private es: EntryService,
      private router: Router,
      private loginSnackBar: LoginSnackbarService,
      private snackBar: MatSnackBar,
      iconRegistry: MatIconRegistry,
      sanitizer: DomSanitizer ) {
      this._registerGradeIcons( iconRegistry, sanitizer );
   }

   ngOnInit() {

      this.usd.user$.subscribe( userdata => {
         if ( userdata ) {
            this.likedEvents = userdata.reminders;
         } else {
            this.likedEvents = [];
         }
      } );
   }

   ngOnChanges() {
      if ( this.handset ) {
         this.itemSize = 88;
      } else {
         this.itemSize = 38;
      }
   }

   eventClicked( row: Fixture ) {
      this._selectedFixture = row;
      this.fixtureSelected.emit( row );
   }

   selected( fixture: Fixture ): boolean {
      if ( this._selectedFixture && fixture ) {
         return this._selectedFixture.id === fixture.id;
      } else {
         return false;
      }
   }

   rowClass( fixture: StyledFixture ): string {
      if ( this.selected( fixture ) ) {
         return 'selected';
      } else {
         return fixture.shaded ? 'shaded' : '';
      }
   }

   trackBy( index, fix: Fixture ) {
      return fix.id;
   }

   /** Load icons svg for event grades */
   private _registerGradeIcons( iconRegistry: MatIconRegistry, sanitizer: DomSanitizer ) {
      iconRegistry.addSvgIcon( 'grade-local',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_local.svg' )
      );
      iconRegistry.addSvgIcon( 'grade-club',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_club.svg' )
      );
      iconRegistry.addSvgIcon( 'grade-regional',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_regional.svg' )
      );
      iconRegistry.addSvgIcon( 'grade-national',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_national.svg' )
      );
      iconRegistry.addSvgIcon( 'grade-international',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_international.svg' )
      );
      iconRegistry.addSvgIcon( 'grade-iof',
         sanitizer.bypassSecurityTrustResourceUrl( 'assets/img/event_grade/grade_iof.svg' )
      );
   }

   private showElement( fixture: Fixture ) {
      const index = this._fixtures.findIndex( f => f === fixture );

      if ( index !== -1 && this.viewPort ) {
         this.viewPort.scrollToIndex( index );
      }
   }

   isLiked( fixture: Fixture ): boolean {
      if ( !this.likedEvents ) { return false; }
      return this.likedEvents.includes( fixture.id );
   }

   // TODO temp
   isEntryAvalaible( fixture: Fixture ): boolean {
      if ( !this.entries ) { return false; }
      const index = this.entries.findIndex( entry => fixture.id === entry.fixtureId );
      return index !== -1;
   }

   async toggleReminder( fixture: Fixture ) {
      if ( !this.loggedIn ) {
         this.loginSnackBar.open( 'Must be logged in to like fixture' );
      } else {
         try {
            if ( this.isLiked( fixture ) ) {
               await this.usd.removeFixtureReminder( fixture.id );
               this.snackBar.open( 'Event Unliked', '', { duration: 2000 } );
            } else {
               await this.usd.addFixtureReminder( fixture.id );
               this.snackBar.open( 'Event Liked', '', { duration: 2000 } );
            }
         } catch ( e ) {
            this.snackBar.open( 'Error encountered liking event', '', { duration: 2000 } );
            console.log( "FixtureActions: Error liking/unliking event  " + e.message );
         }
      }
   }

   async enter( fixture: Fixture ) {
      if ( !this.loggedIn ) {
         this.loginSnackBar.open( "Must be logged in to add map reservation" );
      } else {
         this.router.navigate( ["/entry/enter", fixture.id] );
      }
   }

   /** retuns observable of css class to apply  */
   isEntered( fixture: Fixture ): boolean {
      if ( !this.userEntries ) { return false; }
      const index = this.userEntries.findIndex( entry => entry.fixtureId === fixture.id );
      return index !== -1;
   }

   async editEntry( fixture: Fixture ) {
      this.router.navigate( ["/entry/enter", fixture.id] );
   }

   async viewEntries( fixture: Fixture ) {
      this.router.navigate( ["/entry/entrylist", fixture.id] );
   }

}

