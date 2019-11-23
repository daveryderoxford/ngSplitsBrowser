import { ChangeDetectionStrategy, Component, Input, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fixture, LatLong } from 'app/model/fixture';
import { UserDataService } from 'app/user/user-data.service';
import { EntryService } from 'app/entry/entry.service';
import { LoginSnackbarService } from 'app/shared/services/login-snackbar.service';
import { Router } from '@angular/router';

@Component( {
   selector: 'app-fixture-actions',
   templateUrl: './fixture-actions.component.html',
   styleUrls: ['./fixture-actions.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
} )
export class FixtureActionsComponent implements OnInit, AfterViewInit {

   @Input() fixture: Fixture;
   @Input() handset = false;
   @Input() homeLocation: LatLong;

   loggedIn: boolean;

   @ViewChild( MatMenuTrigger, { static: true } ) menu: MatMenuTrigger;

   constructor ( private afAuth: AngularFireAuth,
      private router: Router,
      private usd: UserDataService,
      private es: EntryService,
      private snackBar: MatSnackBar,
      private loginSnackBar: LoginSnackbarService ) {

      this.afAuth.authState.subscribe( user => this.loggedIn = ( user !== null ) );
   }

   ngOnInit() {
   }

   ngAfterViewInit() {
      // dismiss menu on scroll to fix ios issue where menu scrolls incorrectly.
      window.addEventListener('scroll', () => this.menu.closeMenu(), true);
   }

   /** Open the menu from an external source */
   openMenu() {
      this.menu.openMenu();
   }

   liked(): boolean {
      const userData = this.usd.currentUserData;
      if ( userData ) {
         return userData.reminders.includes( this.fixture.id );
      } else {
         return false;
      }
   }

   async toggleReminder() {
      if ( !this.loggedIn ) {
         this.loginSnackBar.open('Must be logged in to like fixture');
      } else {
         try {
            if ( this.liked() ) {
               await this.usd.removeFixtureReminder( this.fixture.id );
               this.snackBar.open( 'Event Unliked', '', { duration: 2000 } );

            } else {
               await this.usd.addFixtureReminder( this.fixture.id );
               this.snackBar.open( 'Event Liked', '', { duration: 2000 } );
            }
         } catch ( e ) {
            this.snackBar.open( 'Error encountered liking event', '', { duration: 2000 } );
            console.log( "FixtureActions: Error liking/unliking event  " + e.message );
         }
      }
   }

   async addMapReservation(fixture: Fixture) {
      if ( !this.loggedIn ) {
         this.loginSnackBar.open( "Must be logged in to add map reservation");
      } else {
         this.router.navigate( ["/entry/mapregistration", { id: fixture.id, new: true }  ]);
      }
   }

   async reserveMap() {

   }

   async editMapReservation() {

   }

   async viewEnteries() {

   }

}
