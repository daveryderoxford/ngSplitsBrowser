import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { FixtureEntryDetails, Entry } from 'app/model/entry';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap } from 'rxjs/operators';

@Injectable( {
   providedIn: 'root'
} )
export class EntryService {

   fixtureEntryDetails$: Observable<FixtureEntryDetails[]>;
   userEnteries$: Observable<Entry[]>;

   selectedEntryDetails$: Observable<FixtureEntryDetails>;

   private selectedEntryDetailsId$ = new BehaviorSubject<string>("-1");

   user: firebase.User = null;

   constructor ( private auth: AngularFireAuth,
      private afs: AngularFirestore ) {
      auth.user.subscribe( ( u ) => {
         this.user = u;
         this.userEnteries$ = this.afs.collectionGroup<Entry>( "/enteries" ).valueChanges();
      } );

      this.fixtureEntryDetails$ = this.afs.collection<FixtureEntryDetails>( "/enteries" ).valueChanges();

      this.selectedEntryDetails$ = this.selectedEntryDetailsId$.pipe(
         switchMap( ( id ) => this.afs.doc<FixtureEntryDetails>("/enteries/" + id.toString()).valueChanges())
      );
   }

   /** Sets the selected entry Id */
   setSelectedEntry( fixtureId: string ) {
      this.selectedEntryDetailsId$.next( fixtureId);
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

   /** Reserves a map for an event */
   async enter( fixture: FixtureEntryDetails, entry: Partial<Entry> ): Promise<Entry> {

      if ( !this.user ) {
         throw new Error( "Must be logged on to add map reservation" );
      }

      entry.userId = this.auth.auth.currentUser.uid;
      entry.madeAt = new Date().toISOString();

      await this.afs.collection( "entries/" + fixture.fixtureId ).add( entry );
      return Promise.resolve( <Entry> entry );
   }

   /** Update entry details */
   async updateEntry( fixture: FixtureEntryDetails, entry: Entry ): Promise<void> {
      return this.afs.collection( "entries/" + fixture.fixtureId ).doc( entry.id ).update( entry );
   }

   /** Delete an entry */
   async deleteEntry( fixture: FixtureEntryDetails, entry: Entry ) {
      return this.afs.collection( "entries/" + fixture.fixtureId ).doc( entry.id ).delete();
   }

   /** Returns observable of enteries for an event. These are stored in a single array object in child colledtion of the event
    */
   getEntries$( fixture: FixtureEntryDetails ): Observable<Entry[]> {
      return this.afs.collection<Entry>( "entries/" + fixture.fixtureId ).valueChanges();
   }

   /** Throws an exception  */
   private ensureLoggedOn() {

   }
}
