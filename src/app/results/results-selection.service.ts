import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs/Rx";
import { OEvent } from "../model/oevent"
import { AngularFireDatabase } from "angularfire2/database";
import { FirebaseApp } from "angularfire2";

import { Competitor, Course, CourseClass } from "app/results/model";


@Injectable()
export class ResultsSelectionService {

  private event$: BehaviorSubject<OEvent> = new BehaviorSubject(null);
  public event: OEvent = null;

  // Observables for results selection
  private selectedCompetitors$: BehaviorSubject<Array<Competitor>> = new BehaviorSubject(null);
  private selectedControl$: BehaviorSubject<string> = new BehaviorSubject(null);
  private selectedCourse$: BehaviorSubject<Course> = new BehaviorSubject(null);
  private selectedClasses$: BehaviorSubject<Array<CourseClass>> = new BehaviorSubject(null);

  constructor(private db: AngularFireDatabase,
    private firebaseApp: FirebaseApp,
  ) { }

  setSelectedEvent(event: OEvent) {
    this.event = event;
    this.event$.next(event);
  }

  async setSelectedEventByKey(key: string) {
    if (!this.event || this.event.key !== key) {
      this.db.object<OEvent>("/events/" + key).valueChanges().subscribe((event) => {
        this.setSelectedEvent(event);
      });
    }
  }

  getEventObservable(): Observable<OEvent> {
    return (this.event$.asObservable());
  }

  /** Returns promise to url of splits file for currently selected event */
  async getSplitsURL(): Promise<any> {
    const path = this.event.splits.splitsFilename;
    return (this.firebaseApp.storage().ref().child(path).getDownloadURL());
  }



}
