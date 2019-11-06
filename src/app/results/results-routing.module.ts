import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GraphComponent } from "./graph/graph.component";
import { ResultsResolver } from './results.resolver';
import { SplitsGridComponent } from './splits-grid/splits-grid.component';

const routes: Routes = [
   {
      path: '',
      component: GraphComponent,
      children: [
         {
            path: ":id",
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
         },
         { path: "table", component: SplitsGridComponent }
      ]
   }
];

@NgModule( {
   imports: [RouterModule.forChild( routes )],
   exports: [RouterModule]
} )
export class ResultsRoutingModule { }
