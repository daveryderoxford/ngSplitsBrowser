import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsService } from 'app/shared';
import { ResultsView, resultsViews, ResultsViewType } from "./model/results-view";
import { ResultsEventDetails } from './model/event_details';

@Injectable({
   providedIn: 'root',
})
export class ResultsPageState {
   private router = inject(Router);
   private ds = inject(DialogsService);

   private _pageDisplayed = signal<ResultsView>(resultsViews[0]);
   pageDisplayed = this._pageDisplayed.asReadonly();

   setDisplayedPage(view: ResultsViewType) {
      this._pageDisplayed.set(resultsViews.find(v => v.type === view));
   }

   navigateToPage(view: ResultsView, event: ResultsEventDetails) {
      const queryParams: { [key: string]: string | null } = {
         name: event.name || null,
         date: event.date?.toISOString() ?? null,
         url: event.key === 'online' ? event.url : null
      };

      this.router.navigate(["results", view.type, event.key], { queryParams, queryParamsHandling: 'merge' }).catch((err) => {
         console.log('Errror in navigating to page ' + event.key + ' ' + err.toString());
         this.ds.message('Error loading results', 'Errror in navigating to page');
      });
      this._pageDisplayed.set(view);
   }
}
