import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { FixtureEntryDetails, Entry } from 'app/model/entry';
import { UserDataService } from 'app/user/user-data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Manages enteries
 *  Note that event reminders are not treated as entries */
@Injectable( {
   providedIn: 'root'
} )
export class EntryService {

   constructor (
      protected usd: UserDataService,
      protected fs: AngularFirestore ) {
   }

   async addEntryDetails( details: Partial<FixtureEntryDetails> ): Promise<FixtureEntryDetails> {
       details.userId = this.usd.currentUserData.key;

      await this.fs.doc( "entries/" + details.eventId ).set( details);
  //    return this.fs.doc<FixtureEntryDetails>( "entries/" + details.eventId ).get().pipe(
   //      map(snap => snap.data())
  //    ).toPromise();
      return Promise.resolve( <FixtureEntryDetails> details );
   }

   async updateEntryDetails( details: FixtureEntryDetails ) {
      return this.fs.doc( "entries/" + details.eventId ).update( details );
   }

   /** Reserves a map for an event */
   async enter( fixture: FixtureEntryDetails, entry: Partial<Entry> ): Promise<Entry> {
      // The following fields are set by a cloud function.
      entry.userId = this.usd.currentUserData.key;
      entry.madeAt = new Date().toISOString();
   //   entry.Id =

      await this.fs.collection( "entries/" + fixture.eventId ).add(entry);
      return Promise.resolve(<Entry>entry);
   }

   /** Update entry details */
   async updateEntry( fixture: FixtureEntryDetails, entry: Entry): Promise<void> {
      return this.fs.collection( "entries/" + fixture.eventId ).doc( entry.Id).update( entry );
   }

   /** Delete an entry */
   async deleteEntry( fixture: FixtureEntryDetails, entry: Entry ) {
      return this.fs.collection( "entries/" + fixture.eventId ).doc( entry.Id ).delete();
   }

   /** Returns observable of enteries for an event. These are stored in a single array object in child colledtion of the event
    */
   getEntries$( fixture: FixtureEntryDetails ): Observable<Entry[]> {
      return this.fs.collection<Entry>( "entries/" + fixture.eventId ).valueChanges();
   }
}
