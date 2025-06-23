import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResultsError } from 'app/results/loading/results-error';
import { ResultsLoading } from 'app/results/loading/results-loading';
import { Navbar } from 'app/results/navbar/navbar';
import { ResultsDataService } from 'app/results/results-data.service ';
import { ResultsPageState } from 'app/results/results-page-state';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { Sidebar } from 'app/results/selection-sidebar/sidebar';
import { SelectionSidebarButton } from "../../selection-sidebar/selection-sidebar-button";
import { StatsPanel } from "../stats-panel/stats-panel";

@Component({
    selector: 'app-stats-page',
  imports: [
      Navbar, 
      MatButtonToggleModule, 
      StatsPanel, 
      Sidebar, 
      SelectionSidebarButton,
      ResultsLoading,
      ResultsError
    ],
    templateUrl: './stats-page.html',
    styleUrl: './stats-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPage {
  ps = inject(ResultsPageState);

  readonly views = ['Splits', 'Leg'];

  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);

  statsView = signal<string>('overall');

  id = input.required<string>();  // Route parameter

  constructor() {
    effect(() => {
      this.rd.setSelectedEvent(this.id());
      this.ps.setDisplayedPage('stats');

    });
  }

  buttonClicked(view: string) {
    this.statsView.set(view);
  }

}
