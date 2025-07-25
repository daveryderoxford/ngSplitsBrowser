import { ChangeDetectionStrategy, Component, effect, inject, input, signal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ResultsError } from 'app/results/loading/results-error';
import { ResultsLoading } from 'app/results/loading/results-loading';
import { Navbar } from 'app/results/navbar/navbar';
import { ResultsDataService } from 'app/results/results-data.service ';
import { ResultsPageState } from 'app/results/results-page-state';
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
   private ps = inject(ResultsPageState);
   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);

   id = input.required<string>();  // Route parameter
   eventName = input<string>("");  // Route parameter
   eventDate = input<Date>();   // Route parameter

   constructor() {
      effect(() => {
         const eventId = this.id();
         const name = this.eventName();
         const date = this.eventDate() ? new Date(this.eventDate()) : undefined;

         this.rd.setSelectedEvent(eventId, name, date);
         this.ps.setDisplayedPage('stats');
      });
   }
}
