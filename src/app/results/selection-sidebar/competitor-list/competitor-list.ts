/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { FormatTimePipe } from "../../model/results-pipes";
import { ResultsDataService } from '../../results-data.service ';
import { ResultsSelectionService } from '../../results-selection.service';
import { MatIconModule } from '@angular/material/icon';
import { ColoredCircle } from "./colored-circle";
import { Competitor } from 'app/results/model';
import { CourseOrClassCheckbox } from './course-or-class';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-competitor-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule, FormatTimePipe, MatButtonModule, MatIconModule, ColoredCircle, CourseOrClassCheckbox],
  templateUrl: './competitor-list.html',
  styleUrl: './competitor-list.scss'
})
export class CompetitorList {

  rd = inject(ResultsDataService);
  rs = inject(ResultsSelectionService);

  showCrossing = input.required<boolean>();

  toggleSelected(comp: Competitor) {
    this.rs.toggleCompetitor(comp);
  }

  selectCrossingRunners() {
    if (this.rs.selectedCompetitors().length> 0) {
      const comp = this.rs.selectedCompetitors()[0];

      this.rs.selectCrossingRunners(comp);
    }

  }

  timeBehind( comp: Competitor): number{
    if (this.rs.displayedCompetitors().length === 0) {
      return 0;
    } else {
      return comp.totalTime - this.rs.displayedCompetitors()[0].totalTime;
    }
  }
}
