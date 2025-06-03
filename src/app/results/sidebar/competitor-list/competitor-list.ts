import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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

  toggleSelected(comp: Competitor) {
    this.rs.toggleCompetitor(comp);
  }
  
  timeBehind( comp: Competitor): number{
    if (this.rs.displayedCompetitors().length === 0) {
      return 0;
    } else {
      return comp.totalTime - this.rs.displayedCompetitors()[0].totalTime;
    }
  }
}
