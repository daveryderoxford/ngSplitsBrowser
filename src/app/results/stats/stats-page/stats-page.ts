import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResultsError } from 'app/results/loading/results-error';
import { ResultsLoading } from 'app/results/loading/results-loading';
import { Navbar } from 'app/results/navbar/navbar';
import { ResultsDataService } from 'app/results/results-data.service ';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { Sidebar } from 'app/results/selection-sidebar/sidebar';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { SelectionSidebarButton } from "../../selection-sidebar/selection-sidebar-button";
import { SummaryGraph } from '../summary-graph';

@Component({
   selector: 'app-stats-page',
   imports: [
      Navbar,
      MatButtonToggleModule,
      Sidebar,
      SelectionSidebarButton,
      ResultsLoading,
      ResultsError,
      SummaryGraph
   ],
   providers: [
      provideCharts(withDefaultRegisterables())
   ],
   templateUrl: './stats-page.html',
   styleUrl: './stats-page.scss',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsPage {
   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);

}
