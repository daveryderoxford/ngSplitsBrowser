import { Routes } from '@angular/router';
import { GraphPage } from "./graph/graph-page";
import { resultsResolver } from './results-resolver';

export const RESULTS_ROUTES: Routes = [
   {
      path: "graph/:uid/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Graph',
      resolve: {
         results: resultsResolver
      }
   },
   {
      path: "race/:uid/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Race',
      resolve: {
         results: resultsResolver
      }
   },
   {
      path: "table/:uid/:id",
      loadComponent: () => import('./table/results-table').then(c => c.ResultsTable),
      title: 'Splitsbrowser - Results table',
      resolve: {
         results: resultsResolver
      }
   },
   { 
      path: "stats/:uid/:id", 
      title: 'Splitsbrowser - Stats', 
      resolve: {
         results: resultsResolver
      },
      loadComponent: () => import('./stats/stats-page/stats-page').then(c => c.StatsPage) 
   },
];
