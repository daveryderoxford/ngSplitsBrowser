import { Component, OnInit, input, inject, TemplateRef } from "@angular/core";
import { resultsViews, ResultsView } from "../model/results-view";
import { ResultsSelectionService } from "../results-selection.service";
import { ComparisionOption } from 'app/results/graph/splitsbrowser/comparision-options';
import { ResultsSearch } from "../results-search/results-search.";
import { ClassMenuButtonComponent } from "./class-menu-button.component";
import { AsyncPipe } from "@angular/common";
import { ResultsViewButtonComponent } from "./results-view-button.component";
import { RouterLink } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { ResultsDataService } from '../results-data.service ';
import { MatToolbarModule } from '@angular/material/toolbar';
import { OEvent } from 'app/events/model/oevent';

@Component({
  selector: "app-results-navbar",
  templateUrl: "./navbar.html",
  styleUrls: ["./navbar.scss"],
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, RouterLink, ResultsViewButtonComponent, ClassMenuButtonComponent, ResultsSearch, AsyncPipe]
})
export class Navbar {
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
}
