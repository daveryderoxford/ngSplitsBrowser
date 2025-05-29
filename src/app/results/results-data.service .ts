'use strict';

import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { doc, docData, DocumentReference, Firestore } from '@angular/fire/firestore';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';
import { OEvent } from "app/events/model/oevent";
import { ascending as d3_ascending, range as d3_range } from "d3-array";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, switchMap, tap } from 'rxjs/operators';
import { parseEventData } from "./import";
import { Competitor, InvalidData, Results } from "./model";
import { Repairer } from './model/repairer';
import { isNotNullNorNaN } from './model/results_util';

const colours = [
   "#FF0000", "#4444FF", "#00FF00", "#000000", "#CC0066", "#000099",
   "#FFCC00", "#884400", "#9900FF", "#CCCC00", "#888800", "#CC6699",
   "#00DD00", "#3399FF", "#BB00BB", "#00DDDD", "#FF00FF", "#0088BB",
   "#888888", "#FF99FF", "#55BB33"
];

@Injectable({
   providedIn: 'root',
})
export class ResultsDataService {

   private firestore = inject(Firestore);
   private storage = inject(Storage);
   private http = inject(HttpClient);

   // Behavioir subjects for all state
   private _event$: BehaviorSubject<OEvent> = new BehaviorSubject(null);
   private _results$: BehaviorSubject<Results> = new BehaviorSubject(null);

   readonly event = toSignal(this._event$);
   readonly results = toSignal(this._results$);

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

            this.computeColors(results);

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

         const d = doc(this.firestore, "events", key) as DocumentReference<OEvent>;
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

   /** Parse splits file with logging */
   public parseSplits(text: string): Results {

      let results: Results;
      try {
         results = parseEventData(text);
      } catch (e: any) {
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

      const r = ref(this.storage, path);
      const obs = from(getDownloadURL(r)).pipe(
         switchMap(url => this.http.get(url, { responseType: 'text' }))
      );
      return obs;
   }

   private computeRanks(results: Results) {
      for (const oclass of results.classes) {
         this.computeCompetitorRanks(oclass.competitors, oclass.numControls);
      }
   }

   private computeColors(results: Results) {
      for (const course of results.courses) {
         course.competitors.forEach((competitor, index) => {
            competitor.color = colours[index % colours.length];
         });
      }
   }

   /**
   * Compute the ranks of each competitor within their class.
   */
   private computeCompetitorRanks(competitors: Competitor[], numControls: number) {

      if (competitors.length === 0) {
         return;
      }

      const splitRanksByCompetitor: number[][] = [];
      const cumRanksByCompetitor: number[][] = [];

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
      const rankMap = new Map<string, number>();
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

function deepFreeze(o: any) {
   Object.freeze(o);
   if (o === undefined) {
      return o;
   }

   Object.getOwnPropertyNames(o).forEach(function (prop) {
      if (o[prop] !== null
         && (typeof o[prop] === "object" || typeof o[prop] === "function")
         && !Object.isFrozen(o[prop])) {
         deepFreeze(o[prop]);
      }
   });

   return o;
};
