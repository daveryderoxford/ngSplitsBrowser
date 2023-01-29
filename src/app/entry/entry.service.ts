import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Fixture } from 'app/model';
import { Entry, FixtureDetailsAndEntries, FixtureEntryDetails } from 'app/model/entry';
import { forkJoin, Observable, of } from 'rxjs';
import { map, shareReplay, startWith, switchMap, take, tap } from 'rxjs/operators';
import firebase from "firebase/compat/app";

@Injectable( {
   providedIn: 'root'
} )
export class EntryService {

   fixtureEntryDetails$: Observable<FixtureEntryDetails[]>;
   userEntries$: Observable<Entry[]>;

   user: firebase.User = null;

   constructor ( private auth: AngularFireAuth,
      private afs: AngularFirestore ) {

      auth.user.subscribe( user => this.user = user );

      this.userEntries$ = auth.user.pipe(
            switchMap( ( user ) => {
               if (user ) {
                  const query = ( ref: firebase.firestore.CollectionReference ) => ref.where( 'userId', '==', user.uid );
                                           // .where( 'fixtureDate', '>', new Date().toISOString())
                                          //  .orderBy( 'fixtureDate');

                                          console.log();

                  return this.afs.collectionGroup<Entry>( "entries",
                        ref => ref.where( 'userId', '==', user.uid ).orderBy( 'fixtureDate' ) ).valueChanges();
               } else {
                  return of([]);
               }
            }),
            tap( u => console.log( 'User entries' + JSON.stringify( u ) )),
            shareReplay(1),
            startWith([])
         );

      /** All fixtures that may be entered */
      this.fixtureEntryDetails$ = this.afs.collection<FixtureEntryDetails>( "entry" ).valueChanges().pipe(
         shareReplay( 1 ),
         startWith([])
      );

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
         createdAt: new Date().toISOString(),
         latestEntry: 0,
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

   getEntries(): Observable<FixtureEntryDetails[]> {
      return this.afs.collection<FixtureEntryDetails>( "entry" ).valueChanges();
   }

   /** Gets an observable for an existing entry */
   getEntryDetails( id: string ): Observable<FixtureEntryDetails> {
      return this.afs.doc<FixtureEntryDetails>( "entry/" + id).valueChanges();
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

      const user = await this.auth.currentUser;
      entry.userId = user.uid;
      entry.madeAt = new Date().toISOString();
      entry.fixtureId = fixture.fixtureId;
      entry.fixtureDate = fixture.date;

      await this._entriesCollection(fixture.fixtureId).add( entry as Entry );

      return;
   }

   getEntry$(fixtureId: string, id): Observable<Entry> {
      return this._entriesCollection(fixtureId).doc<Entry>(id).valueChanges();
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
   getEntries$( fixtureId: string ): Observable<FixtureDetailsAndEntries> {

      const details$ = this.getEntryDetails(fixtureId).pipe(take(1));
      const entries$ = this._entriesCollection(fixtureId).valueChanges().pipe(take(1));

       return forkJoin( [details$, entries$]).pipe(
         map( ([d , e]) => {
           return { details: d, entries: e };
         })
      );
   }

   private _entriesCollection(fixtureId: string): AngularFirestoreCollection<Entry> {
      return this.afs.doc( "entry/" + fixtureId).collection<Entry>( "entries/");
   }
}
