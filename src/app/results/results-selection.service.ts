
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { OEvent } from "app/model/oevent";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { parseEventData } from "./import";
import { Competitor, Course, CourseClass, InvalidData, Results, ResultsView } from "./model";
import { resultsViews } from "./model/results-view";

/** Holds results selection state.
 * Selecting an event will load its results
 * This include seelcted event, results, courses, classes and controls.
 * This state should be used by all results views to maintain them in sync
 * */
@Injectable( {
   providedIn: 'root',
} )
export class ResultsSelectionService {

   // Behavioir subjects for all state
   private _event$: BehaviorSubject<OEvent> = new BehaviorSubject( null );
   private _results$: BehaviorSubject<Results> = new BehaviorSubject( null );
   private _selectedCompetitors$: BehaviorSubject<Array<Competitor>> = new BehaviorSubject( [] );
   private _selectedControl$: BehaviorSubject<string> = new BehaviorSubject( null );
   private _selectedCourse$: BehaviorSubject<Course> = new BehaviorSubject( null );
   private _selectedClass$: BehaviorSubject<CourseClass> = new BehaviorSubject( null );
   private _courseCompetitorsDisplayed$: BehaviorSubject<boolean> = new BehaviorSubject( false );
   private _resultsView$: BehaviorSubject<ResultsView> = new BehaviorSubject( resultsViews[ 0 ] );

   constructor ( private afs: AngularFirestore,
      private storage: AngularFireStorage,
      private http: HttpClient
   ) { }

   /** Loads results for a specified event returning an observable of the results.
    * This just loads the results file from storage and does not clear any current selections.
    */
   loadResults( event: OEvent ): Observable<Results> {
      const ret = this.downloadResultsFile( event ).pipe(
         map( text => {
            const results = this.parseSplits( text );
            return results;
         } ) );
      return ret;
   }

   /**
    * Selects an event to view.
    * This will load results from storage clearing any selections relivant to the previous event
    * The first class is selected if one exists.
    */
   setSelectedEvent( event: OEvent ): Observable<Results> {

      if ( !event ) {
         throw new InvalidData( 'ResultsSelection: Event not specified' );
      }

      if ( !this._event$.value || event.key !== this._event$.value.key ) {

         const ret = this.loadResults( event ).pipe(
            tap( results => {
               this._selectedCompetitors$.next( [] );
               this._selectedControl$.next( null );

               if ( results.classes.length > 0 ) {
                  this.selectClass( results.classes[ 0 ] );
               } else {
                  this._selectedCourse$.next( null );
                  this._selectedClass$.next( null );
               }

               this._event$.next( event );
               this._results$.next( results );

            } ) );

         return ret;
      } else {
         return this._results$.asObservable();
      }

   }

   /** Selects event based on the event key, loading the event results */
   setSelectedEventByKey( key: string ): Observable<Results> {
      if ( !this._event$.value || key !== this._event$.value.key ) {

         const obs = this.afs.doc<OEvent>( "/events/" + key ).valueChanges().pipe(
            tap( evt => {
               if ( evt ) {
                  console.log( "ResultsSelectionService: Loading Event for key: " + evt.key );
               } else {
                  console.log( "ResultsSelectionService::  Event not found. key:" + evt.key );
               }
            } ),
            switchMap( evt => this.setSelectedEvent( evt ) )
         );
         return obs;
      } else {
         return this._results$.asObservable();
      }
   }

   /** Get observable for selected Event */
   get selectedEvent(): Observable<OEvent> {
      return ( this._event$.asObservable() );
   }

   /* Get Observable of selected results */
   get selectedResults(): Observable<Results> {
      return this._results$.asObservable();
   }

   /** Select a competitor or array of competitors */
   selectCompetitors( ...comp: Competitor[] ) {
      let competitors = this._selectedCompetitors$.getValue().concat( comp );
      competitors = competitors.sort( ( a, b ) => a.totalTime - b.totalTime );
      this._selectedCompetitors$.next( competitors );
   }

