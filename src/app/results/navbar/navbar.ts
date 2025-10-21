import { ChangeDetectionStrategy, Component, computed, inject, input, TemplateRef } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from '@angular/material/toolbar';
import { ComparisionOption } from 'app/results/graph/splitsbrowser/comparision-options';
import { ResultsView, resultsViews } from "../model/results-view";
import { ResultsDataService } from '../results-data.service ';
import { ResultsPageState } from '../results-page-state';
import { ResultsSelectionService } from "../results-selection.service";
import { ResultsViewButtonComponent } from "./results-view-button.component";
import { SidenavButton } from "../../shared/components/sidenav-button";
import { SearchIconButton } from "../search/results-search-button";

@Component({
    selector: "app-results-navbar",
    templateUrl: "./navbar.html",
    styleUrls: ["./navbar.scss"],
    imports: [MatToolbarModule, MatIconModule, ResultsViewButtonComponent, SidenavButton, SearchIconButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  public rs = inject(ResultsSelectionService);
  public rd = inject(ResultsDataService);
  public pageState = inject(ResultsPageState);

  oevent = input<string>();
  settings = input<TemplateRef<any>>;

  hasStartTimes = computed(() => this.rs.oclass().competitors.some(comp => comp.hasStartTime ));

  views = computed(() => resultsViews.filter(view => view.type !== 'race' || this.hasStartTimes()));

  compareWith: ComparisionOption;

  viewSelected(view: ResultsView) {
    console.log('Results navbar.  view seleted ' + view.name);
    this.pageState.navigateToPage(view, this.rd.event().key);
  }
}
