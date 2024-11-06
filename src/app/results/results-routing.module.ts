import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from "./graph/graph.component";
import { ResultsResolver } from './results.resolver';
import { SplitsGridComponent } from './splits-grid/splits-grid.component';

const routes: Routes = [
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

@NgModule({
   imports: [RouterModule.forChild(routes)],
   exports: [RouterModule]
})
export class ResultsRoutingModule { }
