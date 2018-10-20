
/** Node script to import JSON
 * ts-node bulk-inoirt.node
*/
import { HttpClient } from "@angular/common/http";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";
import { EventAdminService, LargeBatch } from "app/event-admin/event-admin.service";
import { EventGrades, OEvent, SplitsFileFormat, EventGrade } from "app/model";
import * as data from "./importdata.node";
import { ImportData } from "./importdata.node";
import { Injectable } from "@angular/core";
import { Results } from "app/results/model";
import {CompetitorDataService } from "app/shared/services/competitor-data.service";

/* Service to import exisitng results */
@Injectable({
  providedIn: 'root',
})
export class BulkImportService {

  startId = 1;
  endId = 200;

  constructor(protected es: EventAdminService,
    protected cs: CompetitorDataService,
    protected afs: AngularFirestore,
    protected storage: AngularFireStorage,
    private http: HttpClient) {
  }

  cleanEvents() {

    const events = data.inputJSON;

    for (const inputEvent of events) {
      // remove . from club names
      inputEvent.club = inputEvent.club.replace(new RegExp('\\.', 'g'), '');

      // make club names all uppercase
      inputEvent.club = inputEvent.club.toUpperCase();

    }

    // remove duplicate events
    for (let i = events.length - 2; i >= 0; i--) {
      if ((events[i].name === events[i + 1].name) &&
        (events[i].eventdate === events[i + 1].eventdate) &&
        (events[i].club === events[i + 1].club)) {
        console.log('Removing duplicate event ' + events[i].id + '   ' + events[i].name);

        events.slice(i, 1);
      }
    }
    return events;

  }

  async loadEvents() {
    const events = this.cleanEvents();
    for (const inputEvent of events) {
      if (inputEvent.id >= this.startId && inputEvent.id <= this.endId) {
        await this.processEvent(inputEvent);
      }
    }
  }

  private async processEvent(inputEvent: data.ImportData): Promise<void> {

    try {
      const event = await this.addEvent(inputEvent);

      const resultsFilename = "results/legacy/" + inputEvent.id;
      try {
        await this.processResults(event, resultsFilename);
      } catch (err) {
        console.log("Error encountred processing results for event " + inputEvent.id + "  " + err);
      }

    } catch (err) {
      console.log("Error encountered process " + inputEvent.id.toString() + "  " + err);
      throw err;
    }

    console.log("Event" + inputEvent.id + "  processed sucesfully ");

  }

  mapeventGrade(index): EventGrade {
    if (index === 0) {
      return 'IOF';
    } else if (index === 1) {
      return 'International';
    } else if (index === 2) {
      return 'National';
    } else if (index === 3) {
      return 'Regional';
    } else if (index === 4) {
      return 'Club';
    }
  }

  async addEvent(inputEvent: data.ImportData): Promise<OEvent> {

    const grade = this.mapeventGrade(inputEvent.type);

    const event: OEvent = {
      key: inputEvent.id.toString(),
      name: inputEvent.name,
      nationality: inputEvent.nationality,
      date: new Date(inputEvent.eventdate * 1000).toISOString(),
      club: inputEvent.club,
      grade: grade,
      type: "Foot",
      discipline: "Long",
      webpage: inputEvent.webpage,
      splits: null,
      email: inputEvent.email,
      user: "qWLOONZF1NhBZCV1FI9htz3AitI2",
      legacyPassword: inputEvent.legacyPassword,
      yearIndex: new Date(inputEvent.eventdate * 1000).getFullYear(),
      gradeIndex: EventGrades.indexObject(grade),
      controlCardType: "Other"
    };

    /** Set indices */
    this.es.setIndexProperties(event);

    console.log("EventService:  Adding Event " + JSON.stringify(event));

    // Save event data and club index in a transaction
    await this.afs.firestore.runTransaction(async (trans) => {
      await this.es.clubManger.eventAdded(event, trans);
      const ref = this.afs.firestore.doc("/events/" + event.key);
      trans.set(ref, event);
    });

    return Promise.resolve(event);
  }

  async processResults(event: OEvent, path: string, fileFormat: SplitsFileFormat = "auto"): Promise<void> {

    const fs = this.afs.firestore;

    try {
      const text = await this.readFromGoogle(path);

      const results = this.es.parseSplits(text);

      event.summary = this.es.populateSummary(results);

      // Update event object with stored file location
      event.splits = {
        splitsFilename: path,
        splitsFileFormat: fileFormat,
        valid: true,
        uploadDate: new Date()
      };

      /* Update competitors in Firestore database.
         Existing competitors are deleted and new ones added in a batch */
      const batch = new LargeBatch(this.afs);
      const dateAdded = new Date();
      try {
        await this.es.deleteEventResultsFromDB(event, fs, batch);

        // Save new results for the event in the database
        for (const comp of results.allCompetitors) {
          const compDBData = this.cs.createNew(event, comp, dateAdded);
          const compRef = fs.doc("/results/" + compDBData.key);
          await batch.set(compRef, compDBData);
        }
        await batch.commit();
      } catch (err) {
        console.log('EventAdminService: Error encountered writting batch' + event.key + '\n' + err);
        throw err;
      }
    } catch (err) {
      // If an error has occueed save reason in the database
      event.splits.valid = false;
      event.splits.failurereason = err;
      await fs.doc("/events/" + event.key).set(event);
      throw err;
    }

    // seve event details
    await fs.doc("/events/" + event.key).set(event);

    console.log("EventAdminService: Results file uploaded to " + path);

    return Promise.resolve();

  }

  private async readFromGoogle(path: string): Promise<string> {

    const obs = this.storage.ref(path).getDownloadURL()
      .switchMap(url => {
        return this.http.get(url, { responseType: 'text' });
      });

    return obs.toPromise();
  }
}
