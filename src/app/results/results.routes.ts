/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { Routes } from '@angular/router';
import { GraphPage } from "./graph/graph-page";
import { resultsResolver } from './results-resolver';

export const RESULTS_ROUTES: Routes = [
   {
      path: "graph/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Graph',
      resolve: {
         results: resultsResolver
      }
   },
   {
      path: "race/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Race',
      resolve: {
         results: resultsResolver
      }
   },
   {
      path: "table/:id",
      loadComponent: () => import('./table/results-table').then(c => c.ResultsTable), 

      title: 'Splitsbrowser - Results table',
      resolve: {
         results: resultsResolver
      }
   },
   
   { 
      path: "stats/:id", 
      title: 'Splitsbrowser - Stats', 
      resolve: {
         results: resultsResolver
      },
      loadComponent: () => import('./stats/stats-page/stats-page').then(c => c.StatsPage) 
   },
];
