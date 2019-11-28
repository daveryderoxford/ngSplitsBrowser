import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Entry, FixtureEntryDetails } from 'app/model/entry';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { Fixture } from 'app/model';

@Injectable( {
   providedIn: 'root'
} )
export class EntryService {

   fixtureEntryDetails$: Observable<FixtureEntryDetails[]>;
   userentries$: Observable<Entry[]>;

   user: firebase.User = null;

   constructor ( private auth: AngularFireAuth,
      private afs: AngularFirestore ) {
      auth.user.subscribe( ( u ) => {
         this.user = u;
         if ( this.user ) {
            this.userentries$ = this.afs.collectionGroup<Entry>( "entries",
               ref => ref
                  .where( 'userId', '==', this.user.uid )
                  .where ( 'date', '<', new Date().toISOString() ) ).valueChanges();
         }
      } );

      /** All fixtures that may be entered */
      this.fixtureEntryDetails$ = this.afs.collection<FixtureEntryDetails>( "entry" ).valueChanges().pipe(share());

   }

   /** Create new ebtFixtureEntryDetails object with defaults */
   createNewEntryDetails( id: string, fixture: Fixture): FixtureEntryDetails {
      const details: Partial<FixtureEntryDetails> = {
         name: "",
         date: "",
         club: "",
         fixtureId: id,
         type: 'MapReservation',
         closingDate: new Date().toISOString(),
         hasAgeClasses: false,
         courses: [],
         userId: this.user.uid,
         createdAt: new Date().toISOString()
      };
      if (fixture) {
         details.name = fixture.name;
         details.date = fixture.date;
         details.club = fixture.club;
      }
      return details as FixtureEntryDetails;
   }

   async saveNewEntryDetails( fixtureEntryDetails: FixtureEntryDetails ): Promise<void> {
      await this.afs.doc( "entry/" + fixtureEntryDetails.fixtureId ).set( fixtureEntryDetails );
   }

   /** Gets an observable for an existing entry */
   getEntryDetails( id: string ): Observable<FixtureEntryDetails> {
      const s = "entry/" + id;
      return this.afs.doc<FixtureEntryDetails>(s).valueChanges();
   }

   async updateEntryDetails(id: string, fixtureEntryDetails: Partial<FixtureEntryDetails> ): Promise<void> {
      try {
         const doc = this.afs.doc( "entry/" + id);
         await doc.update( fixtureEntryDetails );
      } catch ( err ) {
         console.log( "EntryService: Error updating map reservation" );
         throw ( err );
      }
   }

   /** Delete a map reservation -  the collection of competitorentries will be deleted by a cloud function */
   async removeEntryDetails( fixtureEntryDetails: FixtureEntryDetails ): Promise<void> {
      try {
         const doc = this.afs.doc( "entry/" + fixtureEntryDetails.fixtureId );
         await doc.delete();
      } catch ( err ) {
         console.log( "EntryService: Error deleting map reservation" );
         throw ( err );
      }
   }

   /** Enter or reserve a map for an event */
   async enter( fixture: FixtureEntryDetails, entry: Partial<Entry> ): Promise<void> {

      if ( !this.user ) {
         throw new Error( "Must be logged on to add map reservation" );
      }

      entry.userId = this.auth.auth.currentUser.uid;
      entry.madeAt = new Date().toISOString();
      entry.fixtureId = fixture.fixtureId;

      await this._entriesCollection(fixture.fixtureId).add( entry );

      return;
   }

   getEntry$(fixtureId: string, id): Observable<Entry> {
      return this._entriesCollection(fixtureId).doc<Entry>(id).valueChanges();
   }

   private _entriesCollection(fixtureId: string) {
      return this.afs.doc( "entry/" + fixtureId).collection( "entries/");
   }

   /** Update entry details */
   async updateEntry( fixtureId: string, id: string, update: Partial<Entry> ): Promise<void> {
      return this._entriesCollection(fixtureId).doc(id ).update( update );
   }

   /** Delete an entry */
   async deleteEntry( fixture: FixtureEntryDetails, entry: Entry ) {
      return this._entriesCollection(fixture.fixtureId).doc( entry.id ).delete();
   }

   /** Returns observable of entries for an event. These are stored in a single array object in child colledtion of the event
    */
   getEntries$( fixtureId: string ): Observable<{details: FixtureEntryDetails, entries: Entry[] } > {

      const details$ = this.getEntryDetails(fixtureId);
      const entries$ = this._entriesCollection(fixtureId).valueChanges();

      // TODO combine entries and details queries.
     //  return forkJoin( [details, entries ]).pipe(
     //    map( ([d , e] ) => { details:d, entries: e  });
    //  );
    return;
   }
}
