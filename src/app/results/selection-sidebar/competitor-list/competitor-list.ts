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
import { UNRANKED_VALUE } from 'app/results/model/ranking';
import { SearchIconButton } from "app/results/search/results-search-button";

@Component({
  selector: 'app-competitor-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListModule,
    FormatTimePipe,
    MatButtonModule,
    MatIconModule,
    ColoredCircle,
    CourseOrClassCheckbox,
    SearchIconButton],
  templateUrl: './competitor-list.html',
  styleUrl: './competitor-list.scss'
})
export class CompetitorList {

  rd = inject(ResultsDataService);
  rs = inject(ResultsSelectionService);

  showCrossing = input.required<boolean>();

  compSelected = computed(() => this.rs.selectedCompetitors().length > 0);

  selectedColor = computed( () => this.compSelected() ? '#000000' : '#FF0000');
  selectedText = computed( () => this.compSelected() ? 'X' : String.fromCharCode(0x2713));

  selectOrClear() {
    if (this.compSelected()) {
      this.rs.clearCompetitors()
    } else {
      this.rs.selectAll()
    }
  }

  toggleSelected(comp: Competitor) {
    this.rs.toggleCompetitor(comp);
  }

  selectCrossingRunners() {
    if (this.compSelected()) {
      const comp = this.rs.selectedCompetitors()[0];

      this.rs.selectCrossingRunners(comp);
    }
  }

  protected position(comp: Competitor): string {
    const pos = this.rs.courseOrClass() ? comp.coursePosition : comp.classPosition;
    return (pos === UNRANKED_VALUE) ? '' : pos.toString();
  }

  timeBehind(comp: Competitor): number {
    if (this.rs.displayedCompetitors().length === 0) {
      return 0;
    } else {
      return comp.totalTime - this.rs.displayedCompetitors()[0].totalTime;
    }
  }
}
