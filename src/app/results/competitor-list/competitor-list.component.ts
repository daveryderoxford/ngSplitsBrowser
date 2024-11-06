import { Component, inject } from '@angular/core';
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-competitor-list',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './competitor-list.component.html',
  styleUrl: './competitor-list.component.scss'
})
export class CompetitorListComponent {
  rd = inject(ResultsDataService);
  rs = inject(ResultsSelectionService);

}
