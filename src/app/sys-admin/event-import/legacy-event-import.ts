
/** Bulk import of historical data */
/* eslint-disable no-console */
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { FirebaseApp } from '@angular/fire/app';
import { doc, getDocs, getFirestore, limit, orderBy, query, setDoc } from '@angular/fire/firestore';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { EventAdminService } from "app/event-admin/event-admin.service";
import { EventGrade, EventGrades, OEvent, SplitsFileFormat } from 'app/events/model/oevent';
import { mappedCollectionRef } from 'app/shared/firebase/firestore-helper';
import { firstValueFrom, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LegacyEvent, legacyEvents } from "./legacy-event-data";

const SYS_ADMIN_UID = 'qWLOONZF1NhBZCV1FI9htz3AitI2';

@Injectable({
  providedIn: 'root',
})
export class LegacyEventImport {
  protected es = inject(EventAdminService);
  protected fs = getFirestore(inject(FirebaseApp));
  protected storage = getStorage(inject(FirebaseApp));
  private http = inject(HttpClient);

  private eventsCollection = mappedCollectionRef<OEvent>(this.fs, 'events');

  BATCH_SIZE = 500;

  message = signal('');

  async loadEvents() {

    const clubsFixed = this.fixCluNames(legacyEvents);

    const events = this.removeDuplicates(clubsFixed);

    const startId = await this.getLastSavedEventId();

    const endId = startId + this.BATCH_SIZE;
    console.log(`LegacyEventUpload::: Processing events from ID ${startId} to ${endId}`);
    this.message.set(`Processing events from ID ${startId} to ${endId}`);

    for (const inputEvent of events) {
      if (inputEvent.id >= startId && inputEvent.id <= endId) {
        await this.processEvent(inputEvent);
      }
    }
  }

  /** read last event id from database */
  private async getLastSavedEventId(): Promise<number> {

    // The keys are stored as strings, so we need to order by date to get the most recent event.
    const lastEventQuery = query(this.eventsCollection, orderBy('date', 'desc'), limit(1));

    const event = (await getDocs(lastEventQuery)).docs[0]?.data();

    if (event) {
      return parseInt(event.key, 10);
    } else {
      console.error("LegacyEventUpload: No events found in the database.");
      this.message.set("No events found in the database.");
      return 0;
    }
  }

  private fixCluNames(events: LegacyEvent[]): LegacyEvent[] {
    return events.map(event => {
      // remove . from club names
      event.club = event.club.replace(new RegExp('\\.', 'g'), '');
      // make club names all uppercase
      event.club = event.club.toUpperCase();
      return event;
    });
  }

  /** Remove duplicate events */
  private removeDuplicates(events: LegacyEvent[] = legacyEvents): LegacyEvent[] {

    // Use a Set to track unique keys
    const keysFound = new Set<string>();

    // Filter out duplicate events - revversing order so we keep the most recent
    const filtered = events.reverse().filter(event => {
      const key = `${event.name}|${event.eventdate}|${event.club}`;
      if (keysFound.has(key)) {
        // console.log(`LegacyUpload: Removing duplicate event ${event.id} - ${event.name}`);
        return false;
      }
      keysFound.add(key);
      return true;
    });

    return filtered.reverse(); // Reverse back to original order
  }

  private async processEvent(inputEvent: LegacyEvent): Promise<void> {

    try {
      const event = await this.addEvent(inputEvent);

      const resultsFilename = "results/legacy/" + inputEvent.id;
      await this.processResults(event, resultsFilename);

    } catch (err) {
      // Log the error but don't re-throw, so the loop can continue with the next event.
      console.error(`LegacyUpload: Error encountered processing event ${inputEvent.id}:`, err);
      this.message.set(`Error processing event ${inputEvent.id}: ${err}`);
    }

  }
  mapeventGrade(index: number): EventGrade {
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
    } else {
      throw ('Unexpected event grade');
    }
  }

  async addEvent(inputEvent: LegacyEvent): Promise<OEvent> {

    const grade = this.mapeventGrade(inputEvent.type);

    const event: OEvent = {
      key: inputEvent.id.toString(),
      name: inputEvent.name,
      nationality: inputEvent.nationality,
      date: new Date(inputEvent.eventdate * 1000),
      club: inputEvent.club,
      grade: grade,
      type: "Foot",
      discipline: "Long",
      webpage: inputEvent.webpage,
      splits: null,
      email: inputEvent.email,
      userId: SYS_ADMIN_UID,
      legacyPassword: inputEvent.legacyPassword,
      yearIndex: new Date(inputEvent.eventdate * 1000).getFullYear(),
      gradeIndex: EventGrades.indexObject(grade),
      controlCardType: "Other"
    };

    /** Set indices */
    this.es.setIndexProperties(event);

    console.log("LegacyUpload: Event added  " + event.key + " - " + event.name);
    this.message.set(`Event added: ${event.key} - ${event.name}`);

    const ref = doc(this.eventsCollection, event.key);
    await setDoc(ref, event);

    return Promise.resolve(event);
  }

  async processResults(event: OEvent, path: string, fileFormat: SplitsFileFormat = "auto"): Promise<void> {

    const fs = this.fs;

    try {
      const text = await this.readFromGoogle(path);
      if (!text || text.length === 0) {
        console.log(`LegacyUpload: No results found for event ${event.key}. Skipping processing.`);
        this.message.set(`No results found for event ${event.key}. Skipping processing.`);
        throw new Error(`No results found in gooole storage for event ${event.key}`);
      }

      const results = this.es.parseSplits(text);

      event.summary = this.es.populateSummary(results);

      // Update event object with stored file location
      let valid = true;
      let reason = results.warnings?.reduce((acc = '', warn) => acc + '\n' + warn, '');
      if (!results) {
        valid = false;
        reason = 'No results parsed - reason unknown';
      }
      event.splits = {
        splitsFilename: path,
        splitsFileFormat: fileFormat,
        valid: valid,
        failurereason: reason,
        uploadDate: new Date()
      };
    } catch (err) {
      console.error(`LegacyEventUpload: Error encountered processing results for event ${event.key}:`, err);
      this.message.set(`Error processing results for event ${event.key}: ${err}`);
      // If an error has occurred, save reason in the database
      event.splits = {
        splitsFilename: path,
        splitsFileFormat: fileFormat,
        valid: false,
        failurereason: err.toString(),
        uploadDate: new Date()

      };
    }

    // Save splits details
    try {

      const d = doc(this.eventsCollection, event.key);
      await setDoc(d, event, {merge: true}); 

      this.message.set('Sys-admin: Rebuild indices completed successfully:');

      return Promise.resolve();

    } catch (error: any) {
      console.log(`LegacyEventUpload:  Error encountered processing events.  Key:  ${event.key}  Event: ${event.name}`);
      this.message.set(`Error processing event ${event.key}: ${error.message}`);
      console.log(error.toString);
      return Promise.reject(error);
    }
  }

  /** Downloads results for an event from google storage */
  private async readFromGoogle(path: string): Promise<string> {

    const r = ref(this.storage, path);
    const url = await getDownloadURL(r);

    const text = await firstValueFrom(
      this.http.get(url, { responseType: 'text' }).pipe(
        catchError(error => handleError(error))
      )
    );

    return text;
  }

}

function handleError(error: Error | HttpErrorResponse): Observable<string> {

  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('LegacyEventUpload: Client side network error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `LegacyEventUpload: Backend returned code ${error.status}, body was: `, error.error);
    }
  } else {
    console.error(`LegacyEventUpload: Unexpected Error occurred ${error.toString()}`);
  }

  throw (error);
}
