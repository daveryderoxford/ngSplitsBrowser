import { Injectable } from "@angular/core";
import { AngularFirestore, QueryFn } from "@angular/fire/firestore";
import { Club, EventInfo, OEvent } from "../model";
import { PaganationService } from "../shared";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";


/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

@Injectable({
  providedIn: 'root',
})
export class EventService {

  private events$: Observable<OEvent[]> = new Observable(null);
  private currentSearch: QueryFn;
  private pageSize = 20;
  private cursor: OEvent = undefined;
  private _loading = new BehaviorSubject<boolean>(false);

  constructor(private afs: AngularFirestore,
    private ps: PaganationService<OEvent>) { }

    /** load event by key */
    getEvent(key: string): Observable<OEvent> {
      return this.afs.doc<OEvent>("/events/" + key).valueChanges();
    }

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
    return Observable.merge(this.ps.loading, this._loading);
  }

  /** Observable if reached end of events */
  get done(): Observable<boolean> {
    return this.ps.done;
  }
  /** Gets all evenst for a club  */
  getEventsForClub(club: Club): Observable<OEvent[]> {
    this._loading.next(true);

    const query = this.afs.collection<OEvent>("/events",
      res => res
            .where("club", "==", club.name)
            .where("nationality", "==", club.nationality)
            .orderBy('date', 'desc')
    );

    const clubs$ = query.valueChanges().take(1);

    clubs$.finally( () => this._loading.next(false));

    return clubs$;
  }

  /** Get a list if club namees for all events */
  getClubs(): Observable<Club[]> {
    return this.afs.collection<Club>("/clubs/", ref =>
      ref.orderBy("name").orderBy("nationality"))
      .valueChanges();
  }
}