   /** Deselect the supplied competitors
    * If a competitor is not selected then it is ignored.
    */
   deselectCompetitors( ...compToRemove: Competitor[] ) {
      let competitors = this._selectedCompetitors$.getValue();
      competitors = competitors.filter( value => {
         return compToRemove.includes( value );
      } );
      this._selectedCompetitors$.next( competitors );
   }

   /** Returns an observable of selected competitors filtered to those that in the currently displayed course/class as appropriate */
   get selectedCompetitorsDisplayed(): Observable<Competitor[]> {
      return combineLatest( this.selectedCompetitors, this.selectedCourse, this.selectedClass, this._courseCompetitorsDisplayed$,
         ( selectedComps: Competitor[], course: Course, oclass: CourseClass, displayCourse: boolean ) => {
            return selectedComps.filter( comp =>
               displayCourse ? comp.courseClass.course.name === course.name : comp.courseClass.name === oclass.name );
         } );
   }

   get selectedCompetitors(): Observable<Competitor[]> {
      return this._selectedCompetitors$.asObservable().pipe( distinctUntilChanged() );
   }

   selectControl( code: string ) {
      this._selectedControl$.next( code );
   }

   get selectedControl(): Observable<string> {
      return this._selectedControl$.asObservable().pipe( distinctUntilChanged() );
   }

   selectCourse( course: Course ) {
      // If course has changed then reset the selected control
      if ( course !== this._selectedCourse$.value ) {
         this.selectControl( null );
      }
      this._selectedCourse$.next( course );
   }

   get selectedCourse(): Observable<Course> {
      return this._selectedCourse$.asObservable();
   }

   selectClass( courseclass: CourseClass ) {
      this.selectCourse( courseclass.course );
      this._selectedClass$.next( courseclass );
   }

   /** Return observable of selected courseclasses.
   */
   get selectedClass(): Observable<CourseClass> {
      return this._selectedClass$.asObservable().pipe( distinctUntilChanged() );
   }

   /** Display all competitors for the course or just the selected class */
   displayAllCourseCompetitors( showCourse: boolean ) {
      this._courseCompetitorsDisplayed$.next( showCourse );
   }

   /** Are competitors for class or course displayed */
   get courseCompetitorsDisplayed(): Observable<boolean> {
      return this._courseCompetitorsDisplayed$.pipe( distinctUntilChanged() );
   }

   /* Get ordered list of competitors to be displayed */
   get displayedCompetitors(): Observable<Competitor[]> {
      const obs = combineLatest( this._selectedCourse$, this._selectedClass$, this._courseCompetitorsDisplayed$,
         ( course: Course, oclass: CourseClass, displayCourse: boolean ) => {
            const comp = displayCourse ? course.competitors : oclass.competitors;
            return comp;
         } );
      return obs;
   }

   get resultsView(): Observable<ResultsView> {
      return this._resultsView$.asObservable().pipe( distinctUntilChanged() );
   }

   setResultsView( view: ResultsView ) {
      this._resultsView$.next( view );
   }

   /** Parse splits file with logging */
   public parseSplits( text: string ): Results {

      let results: Results;
      try {
         results = parseEventData( text );
      } catch ( e ) {
         if ( e.name === "InvalidData" ) {
            console.log( "EventService: Error parsing results" + e.message );
         } else {
            console.log( "EventService: Error parsing results" + e );
         }
         throw e;
      }

      return ( results );
   }

   /** Downloads results for an event from google storage */
   public downloadResultsFile( event: OEvent ): Observable<string> {
      const path = event.splits.splitsFilename;

      const headers = new HttpHeaders( { 'Accept-Encoding': 'gzip' } );

      const obs = this.storage.ref( path ).getDownloadURL().pipe(
         switchMap( url => this.http.get( url, { responseType: 'text', headers: headers } ) )
      );
      return obs;
   }
}
