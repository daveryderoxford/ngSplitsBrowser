import { Component, OnInit, input, inject, TemplateRef } from "@angular/core";
import { OEvent, } from "app/model";
import { resultsViews, ResultsView } from "../model/results-view";
import { ResultsSelectionService } from "../results-selection.service";
import { ComparisionOption } from 'app/results/graph/splitsbrowser/comparision-options';
import { ResultsSearchComponent } from "../results-search/results-search.component";
import { CompareWithComponent } from "./compare-with.component";
import { ClassMenuButtonComponent } from "./class-menu-button.component";
import { AsyncPipe } from "@angular/common";
import { ResultsViewButtonComponent } from "./results-view-button.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { ResultsDataService } from '../results-data.service ';

@Component({
  selector: "app-results-navbar",
  templateUrl: "./results-navbar.component.html",
  styleUrls: ["./results-navbar.component.scss"],
  standalone: true,
  imports: [MatIconModule, RouterLink, ResultsViewButtonComponent, ClassMenuButtonComponent, CompareWithComponent, ResultsSearchComponent, AsyncPipe]
})
export class ResultsNavbarComponent {
  public rs = inject(ResultsSelectionService);
  public rd = inject(ResultsDataService);

  oevent = input<OEvent>();
  settings = input<TemplateRef<any>>;

  resultsViews: ResultsView[] = resultsViews;
  compareWith: ComparisionOption;

  viewSelected(view: ResultsView) {
    console.log('Results navbar.  view seleted ' + view.name);
    this.rd.setResultsView(view);
  }

  onCompareWith(option: ComparisionOption) {
    // TODO
  }
}
