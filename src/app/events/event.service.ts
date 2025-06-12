/**
 * Event service
 */
import { inject, Injectable, signal } from "@angular/core";
import { FirebaseApp } from '@angular/fire/app';
import { collection, collectionData, doc, docData, DocumentReference, getFirestore, orderBy, query, where } from '@angular/fire/firestore';
import { PaganationService } from "app/shared";
import { BehaviorSubject, merge, Observable } from "rxjs";
import { Club } from './model/club';
import { eventConverter, EventInfo, OEvent } from './model/oevent';

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

  private events$: Observable<OEvent[]> = new Observable(null);
  private pageSize = 20;
  private cursor: OEvent = undefined;
  private _loading = new BehaviorSubject<boolean>(false);

  private _filter = signal("");
  private _page = signal(1);

  /** Sets search critera to use events list
   * @param orderby order the results by specified paremeter name.
   * @param filter the results by ay properties set on the event object
   * @param pagesize the number of events we need to scroll down before re-executing query
  */
  search(orderby: EventSearchOrder, eventfilter: Partial<EventInfo>, pageSize: number): Observable<OEvent[]> {

    this.ps.init('/events', 'date', { reverse: true, limit: pageSize });
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

  /** Get a list of club namees for all events ordered by name and nationality */
  getClubs(): Observable<Club[]> {
    const d = doc(this.firestore, "clubs") as DocumentReference<Club[]>;
    return docData(d);
  }
}
