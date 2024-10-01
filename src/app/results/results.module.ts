import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { GraphComponent } from "./graph/graph.component";
import { ClassMenuButtonComponent } from './results-navbar/class-menu-button.component';
import { CompareWithComponent } from './results-navbar/compare-with.component';
import { ResultsNavbarComponent } from "./results-navbar/results-navbar.component";
import { ResultsViewButtonComponent } from './results-navbar/results-view-button.component';
import { ResultsRoutingModule } from './results-routing.module';
import { ResultsSearchComponent } from "./results-search/results-search.component";
import { ResultsViewComponent } from "./results-view/results-view.component";
import { SplitsGridComponent } from './splits-grid/splits-grid.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ResultsRoutingModule,
        SharedModule,
        GraphComponent,
        ResultsViewComponent,
        ResultsNavbarComponent,
        ResultsSearchComponent,
        SplitsGridComponent,
        ResultsViewButtonComponent,
        CompareWithComponent,
        ClassMenuButtonComponent
    ],
    exports: [
        GraphComponent,
        SplitsGridComponent
    ]
})
export class ResultsModule { }
