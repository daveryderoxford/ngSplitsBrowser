import { inject, Injectable, signal } from '@angular/core';
import { ResultsView, resultsViews } from "./model/results-view";
import { Router } from '@angular/router';
import { DialogsService } from 'app/shared';
import { OEvent } from './model/oevent';

@Injectable({
   providedIn: 'root',
})
export class ResultsPageState {
   private router = inject(Router);
   private ds = inject(DialogsService);

   private _pageDisplayed = signal<ResultsView>(resultsViews[0]);
   pageDisplayed = this._pageDisplayed.asReadonly();

   setPage(view: ResultsView, key: string) {

      this.router.navigate(["results", view.type, key]).catch((err) => {
         console.log('Errror in navigating to page ' + key + ' ' + err.toString());
         this.ds.message('Error loading results', 'Errror in navigating to page');
      });
      this._pageDisplayed.set(view);
   }
}
