import { Component, input } from '@angular/core';
import { Competitor } from 'app/results/model';
import { FormatTimePipe } from "../../model/results-pipes";
import { SummaryGraph } from '../summary-graph';

export type StatsGraphType = 'splits' | 'leg';

@Component({
    selector: 'app-stats-panel',
    imports: [FormatTimePipe, SummaryGraph],
    templateUrl: './stats-panel.html',
    styleUrl: './stats-panel.scss'
})
export class StatsPanel {
  competitor = input.required<Competitor>();
  graphtype = input<StatsGraphType>('splits');

}
