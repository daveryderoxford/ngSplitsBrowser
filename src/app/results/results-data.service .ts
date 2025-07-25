'use strict';

import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { computed, inject, Injectable, linkedSignal, resource, signal } from "@angular/core";
import { FirebaseApp } from '@angular/fire/app';
import { getDownloadURL, getStorage, ref } from '@angular/fire/storage';
import { ascending as d3_ascending, range as d3_range } from "d3-array";
import { firstValueFrom, Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { parseEventData } from "./import";
import { Competitor, Results } from "./model";
import { ResultsEventDetails } from './model/event_details';
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

   private storage = getStorage(inject(FirebaseApp));
   private http = inject(HttpClient);

   _event = signal<ResultsEventDetails | undefined>(undefined);
   event = this._event.asReadonly();

   private _key = computed(() => this._event()?.key);  // Computed signal for key property only

   private _resultsResource = resource({
      params: () => ({ id: this._key() }),
      loader: async ({ params }) => {
         const results = await this.loadResults(params.id);
         return results;
      },
   });

   // Ensure thta results always has a value.  Avoids having to managed undefined states in computations
   results = this._resultsResource.value;
   //   source: this._resultsResource.value,
  //    computation: (data, previous) => previous?.value ?? data,
 //  });

   isLoading = this._resultsResource.isLoading;
   error = this._resultsResource.error;

   setSelectedEvent(key: string, name = "", date?: Date | undefined) {
      this._event.set({
         key: key,
         name: name,
         date: date
      });
   }

   /** Loads results for a specified event returning an observable of the results.
    * This just loads the results file from storage and does not clear any current selections.
    */
   public async loadResults(key: string): Promise<Results> {

      const text = await this.downloadResultsFile(key);

      const results = this.parseSplits(text);
      if (results.needsRepair()) {
         Repairer.repairEventData(results);
      }
      results.determineTimeLosses();

      this.computeRanks(results);

      this.computeColors(results);

      return results;

   }

   /** Parse splits file */
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
   public async downloadResultsFile(key: string): Promise<string> {

      const path = isNaN(parseInt(key)) ?
         `results /${key} ` :
         `results/legacy/${key}`;

      const r = ref(this.storage, path);

      const url = await getDownloadURL(r);

      const text = await firstValueFrom(
         this.http.get(url, { responseType: 'text' }).pipe(
            catchError(error => handleError(error))
         )
      );

      return text;
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
   private getRanks(sourceData: number[]): number[] {
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


function handleError(error: Error | HttpErrorResponse): Observable<string> {

   if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
         // A client-side or network error occurred. Handle it accordingly.
         console.error('ResultsDataService: Client side network error occurred:', error.error);
      } else {
         // The backend returned an unsuccessful response code.
         // The response body may contain clues as to what went wrong.
         console.error(
            `ResultsDataService: Backend returned code ${error.status}, body was: `, error.error);
      }
   } else {
      console.error(`ResultsDataService: Unexpected Error occurred ${error.toString()}`);
   }

   throw (error);
}
