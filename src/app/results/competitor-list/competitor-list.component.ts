import { Component, inject, viewChild } from '@angular/core';
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from '../results-selection.service';
import { MatListModule, MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { Utils } from 'app/shared';
import { TimeUtilities } from '../model';

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

  list = viewChild(MatSelectionList);


  selectionChanged(change: MatSelectionListChange) {

  }

  formatTime( t: number): string{
    return TimeUtilities.formatTime(t);
  }

}
