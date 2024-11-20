import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { doc, docData, DocumentReference, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { Router } from '@angular/router';
import { OEvent } from "app/model/oevent";
import { DialogsService } from 'app/shared';
import { range as d3_range, ascending as d3_ascending } from "d3-array";

import { BehaviorSubject, from, Observable } from "rxjs";
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { parseEventData } from "./import";
import { Competitor, InvalidData, Results, ResultsView } from "./model";
import { Repairer } from './model/repairer';
import { resultsViews } from "./model/results-view";
import { isNotNullNorNaN } from './model/util';

/** Holds results selection state.
 * Selecting an event will load its results
 * This include seelcted event, results, courses, classes and controls.
 * This state should be used by all results views to maintain them in sync
 * */
@Injectable({
   providedIn: 'root',
})
export class ResultsDataService {

   private router = inject(Router);
   private firestore = inject(Firestore);
   private storage = inject(Storage);
   private http = inject(HttpClient);
   private ds = inject(DialogsService);

   // Behavioir subjects for all state
   private _event$: BehaviorSubject<OEvent> = new BehaviorSubject(null);
   private _results$: BehaviorSubject<Results> = new BehaviorSubject(null);
   private _resultsView$: BehaviorSubject<ResultsView> = new BehaviorSubject(resultsViews[0]);

   public selectedEvent = this._event$.asObservable();
   public selectedResults = this._results$.asObservable();
   public resultsView = this._resultsView$.asObservable().pipe(distinctUntilChanged());

   constructor() { }

   /** Loads results for a specified event returning an observable of the results.
    * This just loads the results file from storage and does not clear any current selections.
    */
   public loadResults(event: OEvent): Observable<Results> {
      const ret = this.downloadResultsFile(event).pipe(
         map(text => {
            const results = this.parseSplits(text);
            if (results.needsRepair()) {
               Repairer.repairEventData(results);
            }
            results.determineTimeLosses();

            this.computeRanks(results);
            
            return results;
         }));
      return ret;
   }

   /**
    * Selects an event to view.
    * This will load results from storage clearing any selections relivant to the previous event
    * The first class is selected if one exists.
    */
   setSelectedEvent(event: OEvent): Observable<Results> {

      if (!event) {
         throw new InvalidData('ResultsSelection: Event not specified');
      }

      if (!this._event$.value || event.key !== this._event$.value.key) {

         const ret = this.loadResults(event).pipe(
            tap(results => {
               this._event$.next(event);
               this._results$.next(results);
            }));

         return ret;
      } else {
         return this._results$.asObservable();
      }
   }

   /** Selects event based on the event key, loading the event results */
   setSelectedEventByKey(key: string): Observable<Results> {
      if (!this._event$.value || key !== this._event$.value.key) {

         const d = doc(this.firestore, "/events/" + key) as DocumentReference<OEvent>;
         const obs = docData(d).pipe(
            tap(evt => {
               if (evt) {
                  console.log("ResultsSelectionService: Loading Event for key: " + evt.key);
               } else {
                  console.log("ResultsSelectionService:: Event not found. key:" + evt.key);
               }
            }),
            switchMap(evt => this.setSelectedEvent(evt))
         );
         return obs;
      } else {
         return this._results$.asObservable();
      }
   }

   setResultsView(view: ResultsView) {
      
      this.router.navigate(["results", view.type, this._event$.value.key]).catch((err) => {
         console.log('Errror in navigating to page ' + this._event$.value.name + ' ' + err.toString());
         this.ds.message('Error loading results', 'Errror in navigating to page');
      });
      this._resultsView$.next(view);
   }

   /** Parse splits file with logging */
   public parseSplits(text: string): Results {

      let results: Results;
      try {
         results = parseEventData(text);
      } catch (e) {
         if (e.name === "InvalidData") {
            console.log("EventService: Error parsing results" + e.message);
         } else {
            console.log("EventService: Error parsing results" + e);
         }
         throw e;
      }

      return (results);
   }

   /** Downloads results for an event from google storage */
   public downloadResultsFile(event: OEvent): Observable<string> {
      const path = event.splits.splitsFilename;

      const headers = new HttpHeaders({ 'Accept-Encoding': 'gzip' });

      const r = ref(this.storage, path);
      const obs = from(getDownloadURL(r)).pipe(
         switchMap(url => this.http.get(url, { responseType: 'text', headers: headers }))
      );
      return obs;
   }

   private computeRanks(results: Results) {
      for (const oclass of results.classes ) {
         this.computeCompetitorRanks(oclass.competitors, oclass.numControls);
      }
   }

   /**
   * Compute the ranks of each competitor within their class.
   */
   private computeCompetitorRanks(competitors: Competitor[], numControls: number) {

      if (competitors.length === 0) {
         return;
      }

      const splitRanksByCompetitor = [];
      const cumRanksByCompetitor = [];

      competitors.forEach(() => {
         splitRanksByCompetitor.push([]);
         cumRanksByCompetitor.push([]);
      });

      d3_range(1, numControls + 2).forEach((control) => {
         const splitsByCompetitor = competitors.map((comp) => {
            return comp.getSplitTimeTo(control);
         });
         const splitRanksForThisControl = this.getRanks(splitsByCompetitor);
         competitors.forEach((_comp, idx) => {
            splitRanksByCompetitor[idx].push(splitRanksForThisControl[idx]);
         });
      }, this);

      d3_range(1, numControls + 2).forEach((control) => {
         // We want to null out all subsequent cumulative ranks after a
         // competitor mispunches.
         const cumSplitsByCompetitor = competitors.map((comp, idx) => {
            // -1 for previous control, another -1 because the cumulative
            // time to control N is cumRanksByCompetitor[idx][N - 1].
            if (control > 1 && cumRanksByCompetitor[idx][control - 1 - 1] === null) {
               // This competitor has no cumulative rank for the previous
               // control, so either they mispunched it or mispunched a
               // previous one.  Give them a null time here, so that they
               // end up with another null cumulative rank.
               return null;
            } else {
               return comp.getCumulativeTimeTo(control);
            }
         });
         const cumRanksForThisControl = this.getRanks(cumSplitsByCompetitor);
         competitors.forEach((_comp, idx) => { cumRanksByCompetitor[idx].push(cumRanksForThisControl[idx]); });
      }, this);

      competitors.forEach((comp, idx) => {
         comp.setSplitAndCumulativeRanks(splitRanksByCompetitor[idx], cumRanksByCompetitor[idx]);
      });
   }

   /**
   * Given an array of numbers, return a list of the corresponding ranks of those
   * numbers.
   * @sb-param {Array} sourceData - Array of number values.
   * @sb-returns Array of corresponding ranks.
   */
   private getRanks(sourceData: Array<number>): Array<number> {
      // First, sort the source data, removing nulls.
      const sortedData = sourceData.filter(isNotNullNorNaN);
      sortedData.sort(d3_ascending);

      // Now construct a map that maps from source value to rank.
      const rankMap = new Map<string, number>()
      sortedData.forEach((value: number, index: number) => {
         if (!rankMap.has(value.toString())) {
            rankMap.set(value.toString(), index + 1);
         }
      });

      // Finally, build and return the list of ranks.
      const ranks = sourceData.map((value) => {
         return isNotNullNorNaN(value) ? rankMap.get(value.toString()) : value;
      });

      return ranks;
   }
}
