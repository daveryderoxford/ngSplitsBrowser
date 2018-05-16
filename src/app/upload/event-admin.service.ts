import { Injectable } from "@angular/core";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireStorage } from "angularfire2/storage";
import { Club, CompetitorSearchData } from "app/model";
import { CourseSummary, EventGrades, EventInfo, EventSummary, OEvent, SplitsFileFormat } from "app/model/oevent";
import { ECard } from "app/model/user";
import { parseEventData } from "app/results/import";
import { Competitor } from "app/results/model";
import { Results } from "app/results/model/results";
import { Utils } from "app/utils/utils";
import { firestore } from "firebase";
import { Observable } from "rxjs/Observable";

type PartialEvent = Partial<OEvent>;

@Injectable()
export class EventAdminService {

  private clubManger: ClubListManager;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) {
    this.clubManger = new ClubListManager(afs);
  }

  /** Get observable for event key */
  getEvent(key: string): Observable<OEvent> {
    return this.afs.doc<OEvent>('/events/' + key).valueChanges();
  }

  /** Create new event specifying event info */
  async saveNew(eventInfo: EventInfo): Promise<string> {
    const event = <OEvent>eventInfo;

    // Reformat the date to an ISO date.  I should not need to do this.
    event.date = new Date(event.date).toISOString();
    event.user = this.afAuth.auth.currentUser.uid;
    event.key = this.afs.createId();
    this.setIndexProperties(event);

    console.log("EventService:  Adding Event " + JSON.stringify(event));

    // Update club list and event in a transaction
    this.afs.firestore.runTransaction(async (trans) => {
      await this.clubManger.eventAdded(event, trans);
      const ref = this.afs.firestore.doc("/events/" + event.key);
      trans.set(ref, event);
    });

    console.log("EventService:  Event added");

    return Promise.resolve(event.key);

  }

  /** Update the event info for an event */
  async updateEventInfo(key: string, eventInfo: EventInfo): Promise<void> {

    console.log("EventService: Updating key " + key);

    const eventsDoc = this.afs.doc<OEvent>("/events/" + key);
    const update: PartialEvent = Object.assign(eventInfo);

    this.setIndexProperties(update);

    // Update club list and event in a transaction
    this.afs.firestore.runTransaction(async (trans) => {
      await this.clubManger.eventChanged(key, eventInfo, trans);
      const ref = this.afs.firestore.doc("/events/" + key);
      trans.update(ref, update);
    });

    console.log("EventService:  Event updated " + key);
  }

  /** Sets index propeties on a partial even object  */
  private setIndexProperties(partialEvent: PartialEvent) {
    partialEvent.yearIndex = new Date(partialEvent.date).getFullYear();
    partialEvent.gradeIndex = EventGrades.indexObject(partialEvent.grade);
  }

  /** Delete an event.  Deleting all event data  */
  async delete(event: OEvent): Promise<void> {

    const fs = this.afs.firestore;

    /* Delete any existing results for the event in the database in a batch.
       useing a btach to make it performant but does not */
    try {
      const batch = new LargeBatch(this.afs);
      await this.deleteEventResultsFromDB(event, fs, batch);
      await batch.commit();
    } catch (err) {
      console.log('Error perfoming batch deletion');
      throw err;
    }

    // Deete event and update club reference in a transaction
    fs.runTransaction(async (trans) => {
      await this.clubManger.eventDeleted(event, trans);
      const eventRef = this.afs.firestore.doc("/events/" + event.key);
      await trans.delete(eventRef);
    });

    // Finally delete results file from Google storage
    if (event.splits) {
      await this.storage.ref(event.splits.splitsFilename).delete();
    }
  }

  private async deleteEventResultsFromDB(event: OEvent, fs: firestore.Firestore, batch: LargeBatch) {

    const exisitngCompetitors = await this.getExistingCompetitors(event);

    for (const existing of exisitngCompetitors) {
      const ref = fs.doc("/results/" + existing.key);
      await batch.delete(ref);
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
  async uploadResults(event: OEvent, file: File, fileFormat: SplitsFileFormat = "auto") {

    const text = await this.loadTextFile(file);

    const results = this.parseSplits(text);

    event.summary = this.populateSummary(results);

    // Save file to users area on Google Clould  Storage
    const uid = this.afAuth.auth.currentUser.uid;
    const path = "results/" + uid + "/" + event.key + "-results";
    await this.uploadToGoogle(text, path);

    // Update event object with stored file location
    event.splits = {
      splitsFilename: path,
      splitsFileFormat: fileFormat,
      valid: true
    };

    const query = this.afs.collection<OEvent>("/events", ref => {
      return ref.orderBy("date", "desc")
        .where("user", "==", this.afAuth.auth.currentUser.uid);
    });

    const fs = this.afs.firestore;

    /* Update competitors in Firestore database.
       Existing competitors are elteted and new ones  added in a batch */
    const batch = new LargeBatch(this.afs);
    try {
      await this.deleteEventResultsFromDB(event, fs, batch);

      // Save new results for the event in the database
      for (const comp of results.allCompetitors) {
        const compDBData = this.createCompetitorSearchData(event, comp);
        const compRef = fs.doc("/results/" + compDBData.key);
        await batch.set(compRef, compDBData);
      }
      await batch.commit();
    } catch (err) {
      console.log('Error updating ');
      throw err;
    }

    // seve event details
    await fs.doc("/events/" + event.key).set(event);

    console.log("EventAdminService: Results file uploaded " + file + "  to" + path);

  }

  /** Gets events owned by the user */
  getUserEvents(): Observable<OEvent[]> {

    const query = this.afs.collection<OEvent>("/events", ref => {
      return ref.orderBy("date", "desc")
        .where("user", "==", this.afAuth.auth.currentUser.uid);
    });

    return query.valueChanges();
  }

  private async getExistingCompetitors(event: OEvent): Promise<CompetitorSearchData[]> {
    const promise = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("eventKey", "==", event.key);
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

  /** Upload text string to Google storage
   * as file is small we do not support progress monitoring,
   * Just return a promise when complete
  */
  private async uploadToGoogle(text: string, path: string): Promise<any> {
    return this.storage.ref(path).putString(text).then();
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

  /** Save the competitor search recored */
  private createCompetitorSearchData(event: OEvent, comp: Competitor): CompetitorSearchData {
    return {
      key: event.key + '-' + comp.key,
      eventKey: event.key,
      ecardId: comp.ecardId,
      first: comp.firstname,
      surname: comp.surname,
      club: comp.club,
    };
  }

  /** Search for result where name matches
   *  matches if surname + club match or surname + firstname match
  */
  searchResultsByName(firstname: string, surname: string, club: string): Observable<CompetitorSearchData[]> {
    const query1 = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", club);
    }).valueChanges();

    const query2 = this.afs.collection<CompetitorSearchData>("/results", ref => {
      return ref.where("surname", "==", surname)
        .where("club", "==", firstname);
    }).valueChanges();

    // Merge results of the two queries and remove duplicates
    const merged = Observable.merge(query1, query2).map(results => {
      return Utils.removeDuplicates(results);
    });

    return merged;
  }

  /** Search for results where any ecard matches */
  searchResultsByECard(ecards: Array<ECard>): Observable<CompetitorSearchData[]> {
    // Search each of the users ecard numbers defined in ecard object
    const queryresults: Array<Observable<CompetitorSearchData[]>> = [];

    for (const card of ecards) {
      const query = this.afs.collection<CompetitorSearchData>("/results", ref => {
        return ref.where("ecard", "==", card.id)
          .orderBy('date', 'desc');
      }).valueChanges();

      queryresults.push(query);
    }

    const merged = Observable.merge(queryresults[0]).map(results => {
      return Utils.removeDuplicates(results);
    });
    return merged;
  }
}

class ClubListManager {

  constructor(private afs: AngularFirestore) { }

  /** Call in transaction before an event is deleetd to decerment its reference count  */
  public async eventDeleted(event: OEvent, trans: firestore.Transaction): Promise<void> {
    const club = await this.readClub(event, trans);
    return await this.removeClubReference(event, club, trans);
  }

  /** Call in transaction when an event is changed to manage club list  */
  public async eventChanged(key: string, written: EventInfo,
    trans: firestore.Transaction) {

    const previous = await this.readEvent(key);

    if ((written.club !== previous.club) ||
      (written.nationality !== previous.nationality)) {

      // In transaction, Reads must be before any writes
      const writtenClub = await this.readClub(written, trans);
      const previousClub = await this.readClub(previous, trans);
      await this.removeClubReference(previous, previousClub, trans);
      await this.addClubReference(written, writtenClub, trans);
    }
  }

  /** Call in transaction before an event is added to craete club s required and increamrnt its reference count */
  public async eventAdded(event: OEvent, trans) {
    const club = await this.readClub(event, trans);
    await this.addClubReference(event, club, trans);
  }

  /** Get key string for a club comprised to nationality code and club name concaternated. */
  private getClubKey(event: EventInfo) {
    const key = event.nationality + '-' + event.club;
    return Utils.encodeAsKey(key);
  }

  /** Read club object in a transaction */
  private async readClub(event: EventInfo, trans: firestore.Transaction): Promise<Club | undefined> {
    const ref = this.afs.firestore.doc('/clubs/' + this.getClubKey(event));
    const snapahot = await trans.get(ref);
    if (snapahot.exists) {
      return snapahot.data() as Club;
    } else {
      return undefined;
    }
  }

  /** Read event object - Not part of the transaction  */
  private async readEvent(key: string): Promise<OEvent | undefined> {
    return this.afs.doc<OEvent>('/events/' + key).valueChanges().first().toPromise();
  }

  /** Add a reference to a club in a transaction, creating club if required */
  private async addClubReference(eventInfo: EventInfo,
    club: Club,
    trans: firestore.Transaction): Promise<void> {

    if (!club) {
      club = {
        key: this.getClubKey(eventInfo),
        name: eventInfo.club,
        nationality: eventInfo.nationality,
        numEvents: 0,
        lastEvent: eventInfo.date,
      };
      console.log("Creating new club " + club.name + "  " + club.nationality);
    }

    club.numEvents = club.numEvents + 1;
    club.lastEvent = eventInfo.date;


    const clubRef = this.afs.firestore.doc('/clubs/' + club.key);
    trans.set(clubRef, club);

    console.log("Added club reference " + club.name + "  " + club.nationality + " Num events " + club.numEvents);
  }

  /** Remove a club reference in a transaction deleting the club if required */
  private async  removeClubReference(event, club: Club, trans: firestore.Transaction): Promise<void> {

    if (!club) {
      console.log("ERROR Removing reference to a club not found  Name:" + event.club);
      return;
    }

    const clubRef = this.afs.firestore.doc('/clubs/' + club.key);

    club.numEvents = club.numEvents - 1;
    if (club.numEvents < 1) {
      trans.delete(clubRef);
    } else {
      trans.set(clubRef, club);
    }

    console.log("Removed club reference " + club.name + "  " + club.nationality + " Num events" + club.numEvents);
  }
}

/** Class to perform Firestore batchs iof more than 500 operations.
 * The batch is committed and a new batch created each 500 operations.
 * Note it does nto support collback of committed batches
*/
class LargeBatch {
  batch: firestore.WriteBatch;
  count = 0;
  MAX_BATCH_OPERATIONS = 500;

  constructor(private afs: AngularFirestore) {
    this.batch = afs.firestore.batch();
  }

  /** Add set operstion to a batch */
  async set(ref: firestore.DocumentReference, data: firestore.DocumentData, options?: firestore.SetOptions): Promise<void> {
    await this.checkBatch();
    this.batch.set(ref, data, options);
  }

  /** Add update operation ot a batch, */
  async update(ref: firestore.DocumentReference, data: any): Promise<void> {
    await this.checkBatch();
    this.batch.update(ref, data);
  }

  /** Add delete operation to a batch */
  async delete(ref: firestore.DocumentReference): Promise<void> {
    await this.checkBatch();
    this.batch.delete(ref);
  }

  /** commit a lrage batch */
  async commit(): Promise<void> {
    await this.batch.commit();
  }

  private async checkBatch() {
    this.count = this.count + 1;
    if (this.count === this.MAX_BATCH_OPERATIONS) {
      await this.batch.commit();
      this.batch = this.afs.firestore.batch();
      this.count = 0;
    }
  }
}
