/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DialogsService } from 'app/shared';
import { ResultsView, resultsViews, ResultsViewType } from "./model/results-view";

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

   navigateToPage(view: ResultsView, key: string) {

      this.router.navigate(["results", view.type, key]).catch((err) => {
         console.log('Errror in navigating to page ' + key + ' ' + err.toString());
         this.ds.message('Error loading results', 'Errror in navigating to page');
      });
      this._pageDisplayed.set(view);
   }
}
