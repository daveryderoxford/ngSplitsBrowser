import { Injectable } from "@angular/core";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireStorage } from 'angularfire2/storage';
import { Competitor, Course, CourseClass, Results, InvalidData } from "app/results/model";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { OEvent } from "app/model/oevent";
import { HttpClient } from "@angular/common/http";
import { parseEventData } from "./import";
import { exceptionGuard } from "@firebase/database/dist/src/core/util/util";
import { switchMap, tap } from "rxjs/operators";

/** Holds results selection state.
 * Selecting an event will load its results
 * This include seelcted event, results, courses, classes and controls.
 * This state should be used by all results views to maintain them in sync
 * */
@Injectable({
  providedIn: 'root',
})
export class ResultsSelectionService {

  private event$: BehaviorSubject<OEvent> = new BehaviorSubject(null);
  private results$: BehaviorSubject<Results> = new BehaviorSubject(null);
  private selectedCompetitors$: BehaviorSubject<Array<Competitor>> = new BehaviorSubject([]);
  private selectedControl$: BehaviorSubject<string> = new BehaviorSubject(null);
  private selectedCourse$: BehaviorSubject<Course> = new BehaviorSubject(null);
  private selectedClasses$: BehaviorSubject<Array<CourseClass>> = new BehaviorSubject([]);

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) { }

  /**
   * Selects an event to view.
   * This will load results for the event
   */
  setSelectedEvent(event: OEvent): Observable<Results> {
    this.event$.next(event);

    /// Read the results if they are not avalaible
    if (!event) {
      throw new InvalidData('ResultsSelection: Event not specified');
    }

    const ret = this.downloadResultsFile(event)
      .switchMap((text) => {
        const results = this.parseSplits(text);
        this.results$.next(results);
        this.selectedCompetitors$.next([]);

        //  Select first coure by default
        if (results.courses.length > 0) {
           this.selectedCourse$.next(results.courses[0]);
        } else {
          this.selectedCourse$.next(null);
        }

        if (results.classes.length > 0) {
          this.selectedClasses$.next(results.classes[0]);
        } else {
          this.selectedClasses$.next([]);
        }

        this.selectedControl$.next(null);

        this.selectedClasses$.next([]);
        return this.results$.asObservable();
      });

    return ret;
  }

  /** Selects event based on the event key, loading the event results */
  setSelectedEventByKey(key: string): Observable<Results> {
    const obs = this.afs.doc<OEvent>("/events/" + key).valueChanges().pipe(
        tap ( evt => {
            if (evt) {
              console.log("ResultsSelectionService: Loading Event for key: " + evt.key);
            } else {
              console.log("ResultsSelectionService::  Event not found. key:" + evt.key);
            }
        }),
        switchMap( evt => this.setSelectedEvent(evt) )
      );
    return obs;
  }

  /** Get observable for selected Event */
  get selectedEvent(): Observable<OEvent> {
    return (this.event$.asObservable());
  }

  get selectedResults(): Observable<Results> {
    return this.results$.asObservable();
  }

  selectCompetitor(comp: Competitor) {
    const competitors = this.selectedCompetitors$.getValue().concat(comp);
    competitors.sort((a, b) => a.totalTime - b.totalTime);
    this.selectedCompetitors$.next(competitors);
  }

  removeCompetitor(comp: Competitor) {
    const competitors = this.selectedCompetitors$.getValue();
    this.selectedCompetitors$.next(competitors.filter(e => e !== comp));
  }

  deselectAllCompetitors() {
    this.selectedCompetitors$.next([]);
  }

  get selectedCompetitors(): Observable<Competitor[]> {
    return this.selectedCompetitors$.asObservable();
  }

  selectControl(code: string) {
    this.selectedControl$.next(code);
  }

  get selectedControl(): Observable<string> {
    return this.selectedControl$.asObservable();
  }

  selectCourse(course: Course) {
    this.selectedCourse$.next(course);
  }

  get selectedCourse(): Observable<Course> {
    return this.selectedCourse$.asObservable();
  }

  selectClass(courseclass: CourseClass) {
    const oclasses = this.selectedClasses$.getValue().concat(courseclass);
    oclasses.sort((a, b) => a.name.localeCompare(b.name));
    this.selectedClasses$.next(oclasses);
  }

  /** Remove the specified course class */
  removeClass(courseclass: CourseClass) {
    const competitors = this.selectedClasses$.getValue();
    this.selectedClasses$.next(competitors.filter(e => e !== courseclass));
  }

  /** Return observable if selected courseclasses */
  get selectedClasses(): Observable<CourseClass[]> {
    return this.selectedClasses$.asObservable();
  }

  /** Parse splits file with logging */
  private parseSplits(text: string): any {

    let results: Results;
    try {
      results = parseEventData(text);
    } catch (e) {
      if (e.name === "InvalidData") {
        console.log("EventService Error parsing results" + e.message);
      } else {
        console.log("EventService Error parsing results" + e);
      }
      throw e;
    }

    return (results);
  }

  /** Downloads results for an event from google storage */
  private downloadResultsFile(event: OEvent): Observable<string> {
    const path = event.splits.splitsFilename;

    const obs = this.storage.ref(path).getDownloadURL()
      .switchMap(url => {
        return this.http.get(url, { responseType: 'text' });
      });

    return obs;
  }
}
