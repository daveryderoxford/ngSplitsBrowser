/**
 * Event service
 */
import { inject, Injectable, signal } from "@angular/core";
import { FirebaseApp } from '@angular/fire/app';
import { collection, collectionData, CollectionReference, doc, docData, DocumentReference, DocumentSnapshot, getFirestore, orderBy, query, Timestamp, where } from '@angular/fire/firestore';
import { PaganationService } from "app/shared";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { Club } from './model/club';
import { EventInfo, OEvent, SplitsFileInfo } from './model/oevent';

/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

const EVENTS_COLLECTION = 'events';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private firestore = getFirestore(inject(FirebaseApp));
  private ps = inject(PaganationService);

  private eventsCollection = collection(this.firestore, EVENTS_COLLECTION).withConverter(eventConverter);

  private _loading = new BehaviorSubject<boolean>(false);

  private _filter = signal("");
  private _page = signal(1);

  /** Sets search critera to use events list
   * @param orderby order the results by specified paremeter name.
   * @param filter the results by ay properties set on the event object
   * @param pagesize the number of events we need to scroll down before re-executing query
  */
  search(orderby: EventSearchOrder, eventfilter: Partial<EventInfo>, pageSize: number): Observable<OEvent[]> {

    this.ps.init('/events', 'date', { reverse: true, limit: pageSize, }, eventConverter);
    return this.ps.data;
  }

  /** Extends the search by the pagesize.  The current search criteria apply */
  extendSearch() {
    this.ps.more();
  }

  /** Observable if query is loading */
  get loading(): Observable<boolean> {
    return merge(this.ps.loading, this._loading);
  }

  /** Observable if reached end of events */
  get done(): Observable<boolean> {
    return this.ps.done;
  }


  /** Gets all events for a club  */
  getEventsForClub(club: Club): Observable<OEvent[]> {

    const q = query(this.eventsCollection,
      where("club", "==", club.name),
      where("nationality", "==", club.nationality),
      orderBy('date', 'desc'));

    return collectionData(q);
  }

  private _clubs$: Observable<Club[]> = of([]);
  private _clubsRead = false;

  /** Get a list of club namees for all events ordered by name and nationality */
  getClubs(): Observable<Club[]> {
    if (!this._clubsRead) {
      const d = collection(this.firestore, "/clubs").withConverter(clubConverter);
      this._clubs$ = collectionData(d);
      this._clubsRead = true
    }
    return this._clubs$;
  }
}

const undefinedToNull = (value: any) => value === undefined ? null : value;
const nullToUndefined = (value: any) => value === null ? undefined : value;

function dateFromFireStore(raw: string | Timestamp): Date {
  if (raw === null) return undefined;
  return (raw instanceof Timestamp) ? raw.toDate() : new Date(raw);
}

function mapSplits(raw: any): SplitsFileInfo {
  if (!raw) return undefined;
  return {
    ...raw,
    uploadDate: dateFromFireStore(raw.uploadDate)
  };
}

// Firestore data converters
// 1. Firebase only supports null while undefined is perferred in project
// 2. Firebase stores dates as Timestamps rather than Javascript dates.  
export const eventConverter = {
  toFirestore: (event: OEvent) => {
    return {
      ...event,
      splits: undefinedToNull(event.splits),
      summary: undefinedToNull(event.summary),
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot<any>): OEvent => {
    const data = snapshot.data()!;
    return {
      ...data,
      date: dateFromFireStore(data.date),
      splits: mapSplits(data.splitss),
      summary: nullToUndefined(data.summary),
    } as OEvent;
  }
};

// Firestore data converters
// 1. Firebase only supports null while undefined is perferred in project
// 2. Firebase stores dates as Timestamps rather than Javascript dates.  
export const clubConverter = {
  toFirestore: (club: Club) => {
    return {
      ...club,
    };
  },
  fromFirestore: (snapshot: DocumentSnapshot<any>, options: any): Club => {
    const data = snapshot.data()!;
    console.log(`converting:  ${data.key}   date: ${data.lastEvent} date type:  ${typeof data.lastEvent}`);
      return {
        ...data,
        lastEvent: dateFromFireStore(data.lastEvent)
      };
  }
};