import { inject, Injectable, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { collection, collectionData, CollectionReference, deleteDoc, doc, Firestore, getDoc, orderBy, query, setDoc, where } from '@angular/fire/firestore';
import { deleteObject, ref, Storage, uploadString } from '@angular/fire/storage';
import { AuthService } from 'app/auth/auth.service';
import { CourseSummary, eventConverter, EventGrades, EventSummary, OEvent, SplitsFileFormat } from 'app/events/model/oevent';
import { parseEventData } from 'app/results/import';
import { Results } from 'app/results/model';
import { of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SplitsbrowserException } from 'app/results/model/exception';

const EVENTS_COLLECTION = 'events';

@Injectable({
   providedIn: 'root',
})
export class EventAdminService {
   protected auth = inject(AuthService);
   protected fs = inject(Firestore);
   protected storage = inject(Storage);

   private eventsCollection = collection(this.fs, EVENTS_COLLECTION).withConverter(eventConverter);

   private events$ = toObservable(this.auth.user).pipe(
      switchMap((user) => {
         if (!user) {
            return of<OEvent[]>([]);
         } else {
            const q = this.auth.isAdmin() ?
               query(this.eventsCollection, orderBy('date', 'desc')) :
               query(this.eventsCollection, where('userId', '==', user.uid), orderBy('date', 'desc'));
            return collectionData(q);
         }
      }),
      tap((events) => console.log("EventAdminService: Events loaded", events)),
   );

   events = toSignal(this.events$, { initialValue: [] });

   async update(id: string, event: Partial<OEvent>): Promise<void> {
      const d = doc(this.fs, EVENTS_COLLECTION, id);
      await setDoc(d, event, { merge: true });
   }

   async add(event: Partial<OEvent>): Promise<OEvent> {

      const eventsCollectionRef = await collection(this.fs, EVENTS_COLLECTION);
      event.key = doc(eventsCollectionRef).id;

      event.userId = this.auth.user().uid;

      this.setIndexProperties(event);

      await setDoc(doc(this.fs, EVENTS_COLLECTION, event.key), event);

      return (event as OEvent);

   }

   async delete(event: OEvent): Promise<void> {

      const d = doc(this.fs, EVENTS_COLLECTION, event.key);
      await deleteDoc(d);

      if (event.splits) {
         await deleteObject(ref(this.storage, event.splits.splitsFilename));
      }
   }

   /** Sets index propeties on a partial even object  */
   private setIndexProperties(partialEvent: Partial<OEvent>) {
      partialEvent.yearIndex = new Date(partialEvent.date).getFullYear();
      partialEvent.gradeIndex = EventGrades.indexObject(partialEvent.grade);
   }

   async getEvent(key: string): Promise<OEvent> {
      const d = doc(this.fs, EVENTS_COLLECTION, key);
      // TODO need to add conversion
      return (await getDoc(d)).data() as OEvent;
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
         const text = await this.loadTextFile(file);

         results = this.parseSplits(text);

         event.summary = this.populateSummary(results);

         // Save file to users area on Google Clould  Storage
         const path = "results/" + this.auth.user().uid + "/" + event.key + "-results";
         await this._uploadToGoogle(text, path);

         // Update event object with stored file location
         event.splits = {
            splitsFilename: path,
            splitsFileFormat: fileFormat,
            valid: true,
            uploadDate: new Date(),
         };

      } catch (err) {
         this.logUploadWarnings(event.name, results);
         // If an error has occueed save reason in the database
         event.splits.valid = false;
         event.splits.failurereason = err.toString();
         await setDoc(doc(this.fs, "/events/" + event.key), event);
         throw err;
      }

      // save event details
      await setDoc(doc(this.fs, "/events/" + event.key), event);

      console.log("EventAdminService: Results file uploaded " + file + " to " + event.splits.splitsFilename);

      return results;

   }

   private logUploadWarnings(eventname: string, results: Results) {
      if (results.warnings && results.warnings.length > 0) {
         const msg = results.warnings.reduce((acc = '', warn) => acc + '\n' + warn);
         console.log("EventAdminComponnet: Splits uploaded with warnings\n Event key: " + eventname + '\n' + msg);
      }
   }

   /* Parse splits file returning parsed results */
   public parseSplits(text: string): Results {

      let results: Results;
      try {
         results = parseEventData(text);
      } catch (e: unknown) {
         if (e instanceof SplitsbrowserException && e.name === "InvalidData") {
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
   };

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

   /** Async function to load a file from disk returning text string containing file contents */
   async loadTextFile(file: File): Promise<string> {

      return new Promise<string>((resolve, reject) => {
         const reader = new FileReader();

         reader.onload = (event: any) => {
            const text = event.target.result;
            resolve(text);
         };

         reader.onerror = () => {
            reject(reader.error);
         };

         reader.readAsText(file);

      });
   }

}