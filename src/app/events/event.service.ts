/**
 * Event service
 */
import { Injectable, inject } from "@angular/core";
import { collection, collectionData, CollectionReference, doc, docData, DocumentReference, Firestore, orderBy, query, where } from '@angular/fire/firestore';
import { PaganationService } from "app/shared";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { EventInfo, OEvent } from './model/oevent';
import { Club } from './model/club';

/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

@Injectable({
  providedIn: 'root',
})
export class EventService {
      private firestore = inject(Firestore);
      private ps = inject<PaganationService<OEvent>>(PaganationService<OEvent>);
      
  private events$: Observable<OEvent[]> = new Observable(null);
  private pageSize = 20;
  private cursor: OEvent = undefined;
  private _loading = new BehaviorSubject<boolean>(false);

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

    const eventsCollection = collection(this.firestore, "/events") as CollectionReference<any>;
    const q = query(eventsCollection, 
         where("club", "==", club.name), 
         where("nationality", "==", club.nationality),
         orderBy('date', 'desc'));

    return collectionData(q);
  }

  /** Get a list of club namees for all events ordered by name and nationality */
  getClubs(): Observable<Club[]> {
    return of([{
      key: 'eee',
      name: 'clubname',
      nationality: 'GBR',
      numEvents: 0,
      lastEvent: 'dummy'
    }]);
    const d = doc(this.firestore, "clubs") as DocumentReference<Club[]>
    return docData(d);
  }
}
