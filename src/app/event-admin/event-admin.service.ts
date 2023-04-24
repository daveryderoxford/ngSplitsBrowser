/**
 * Event data admininstarion service
 */

import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, DocumentReference, DocumentData, SetOptions } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { CourseSummary, EventGrades, EventInfo, EventSummary, OEvent, SplitsFileFormat } from "app/model/oevent";
import { parseEventData } from "app/results/import";
import { Results } from "app/results/model/results";
import { Utils } from "app/shared";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';
import { CompetitorSearchData } from "app/model";
import { CompetitorDataService } from "../shared/services/competitor-data.service";
import firebase from "firebase/compat/app";

type PartialEvent = Partial<OEvent>;

@Injectable( {
   providedIn: 'root',
} )
export class EventAdminService {

   uid = "";

   constructor ( protected afAuth: AngularFireAuth,
      protected afs: AngularFirestore,
      protected storage: AngularFireStorage,
      protected csd: CompetitorDataService ) {
         afAuth.user.subscribe( user => {
            if (user) {
               this.uid = user.uid;
            } else {
               this.uid = "";
            }
         });
      }

   /** Get observable for event key */
   getEvent( key: string ): Observable<OEvent> {
      const eventDoc = this.afs.doc<OEvent>( '/events/' + key );
      return eventDoc.valueChanges().pipe( take( 1 ) );
   }

   /** Create new event specifying event info
    * The let
   */
   async saveNew( eventInfo: EventInfo ): Promise<string> {
      const event = <OEvent> eventInfo;

      // Ensure date is an ISO date string
      event.date = new Date( event.date ).toISOString();
      event.userId =  this.uid;
      event.key = this.afs.createId();

      this.setIndexProperties( event );

      console.log( "EventService:  Adding Event " + JSON.stringify( event ) );

      await this.afs.firestore.doc( "/events/" + event.key ).set(event);

      console.log( "EventService:  Event added" );

      return Promise.resolve( event.key );

   }

   /** Update the event info for an event */
   async updateEventInfo( key: string, eventInfo: EventInfo ): Promise<void> {

      console.log( "EventService: Updating key " + key );

      const update: PartialEvent = Object.assign( eventInfo );

      update.date = new Date( update.date ).toISOString();

      this.setIndexProperties( update );

      await this.afs.firestore.doc( "/events/" + key ).update(update);

      console.log( "EventAdminService:  Event updated " + key );
   }

   /** Sets index propeties on a partial even object  */
   public setIndexProperties( partialEvent: PartialEvent ) {
      partialEvent.yearIndex = new Date( partialEvent.date ).getFullYear();
      partialEvent.gradeIndex = EventGrades.indexObject( partialEvent.grade );
   }

   /** Delete an event.  Deleting all event data  */
   async delete( event: OEvent ): Promise<void> {

      const fs = this.afs.firestore;

      /* Delete any existing results for the event in the database in a batch.
         useing a btach to make it performant but does not */
      try {
         const batch = new LargeBatch( this.afs );
         await this.deleteEventResultsFromDB( event, fs, batch );
         await batch.commit();
      } catch ( err ) {
         console.log( '"EventAdminService: Error perfoming batch deletion ' + event.key + '\n' + err );
         throw err;
      }

      // Delete event entry
      await this.afs.firestore.doc( "/events/" + event.key ).delete();

      // Finally delete results file from Google storage
      if ( event.splits ) {
         await this.storage.ref( event.splits.splitsFilename ).delete();
      }
   }

   public async deleteEventResultsFromDB( event: OEvent, fs: firebase.firestore.Firestore, batch: LargeBatch ): Promise<void> {

      const exisitngCompetitors = await this._getExistingCompetitors( event );

      for ( const existing of exisitngCompetitors ) {
         const ref = this._resultRef( event.key, existing.key );
         await batch.delete( ref );
      }
   }

   /** Async functiom to upload results for an event to the database from a
    * text file uploaded by the user.
    *  This includes:
    * 1. Parsing and validating the results
    * 2. Saving resukts file to goodgle clould storage
    * 3. Updating the database with
    *  - results file location in google
    *  - competitor index lookup
    *  - club index lookup
   */
   async uploadResults( event: OEvent, file: File, fileFormat: SplitsFileFormat = "auto" ): Promise<Results> {

      const fs = this.afs.firestore;

      let results: Results = null;

      try {
         const text = await Utils.loadTextFile( file );

         results = this.parseSplits( text );

         event.summary = this.populateSummary( results );

         // Save file to users area on Google Clould  Storage
         const path = "results/" + this.uid + "/" + event.key + "-results";
         await this._uploadToGoogle( text, path );

         // Update event object with stored file location
         event.splits = {
            splitsFilename: path,
            splitsFileFormat: fileFormat,
            valid: true,
            uploadDate: new Date().toISOString()
         };

         /* Update competitors in Firestore database.
            Existing competitors are deleted and new ones added in a batch */
         const batch = new LargeBatch( this.afs );
         const dateAdded = new Date();
         try {
            await this.deleteEventResultsFromDB( event, fs, batch );

            // Save new results for the event in the database
            for ( const comp of results.allCompetitors ) {
               const compDBData = this.csd.createNew( event, comp, dateAdded );
               const compRef = this._resultRef( event.key, compDBData.key );

               await batch.set( compRef, compDBData );
            }
            await batch.commit();
         } catch ( err ) {
            console.log( 'EventAdminService: Error encountered writting batch ' + event.key + '\n' + err );
            throw err;
         }

      } catch ( err ) {
         // If an error has occueed save reason in the database
         event.splits.valid = false;
         event.splits.failurereason = err;
         await fs.doc( "/events/" + event.key ).set( event );
         throw err;
      }

      // save event details
      await fs.doc( "/events/" + event.key ).set( event );

      console.log( "EventAdminService: Results file uploaded " + file + " to " + event.splits.splitsFilename );

      return results;

   }

