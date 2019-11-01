import { Component, OnInit, ChangeDetectionStrategy, Input, ViewChild } from '@angular/core';
import { Fixture } from 'app/model/fixture';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserDataService } from 'app/user/user-data.service';
import { Router } from '@angular/router';
import { EntryService } from '../entry-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

@Component( {
   selector: 'app-fixture-actions',
   templateUrl: './fixture-actions.component.html',
   styleUrls: ['./fixture-actions.component.scss'],
   changeDetection: ChangeDetectionStrategy.OnPush
} )
export class FixtureActionsComponent implements OnInit {

   @Input() fixture: Fixture;
   @Input() mobile = false;

   loggedIn: boolean;

   @ViewChild( MatMenuTrigger, { static: true } ) menu: MatMenuTrigger;

   constructor ( private afAuth: AngularFireAuth,
      private usd: UserDataService,
      private es: EntryService,
      private snackBar: MatSnackBar ) {

      this.afAuth.authState.subscribe( user => this.loggedIn = ( user !== null ) );
   }

   ngOnInit() {
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
         this.snackBar.open( 'Must be logged in to like fixture', '', { duration: 2000 });
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

   async reserveMap() {

   }

   async editMapReservation() {

   }

   async viewEnteries() {

   }

}
