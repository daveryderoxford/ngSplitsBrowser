/**
 * Event data admininstarion service
 */
import { Injectable, inject } from "@angular/core";
import { Auth, authState } from '@angular/fire/auth';
import { collection, deleteDoc, doc, docData, DocumentReference, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { deleteObject, ref, Storage, uploadString } from '@angular/fire/storage';
import { CourseSummary, EventGrades, EventInfo, EventSummary, OEvent, SplitsFileFormat } from "app/events/model/oevent";
import { parseEventData } from "app/results/import";
import { Results } from "app/results/model/results";
import { Utils } from "app/shared";
import { Observable } from "rxjs";
import { take } from 'rxjs/operators';

type PartialEvent = Partial<OEvent>;

@Injectable({
   providedIn: 'root',
})
export class EventAdminService {
      protected auth = inject(Auth);
      protected firestore = inject(Firestore);
      protected storage = inject(Storage);
   uid = "";

   constructor() {

      authState(this.auth).subscribe(user => {
         if (user) {
            this.uid = user.uid;
         } else {
            this.uid = "";
         }
      });
   }

   /** Get observable for event key */
   getEvent(key: string): Observable<OEvent> {
      const eventDoc = doc(this.firestore, '/events/' + key) as DocumentReference<OEvent>;
      return docData(eventDoc).pipe(take(1));
   }

   /** Create new event specifying event info
    * The let
   */
   async saveNew(eventInfo: EventInfo): Promise<string> {
      const event = <OEvent>eventInfo;

      const eventsCollectionRef = await collection(this.firestore, 'events');

      // Ensure date is an ISO date string
      event.date = new Date(event.date).toISOString();
      event.userId = this.uid;
      event.key = doc(eventsCollectionRef).id // Generated new Id. 

      this.setIndexProperties(event);

      console.log("EventService:  Adding Event " + JSON.stringify(event));

      await setDoc(doc(this.firestore, "/events/" + event.key), event);

      console.log("EventService:  Event added");

      return Promise.resolve(event.key);

   }

   /** Update the event info for an event */
   async updateEventInfo(key: string, eventInfo: EventInfo): Promise<void> {

      console.log("EventService: Updating key " + key);

      const update: Partial<OEvent> = Object.assign(eventInfo);

      update.date = new Date(update.date).toISOString();

      this.setIndexProperties(update);

      await updateDoc(doc(this.firestore, "/events/" + key), update);

      console.log("EventAdminService:  Event updated " + key);
   }

   /** Sets index propeties on a partial even object  */
   public setIndexProperties(partialEvent: PartialEvent) {
      partialEvent.yearIndex = new Date(partialEvent.date).getFullYear();
      partialEvent.gradeIndex = EventGrades.indexObject(partialEvent.grade);
   }

   /** Delete an event.  Deleting all event data  */
   async delete(event: OEvent): Promise<void> {

      // Delete event entry
      await deleteDoc(doc(this.firestore, "/events/" + event.key));

      if (event.splits) {
         await deleteObject(ref(this.storage, event.splits.splitsFilename));
      }
   }

   /** Async functiom to upload results for an event to the database from a
    * text file uploaded by the user.
    *  This includes:
    * 1. Parsing and validating the results
    * 2. Saving resukts file to goodgle clould storage
    * 3. Updating the database with
    *  - results file location in google
    *  - club index lookup
   */
   async uploadResults(event: OEvent, file: File, fileFormat: SplitsFileFormat = "auto"): Promise<Results> {

      let results: Results = null;

      try {
         const text = await Utils.loadTextFile(file);

         results = this.parseSplits(text);

         event.summary = this.populateSummary(results);

         // Save file to users area on Google Clould  Storage
         const path = "results/" + this.uid + "/" + event.key + "-results";
         await this._uploadToGoogle(text, path);

         // Update event object with stored file location
         event.splits = {
            splitsFilename: path,
            splitsFileFormat: fileFormat,
            valid: true,
            uploadDate: new Date().toISOString()
         };

      } catch (err) {
         // If an error has occueed save reason in the database
         event.splits.valid = false;
         event.splits.failurereason = err;
         await setDoc(doc(this.firestore, "/events/" + event.key), event);
         throw err;
      }

      // save event details
      await setDoc(doc(this.firestore, "/events/" + event.key), event);

      console.log("EventAdminService: Results file uploaded " + file + " to " + event.splits.splitsFilename);

      return results;

   }

   /* Parse splits file returning parsed results */
   public parseSplits(text: string): Results {

      let results: Results;
      try {
         results = parseEventData(text);
      } catch (e) {
         if (e.name === "InvalidData") {
            console.log("EventAdminService: Error parsing results" + e.message);
         } else {
            console.log("EventAdminService: Error parsing results" + e);
         }
         throw e;
      }

      return (results);
   }

   /** Upload text string to Google storage
    * as file is small we do not support progress monitoring,
    * Just return a promise when complete
   */
   protected async _uploadToGoogle(text: string, path: string): Promise<any> {
      const storageRef = ref(this.storage, path);
      return await uploadString(storageRef, text);
   }

   /** Populate the event summary based on a Results object */
   public populateSummary(results: Results): EventSummary {
      const summary: EventSummary = {
         numcompetitors: 0,
         courses: new Array()
      };

      results.courses.forEach((course) => {
         const courseSummary = this.createCourseSummary(course);

         course.classes.forEach((eclass) => {
            courseSummary.numcompetitors = courseSummary.numcompetitors + eclass.competitors.length;
            summary.numcompetitors = summary.numcompetitors + eclass.competitors.length;
            courseSummary.classes.push(eclass.name);
         });
         summary.courses.push(courseSummary);
      });

      return (summary);
   }

   /** Creates an object summarising the results */
   public createCourseSummary(course: any): CourseSummary {
      const summary: CourseSummary = {
         name: course.name,
         length: course.length,
         climb: course.climb,
         classes: new Array(),
         numcompetitors: 0,
      };
      return (summary);
   }
}