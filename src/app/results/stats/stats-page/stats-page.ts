import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { CompetitorList } from 'app/results/sidebar/competitor-list/competitor-list';
import { Navbar } from 'app/results/navbar/navbar';
import { ResultsDataService } from 'app/results/results-data.service ';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { StatsPanel } from "../stats-panel/stats-panel";

@Component({
  selector: 'app-stats-page',
  standalone: true,
  imports: [Navbar, CompetitorList, StatsPanel],
  templateUrl: './stats-page.html',
  styleUrl: './stats-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsPage {
  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);

}
