import { Routes } from '@angular/router';
import { GraphPage } from "./graph/graph-page";
import { ResultsTable } from './table/results-table';

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
      title: 'Splitsbrowser - Stats', 
      loadComponent: () => import('./stats/stats-page/stats-page').then(c => c.StatsPage) 
   },
];
