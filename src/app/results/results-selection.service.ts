import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from '@angular/fire/storage';
import { OEvent } from "app/model/oevent";
import { switchMap, tap, map } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs/Rx";
import { parseEventData } from "./import";
import { Competitor, Course, CourseClass, InvalidData, Results } from "./model";

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
  private selectedClass$: BehaviorSubject<CourseClass> = new BehaviorSubject(null);

  private courseCompetitorsDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  //  Displayed competitors depends on te course, class and display option selected
  // tslint:disable-next-line:max-line-length
  private displayedCompetitors$ = Observable.combineLatest(this.selectedCourse$, this.selectedClass$, this.courseCompetitorsDisplayed$, (course: Course, oclass: CourseClass, displayCourse: boolean) => {
    const comp = displayCourse ? course.competitors : oclass.competitors;
    return comp;
  });

  constructor(private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private http: HttpClient
  ) { }

  /** Loads results for a specified event returning an observable of the results.
   * This just loads the results file from storage and does not clear any current selections.
   */
  loadResults(event: OEvent): Observable<Results> {
    const ret = this.downloadResultsFile(event)
      .map(text => {
        const results = this.parseSplits(text);
        return results;
      });
    return ret;
  }

  /**
   * Selects an event to view.
   * This will load results from storage clearing any selections relivant to the previous event
   */
  setSelectedEvent(event: OEvent): Observable<Results> {
    this.event$.next(event);

    /// Read the results if they are not avalaible
    if (!event) {
      throw new InvalidData('ResultsSelection: Event not specified');
    }

    const ret = this.loadResults(event).subscribe((results) => {
      this.results$.next(results);

      // Clear selected competitors and control and set first class
      this.selectedCompetitors$.next([]);
      this.selectedControl$.next(null);

      if (results.classes.length > 0) {
        this.selectClass(results.classes[0]);
      } else {
        this.selectedClass$.next(null);
      }

    });

    return this.results$.asObservable();
  }

  /** Selects event based on the event key, loading the event results */
  setSelectedEventByKey(key: string): Observable<Results> {
    const obs = this.afs.doc<OEvent>("/events/" + key).valueChanges().pipe(
      tap(evt => {
        if (evt) {
          console.log("ResultsSelectionService: Loading Event for key: " + evt.key);
        } else {
          console.log("ResultsSelectionService::  Event not found. key:" + evt.key);
        }
      }),
      switchMap(evt => this.setSelectedEvent(evt))
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

  /** Select a competitor or array of competitors */
  selectCompetitor(...comp: Competitor[]) {
    const competitors = this.selectedCompetitors$.getValue().concat(comp);
    competitors.sort((a, b) => a.totalTime - b.totalTime);
    this.selectedCompetitors$.next(competitors);
  }

  deselectCompetitors(...comp: Competitor[]) {
    const competitors = this.selectedCompetitors$.getValue();
    this.selectedCompetitors$.next(competitors.filter(e => e !== comp));
  }

  deselectAllCompetitors() {
    this.selectedCompetitors$.next([]);
  }

  /** Returns an observable of selected competitors filtered to those that in the currently displayed course/class as appropriate */
  get selectedCompetitorsDisplayed(): Observable<Competitor[]> {
    return Observable.combineLatest( this.selectedCompetitors, this.selectedCourse, this.selectedClass, this.courseCompetitorsDisplayed$,
      (selectedComps: Competitor[], course: Course, oclass: CourseClass, displayCourse: boolean) => {
        return selectedComps.filter( comp =>
          displayCourse ? comp.courseClass.course.name === course.name : comp.courseClass.name === oclass.name);
      });
  }

  get selectedCompetitors(): Observable<Competitor[]> {
    return this.selectedCompetitors$.asObservable().distinctUntilChanged();
  }

  selectControl(code: string) {
    this.selectedControl$.next(code);
  }

  get selectedControl(): Observable<string> {
    return this.selectedControl$.asObservable().distinctUntilChanged();
  }

  selectCourse(course: Course) {
    // If course has changed then reset the selected control
    if (course !== this.selectedCourse$.value) {
      this.selectControl(null);
    }
    this.selectedCourse$.next(course);
  }

  get selectedCourse(): Observable<Course> {
    return this.selectedCourse$.asObservable();
  }

  selectClass(courseclass: CourseClass) {
    this.selectCourse(courseclass.course);
    this.selectedClass$.next(courseclass);
  }

  /** Return observable of selected courseclasses */
  get selectedClass(): Observable<CourseClass> {
    return this.selectedClass$.asObservable().distinctUntilChanged();
  }

  /** Display all competitors for the course or just the selected class */
  displayAllCourseCompetitors(showCourse: boolean) {
    this.courseCompetitorsDisplayed$.next(showCourse);
  }

  /** Are competitors for class or course displayed */
  get courseCompetitorsDisplayed(): Observable<boolean> {
    return this.courseCompetitorsDisplayed$.distinctUntilChanged();
  }

  /* Get ordered list of competitors to be displayed */
  get displayedCompetitors(): Observable<Competitor[]> {
    return this.displayedCompetitors$;
  }

  /** Parse splits file with logging */
  public parseSplits(text: string): Results {

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
  public downloadResultsFile(event: OEvent): Observable<string> {
    const path = event.splits.splitsFilename;

    const obs = this.storage.ref(path).getDownloadURL()
      .switchMap(url => {
        return this.http.get(url, { responseType: 'text' });
      });

    return obs;
  }
}
