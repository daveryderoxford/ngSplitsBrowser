import { Routes } from '@angular/router';
import { GraphPage } from "./graph/graph-page";
import { ResultsResolver } from './results.resolver';
import { ResultsTable } from './resullts-table/results-table';
import { StatsPage } from './stats/stats-page/stats-page';

export const RESULTS_ROUTES: Routes = [
   {
      path: "graph/:id",
      component: GraphPage,
      resolve: {
         results: ResultsResolver
      }
   },
   {
      path: "race/:id",
      component: GraphPage,
      resolve: {
         results: ResultsResolver
      }
   },
   {
      path: "table/:id",
      component: ResultsTable,
      resolve: {
         results: ResultsResolver
      }
   },
   {
      path: "stats/:id",
      component: StatsPage,
      resolve: {
         results: ResultsResolver
      }
   },
];
