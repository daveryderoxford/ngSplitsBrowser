import { Routes } from '@angular/router';
import { GraphComponent } from "./graph/graph.component";
import { ResultsResolver } from './results.resolver';
import { SplitsGridComponent } from './splits-grid/splits-grid.component';

export const RESULTS_ROUTES: Routes = [
   {
      path: "graph/:id",
      component: GraphComponent,
      resolve: {
         results: ResultsResolver
      }
   },
   {
      path: "table/:id",
      component: SplitsGridComponent,
      resolve: {
         results: ResultsResolver
      }
   }
];
