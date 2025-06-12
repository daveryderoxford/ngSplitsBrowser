import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Navbar } from 'app/results/navbar/navbar';
import { ResultsDataService } from 'app/results/results-data.service ';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { Sidebar } from 'app/results/selection-sidebar/sidebar';
import { SelectionSidebarButton } from "../../selection-sidebar/selection-sidebar-button";
import { StatsPanel } from "../stats-panel/stats-panel";

@Component({
    selector: 'app-stats-page',
  imports: [Navbar, MatButtonToggleModule, StatsPanel, Sidebar, SelectionSidebarButton],
    templateUrl: './stats-page.html',
    styleUrl: './stats-page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPage {

  readonly views = ['Splits', 'Leg'];

  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);

  statsView = signal<string>('overall');

  buttonClicked(view: string) {
    this.statsView.set(view);
  }

}
