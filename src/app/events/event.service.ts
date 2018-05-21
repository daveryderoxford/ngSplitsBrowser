import { Injectable } from "@angular/core";
import { OEvent, EventInfo, Club } from "app/model";
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from "angularfire2/firestore";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { PaganationService } from "app/shared";


/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

/** Event filter object.  Filter against any properties set o this object */
type EventSearchFilter = Partial<EventInfo>;

@Injectable()
export class EventService {

  private events$: Observable<OEvent[]> = new Observable(null);
  private currentSearch: QueryFn;
  private pageSize: number;
  private cursor: OEvent = undefined;

  constructor(private afs: AngularFirestore,
    private ps: PaganationService) { }

  /** Sets search critera to use events list
   * @param orderby order the results by specified paremeter name.
   * @param filter the results by ay properties set on the event object
   * @param pagesize the number of events we need to scroll down before re-executing query
  */
  search(orderby: EventSearchOrder, eventfilter: EventSearchFilter, pageSize: number): Observable<OEvent[]> {

    this.ps.init('/events', 'date', { reverse: true, prepend: true, limit: 20 });
    return this.ps.data;
  }

  /** Extends the search by the pagesize.  The current search criteria apply
  */
  extendSearch() {
    this.ps.more();
  }

  /** Observable if events are loading */
  get loading(): Observable<boolean> {
    return this.ps.loading;
  }

  /** Observable if reached end of events */
  get done(): Observable<boolean> {
    return this.ps.done;
  }
  /** Gets all evenst for a club  */
  getEventsForClub(club: string): Observable<OEvent[]> {

    const query = this.afs.collection<OEvent>("/events",
      res => res.where("club", "==", club).where('splits.valid', '==', true).orderBy('date', 'desc')
    );

    return query.valueChanges();
  }

  /** Get a list if club namees for all events */
  getClubs(): Observable<Club[]> {
    return this.afs.collection<Club>("/clubs/", ref =>
      ref.orderBy("name").orderBy("nationality"))
      .valueChanges();
  }
}
