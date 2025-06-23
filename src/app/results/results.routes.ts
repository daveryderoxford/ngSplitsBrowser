import { Routes } from '@angular/router';
import { GraphPage } from "./graph-page/graph-page";
import { ResultsTable } from './resullts-table/results-table';
import { StatsPage } from './stats/stats-page/stats-page';

export const RESULTS_ROUTES: Routes = [
   {
      path: "graph/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Graph',
   },
   {
      path: "race/:id",
      component: GraphPage,
      title: 'Splitsbrowser - Race',
   },
   {
      path: "table/:id",
      component: ResultsTable,
      title: 'Splitsbrowser - Results table',
   },
   {
      path: "stats/:id",
      component: StatsPage,
      title: 'Splitsbrowser - Stats',
   },
];
