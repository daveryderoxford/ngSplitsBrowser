/**
 * Event service
 */
import { inject, Injectable, signal } from "@angular/core";
import { FirebaseApp } from '@angular/fire/app';
import { collectionData, getFirestore, orderBy, query, where } from '@angular/fire/firestore';
import { PaganationService } from "app/shared";
import { mappedCollectionRef, mappedConverter } from 'app/shared/utils/firestore-helper';
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { Club } from './model/club';
import { EventInfo, OEvent } from './model/oevent';

/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

const EVENTS_COLLECTION = 'events';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private firestore = getFirestore(inject(FirebaseApp));
  private ps = inject(PaganationService);

  private eventsCollection = mappedCollectionRef<OEvent>(this.firestore, EVENTS_COLLECTION);
  private clubsCollection = mappedCollectionRef<Club>(this.firestore, 'clubs');

  private _loading = new BehaviorSubject<boolean>(false);

  private _filter = signal("");
  private _page = signal(1);

  private _clubs$: Observable<Club[]> = of([]);
  private _clubsRead = false;

  /** Sets search critera to use events list
   * @param orderby order the results by specified paremeter name.
   * @param filter the results by ay properties set on the event object
   * @param pagesize the number of events we need to scroll down before re-executing query
  */
  search(orderby: EventSearchOrder, eventfilter: Partial<EventInfo>, pageSize: number): Observable<OEvent[]> {

    this.ps.init('/events', 'date', { reverse: true, limit: pageSize, }, mappedConverter<OEvent>());
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
    if (!this._clubsRead) {
      this._clubs$ = collectionData(this.clubsCollection);
      this._clubsRead = true;
    }
    return this._clubs$;
  }
}