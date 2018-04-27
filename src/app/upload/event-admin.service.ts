import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireStorage } from "angularfire2/storage";
import { CompetitorSearchData } from "app/model";
import { EventGrades, EventInfo, EventSummary, OEvent, SplitsFileFormat, CourseSummary } from "app/model/oevent";
import { parseEventData } from "app/results/import";
import { Competitor } from "app/results/model";
import { Results } from "app/results/model/results";
import { Observable } from "rxjs/Observable";

type PartialEvent = Partial<OEvent>;

@Injectable()
export class EventAdminService {

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }

  /** Create new event specifying event info */
  async saveNew(eventInfo: EventInfo) {
    const event = <OEvent>eventInfo;

    // Reformat the date to an ISO date.  I should not need ot do this.
    event.date = new Date(event.date).toISOString();
    event.user = this.afAuth.auth.currentUser.uid;
    event.key = this.afs.createId();

    this.setIndexProperties(event);

    console.log("EventService:  Adding Event " + JSON.stringify(event));

    await this.afs.doc<OEvent>("/events/" + event.key).set(event);

    console.log("EventService:  Event added");

  }

  /** Update the event info for an event */
  async updateEventInfo(key: string, eventInfo: EventInfo): Promise<void> {
    const event = <OEvent>eventInfo;

    console.log("EventService: Updating key " + key);

    const eventsDoc = this.afs.doc<OEvent>("/events/" + key);
    const update: PartialEvent = Object.assign(eventInfo);

    this.setIndexProperties(update);

    await eventsDoc.update(update);
    console.log("EventService:  Event updated " + key);
  }

  /** Sets index propeties on a patrial even object  */
  private setIndexProperties(partialEvent: PartialEvent) {
    partialEvent.yearIndex = new Date(partialEvent.date).getFullYear();
    partialEvent.gradeIndex = EventGrades.indexObject(partialEvent.grade);
  }


  async delete(oevent: OEvent) {
    // Delete results file
    if (oevent.splits) {
      await this.storage.ref(oevent.splits.splitsFilename).delete();
    }
    // Delete record
    return (await this.afs.doc("/events/" + oevent.key).delete());
  }

  /** Loads results from a file*/
  private async loadResults(oevent: OEvent, file: File): Promise<Results> {
    const text = await this.loadTextFile(file);
    const results = this.parseSplits(text);
    return results;
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
  async uploadResults(oevent: OEvent, file: File, fileFormat: SplitsFileFormat = "auto") {

    const text = await this.loadTextFile(file);

    const results = this.parseSplits(text);

    oevent.summary = this.populateSummary(results);

    // Save file to users area on google clould storage
    const uid = this.afAuth.auth.currentUser.uid;
    const path = "results/" + uid + "/" + oevent.key + "-results";
    await this.uploadToGoogle(text, path);

    // Update event object with stored file location
    oevent.splits = {
      splitsFilename: path,
      splitsFileFormat: fileFormat,
      valid: true
    };

    const query = this.afs.collection<OEvent>("/events", ref => {
      return ref.orderBy("date", "desc").where("user", "==", this.afAuth.auth.currentUser.uid);
    });
    // Query existing competotirs to be deleted.
    // As we must do reads before any writes in the transaction this must be done up front
    const exisitngCompetitors = await this.getExistingCompetitors(oevent);

    // Update database in a transaction
    const fs = this.afs.firestore;
    this.afs.firestore.runTransaction(async (trans) => {
      const eventRef = fs.doc("/events/" + oevent.key);
      await trans.set(eventRef, oevent);

      // Delete any existing results for the event in the database
      for (const existing of exisitngCompetitors) {
        await fs.doc("/results/" + existing.key).delete();
      }

      // Save new results for the event in the database
      for (const result1 of results.allCompetitors) {
        const searchData = this.createCompetitorSearhData(oevent, result1);

        const compRef = fs.doc("/results/" + oevent.key);
        await trans.set(eventRef, oevent);

      }

    });

    console.log("EventAdminService: Splits  uploaded " + file + "  to" + path);

  }

  private async getExistingCompetitors(oevent: OEvent): Promise<CompetitorSearchData[]> {
    const promise = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("event", "==", oevent.key);
    }).valueChanges().first().toPromise();

    return promise;
  }

  /** Async function to load a file from disk returning text string containing file contents */
  private async loadTextFile(file: File): Promise<string> {

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

  /* Parse splits file returning parsed results */
  private parseSplits(text: string): any {

    let results: Results;
    try {
      results = parseEventData(text);
    } catch (e) {
      if (e.name === "InvalidData") {
        console.log("EventAdminServicese Error parsing results" + e.message);
      } else {
        console.log("EventAdminServicese Error parsing results" + e);
      }
      throw e;
    }

    return (results);
  }

  /** Upload text string to google storage
   * as file si small we do not support progress monitoring,
   * Just return a promise when complete
  */
  private async uploadToGoogle(text: string, path: string): Promise<any> {
    return this.storage.ref(path).putString(text).then();
  }

  public populateSummary(results: any): EventSummary {
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
  private createCourseSummary(course: any): CourseSummary {
    const summary: CourseSummary = {
      name: course.name,
      length: course.length,
      climb: course.climb,
      classes: new Array(),
      numcompetitors: 0,
    };
    return (summary);
  }

  /** Gets events owned by the user */
  getUserEvents(): Observable<OEvent[]> {

    const query = this.afs.collection<OEvent>("/events", ref => {
      return ref.orderBy("date", "desc").where("user", "==", this.afAuth.auth.currentUser.uid);
    });

    return query.valueChanges();

  }

  /** Save the competitor search recored */
  private createCompetitorSearhData(oevent: OEvent, comp: Competitor): CompetitorSearchData {
    return {
      key: oevent.key + '-' + comp.ecard,
      eventKey: oevent.key,
      ecard: comp.ecard,
      first: comp.firstname,
      surname: comp.surname,
      club: comp.club,
    };
  }


  /** Search for result where name matches */
  searchResultsByName(firstname: string, surname: string, club: string): Array<CompetitorSearchData> {
    return [];
  }


  /** Search for results where any ecard matches */
  searchResultsByECard(ecards: Array<string>): Array<CompetitorSearchData> {
    // Event ecard not defined or
    return [];
  }
}
