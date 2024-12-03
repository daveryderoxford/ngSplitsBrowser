import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FormatTimePipe } from "../model/results-pipes";
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';

@Component({
  selector: 'app-competitor-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, FormatTimePipe],
  templateUrl: './competitor-list.html',
  styleUrl: './competitor-list.scss'
})
export class CompetitorList {

  rd = inject(ResultsDataService);
  rs = inject(ResultsSelectionService);

}