   /** Gets events created by the current user ordered by date */
   getUserEvents(): Observable<OEvent[]> {

      const query = this.afs.collection<OEvent>( "/events", ref => {
         return ref.orderBy( "date", "desc" )
            .where( "userId", "==", this.uid );
      } );

      return query.valueChanges();
   }

   /** Get a reference to search data for a given competitor */
   private _resultRef( eventkey: string, resultkey: string ): DocumentReference {
      return this.afs.doc( '/events/' + eventkey + '/results/' + resultkey ).ref;
   }

   /** Get a collection of all results for an event */
   protected async _getExistingCompetitors( event: OEvent ): Promise<CompetitorSearchData[]> {

      const promise = this.afs.collection( '/events' )
         .doc( event.key )
         .collection<CompetitorSearchData>( 'results' )
         .valueChanges().pipe( take( 1 ) ).toPromise();

      return promise;
   }


   /* Parse splits file returning parsed results */
   public parseSplits( text: string ): Results {

      let results: Results;
      try {
         results = parseEventData( text );
      } catch ( e ) {
         if ( e.name === "InvalidData" ) {
            console.log( "EventAdminService: Error parsing results" + e.message );
         } else {
            console.log( "EventAdminService: Error parsing results" + e );
         }
         throw e;
      }

      return ( results );
   }

   /** Upload text string to Google storage
    * as file is small we do not support progress monitoring,
    * Just return a promise when complete
   */
   protected async _uploadToGoogle( text: string, path: string ): Promise<any> {
      return this.storage.ref( path ).putString( text ).then();
   }

   /** Populate the event summary based on a Results object */
   public populateSummary( results: Results ): EventSummary {
      const summary: EventSummary = {
         numcompetitors: 0,
         courses: new Array()
      };

      results.courses.forEach( ( course ) => {
         const courseSummary = this.createCourseSummary( course );

         course.classes.forEach( ( eclass ) => {
            courseSummary.numcompetitors = courseSummary.numcompetitors + eclass.competitors.length;
            summary.numcompetitors = summary.numcompetitors + eclass.competitors.length;
            courseSummary.classes.push( eclass.name );
         } );
         summary.courses.push( courseSummary );
      } );

      return ( summary );
   }

   /** Creates an object summarising the results */
   public createCourseSummary( course: any ): CourseSummary {
      const summary: CourseSummary = {
         name: course.name,
         length: course.length,
         climb: course.climb,
         classes: new Array(),
         numcompetitors: 0,
      };
      return ( summary );
   }

}

/** Class to perform Firestore batchs iof more than 500 operations.
 * The batch is committed and a new batch created each 500 operations.
 * Note it does nto support collback of committed batches
*/
export class LargeBatch {
   batch: firebase.firestore.WriteBatch;
   count = 0;
   MAX_BATCH_OPERATIONS = 500;

   constructor ( protected afs: AngularFirestore ) {
      this.batch = afs.firestore.batch();
   }

   /** Add set operstion to a batch */
   async set( ref: DocumentReference, data: DocumentData, options?: SetOptions ): Promise<void> {
      await this._checkBatch();
      this.batch.set( ref, data, options );
   }

   /** Add update operation ot a batch, */
   async update( ref: DocumentReference, data: any ): Promise<void> {
      await this._checkBatch();
      this.batch.update( ref, data );
   }

   /** Add delete operation to a batch */
   async delete( ref: DocumentReference ): Promise<void> {
      await this._checkBatch();
      this.batch.delete( ref );
   }

   /** Commit a large batch.  This just commits the last partial batch at the end */
   async commit(): Promise<void> {
      await this.batch.commit();
   }

   private async _checkBatch() {
      this.count = this.count + 1;
      if ( this.count === this.MAX_BATCH_OPERATIONS ) {
         await this.batch.commit();
         this.batch = this.afs.firestore.batch();
         this.count = 0;
      }
   }
}
