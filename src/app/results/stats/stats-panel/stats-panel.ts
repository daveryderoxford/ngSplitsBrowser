import { Component, input } from '@angular/core';
import { Competitor } from 'app/results/model';
import { FormatTimePipe } from "../../model/results-pipes";

@Component({
  selector: 'app-stats-panel',
  standalone: true,
  imports: [FormatTimePipe],
  templateUrl: './stats-panel.html',
  styleUrl: './stats-panel.scss'
})
export class StatsPanel {
  competitor = input.required<Competitor>();
}
