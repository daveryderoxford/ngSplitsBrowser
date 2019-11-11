import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FixtureEntryDetails, Entry } from 'app/model/entry';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable( {
   providedIn: 'root'
} )
export class EntryService {

   fixtureEntryDetails$: Observable<FixtureEntryDetails[]>;
   userEnteries$: Observable<Entry[]>;

   user: firebase.User = null;

   constructor ( private auth: AngularFireAuth,
      private afs: AngularFirestore ) {
      auth.user.subscribe( ( u ) => {
         this.user = u;
         this.userEnteries$ = this.afs.collectionGroup<Entry>( "/enteries" ).valueChanges();
      } );

      this.fixtureEntryDetails$ = this.afs.collection<FixtureEntryDetails>( "/enteries" ).valueChanges();
   }

   async addEntryDetails( fixtureEntryDetails: Partial<FixtureEntryDetails> ): Promise<void> {
      if ( !this.user ) {
         throw new Error( "Must be logged on to add map reservation" );
      }

      fixtureEntryDetails.userId = this.user.uid;

      await this.afs.doc( "/enteries/" + fixtureEntryDetails.fixtureId ).set( fixtureEntryDetails );
   }

   async updateEntryDetails( fixtureEntryDetails: FixtureEntryDetails ): Promise<void> {
      if ( this.user.uid !== fixtureEntryDetails.userId ) {
         throw new Error( "Must be owner of fixture to update it " );
      }

      try {
         const doc = this.afs.doc( "/enteries/" + fixtureEntryDetails.fixtureId );
         await doc.update( fixtureEntryDetails );
      } catch ( err ) {
         console.log( "EntryService: Error updating map reservation" );
         throw ( err );
      }
   }

   /** Delete a map reservation -  the collection of competitorEnteries will be deleted by a cloud function */
   async removeEntryDetails( fixtureEntryDetails: FixtureEntryDetails ) {
      if ( this.user.uid !== fixtureEntryDetails.userId ) {
         throw new Error( "Must be owner of map reservation to remove it " );
      }

      try {
         const doc = this.afs.doc( "/enteries/" + fixtureEntryDetails.fixtureId );
         await doc.delete();
      } catch ( err ) {
         console.log( "EntryService: Error deleting map reservation" );
         throw ( err );
      }
   }

   async enter() {
      if ( !this.user ) {
         throw new Error( "Must be logged on to add map reservation" );
      }

   }


   deleteMapReservation() {
      // Verify user is owner
      if ( !this.auth.user ) {

      }


   }


   /** Throws an exception  */
   private ensureLoggedOn() {

   }
}
