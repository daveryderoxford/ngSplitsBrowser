import { Injectable } from "@angular/core";
import { OEvent, EventInfo, Club } from "app/model";
import { AngularFirestore, AngularFirestoreDocument, QueryFn } from "angularfire2/firestore";

import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";


/** Valid properties for Event search order */
export type EventSearchOrder = "date" | "club" | "grade" | "type" | "name" | "discipline";

/** Event filter object.  Filter against any properties set o this object */
type EventSearchFilter = Partial<EventInfo>;

@Injectable()
export class EventService {

  private events$: Observable<OEvent[]> = new Observable(null);
  private currentSearch: QueryFn;
  private searchSize: number;
  private pageSize: number;
  private cursor: OEvent = undefined;

  constructor(private afs: AngularFirestore) { }

  /** Sets search critera to use events list
   * @param orderby order the results by specified paremeter name.
   * @param filter the results by ay properties set on the event object
   * @param pagesize the number of events we need to scroll down before re-executing query
  */
  search(orderby: EventSearchOrder, eventfilter: EventSearchFilter, pagesize: number): Observable<OEvent[]> {

    // order query by order parameter then by decendiung date and name
    this.currentSearch = (res) => {
      return res.orderBy("date", "desc").orderBy("name");
    };

    //  Filter by all propertes in prototype object
    Object.keys(eventfilter).forEach(function (key, index) {
      this.currentSearch = this.currentSearch.where(key, eventfilter[key]);
    });

    // Load first page of results
    this.searchSize = pagesize;
    this.extendSearch();

    return this.events$;

  }

  /** Extends the search by the pagesize.  The current search criteria apply
   * We work on the basis that no one is going to scroll down too far so just maintain an observable of the
   * complete list of events that they have scrolled down
  */
  extendSearch() {

    const query = this.afs.collection<OEvent>("/events",
      res => this.currentSearch(res)
        .limit(this.pageSize)
        .startAfter(this.cursor));

    this.events$ = query.valueChanges();

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
