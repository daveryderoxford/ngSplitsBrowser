import { Component, inject, input, TemplateRef } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { OEvent } from 'app/events/model/oevent';
import { ComparisionOption } from 'app/results/graph-page/splitsbrowser/comparision-options';
import { ResultsView, resultsViews } from "../model/results-view";
import { ResultsDataService } from '../results-data.service ';
import { ResultsPageState } from '../results-page-state';
import { ResultsSelectionService } from "../results-selection.service";
import { ResultsViewButtonComponent } from "./results-view-button.component";
import { SidenavButtonComponent } from "../../shared/components/sidenav-button.component";
import { SearchIconButtonComponent } from "../results-search/results-search-button";

@Component({
    selector: "app-results-navbar",
    templateUrl: "./navbar.html",
    styleUrls: ["./navbar.scss"],
    imports: [MatToolbarModule, MatIconModule, ResultsViewButtonComponent, SidenavButtonComponent, SearchIconButtonComponent]
})
export class Navbar {
  public rs = inject(ResultsSelectionService);
  public rd = inject(ResultsDataService);
  public pageState = inject(ResultsPageState);

  oevent = input<OEvent>();
  settings = input<TemplateRef<any>>;

  resultsViews: ResultsView[] = resultsViews;
  compareWith: ComparisionOption;

  viewSelected(view: ResultsView) {
    console.log('Results navbar.  view seleted ' + view.name);
    this.pageState.setPage(view, this.rd.event());
  }
}
