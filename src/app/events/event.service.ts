/**
 * Event service
 */
import { inject, Injectable, signal } from "@angular/core";
import { rxResource } from '@angular/core/rxjs-interop';
import { FirebaseApp } from '@angular/fire/app';
import { collectionData, getFirestore, orderBy, query, where } from '@angular/fire/firestore';
import { PaganationService } from "app/shared";
import { mappedCollectionRef, mappedConverter } from 'app/shared/firebase/firestore-helper';
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { Club } from './model/club';
import { EventInfo, OEvent } from './model/oevent';

/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private firestore = getFirestore(inject(FirebaseApp));
  private ps = inject(PaganationService);

  private eventsCollection = mappedCollectionRef<OEvent>(this.firestore, 'events');
  private clubsCollection = mappedCollectionRef<Club>(this.firestore, 'clubs');

  private _loading = new BehaviorSubject<boolean>(false);

  private _filter = signal("");
  private _page = signal(1);

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

  // Events for specified club
  private _selectedClub = signal<Club | undefined>(undefined);

  private _eventsForClubResouce = rxResource<OEvent[], Club>({
    params: () => this._selectedClub(),
    stream: (data) => {
      const club = data.params;
      if (club === undefined) {
        return of([]);
      }
      const q = query(this.eventsCollection,
        where("club", "==", club.name),
        where("nationality", "==", club.nationality),
        orderBy('date', 'desc'));

      return collectionData(q);
    }
  });

  setSelectedClub(club: Club | undefined) {
    this._selectedClub.set(club);
  }

  eventsForClub = this._eventsForClubResouce.value.asReadonly();
  eventsForClubLoading = this._eventsForClubResouce.isLoading;
  eventsForClubError = this._eventsForClubResouce.error;

  /** Get a list of club namees for all events ordered by name and nationality */

  _loadClubs = signal(false);

  private _clubsResouce = rxResource<Club[], boolean>({
    params: () => this._loadClubs(),
    defaultValue: [],
    stream: (data) => {
      if (!data.params) {
        return of([]);
      }
      return collectionData(this.clubsCollection);
    }
  });

  clubs = this._clubsResouce.value.asReadonly();
  clubsLoading = this._clubsResouce.isLoading;
  clubsError = this._clubsResouce.error;

  loadClubs() {
    this._loadClubs.set(true);
  }
}