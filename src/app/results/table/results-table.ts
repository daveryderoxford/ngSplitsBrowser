import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { ResultsError } from '../loading/results-error';
import { ResultsLoading } from '../loading/results-loading';
import { Competitor } from "../model";
import { BracketedPipe, FormatTimePipe } from '../model/results-pipes';
import { TimeUtilities } from "../model/time";
import { ClassSelect } from "../navbar/class-select";
import { Navbar } from "../navbar/navbar";
import { ResultsDataService } from '../results-data.service ';
import { ResultsPageState } from '../results-page-state';
import { ResultsSelectionService } from "../results-selection.service";
import { ColoredCircle } from '../selection-sidebar/competitor-list/colored-circle';
import { CourseOrClassCheckbox } from '../selection-sidebar/competitor-list/course-or-class';

@Component({
   selector: "app-splits-grid",
   templateUrl: "./results-table.html",
   styleUrls: ["./results-table.scss"],
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatSlideToggleModule, MatTableModule, MatSortModule, Navbar, FormatTimePipe,
      BracketedPipe, ClassSelect, CourseOrClassCheckbox, MatCheckboxModule, ColoredCircle, ResultsLoading, ResultsError]
})
export class ResultsTable {
   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);
   private ps = inject(ResultsPageState);

   course = this.rs.course;
   oclass = this.rs.oclass;

   sortState = signal<Sort>({ active: '', direction: '' });

   /** Column definitions columns */
   staticColumns = ["position", "name", "total"];

   colorCheckbox = new FormControl<boolean>(true);
   selectedCheckbox = new FormControl<boolean>(false);

   selectedOnly = toSignal(this.selectedCheckbox.valueChanges, { initialValue: false });

   splitsColumns = computed(() =>
      this.course() ?
         Array.from({ length: this.course().numSplits }, (_, i) => i.toString()) : []
   );

   displayedColumns = computed(() => [...this.staticColumns, ...this.splitsColumns()]);

   tableData = computed<Competitor[]>(() => {
      if (this.oclass()) {
         const comps = this.selectedOnly() ?
            this.oclass().competitors.filter((comp) => this.rs.isCompetitorSelected(comp)) :
            [...this.oclass().competitors];
         this.applySort(this.sortState(), comps);
         return comps;
      } else {
         return [];
      }
   });

   /** Returns color om a red/green color scale for a given percentage along the scale */
   private _colorScale(percent: number): string {
      let r = 0;
      let g = 0;
      let b = 0;
      if (percent < 50) {
         r = 255;
         g = Math.round(5.1 * percent);
      } else {
         g = 255;
         r = Math.round(510 - 5.10 * percent);
         b = Math.round(510 - 5.10 * percent);
      }
      const h = r * 0x10000 + g * 0x100 + b * 0x1;
      return '#' + ('000000' + h.toString(16)).slice(-6);
   }

   /** Select cell color based on time loss */
   protected cellColor(enabled: boolean, control: number, competitor: Competitor): string {

      let ret: string;
      const maxLoss = 180;
      const maxGain = 100;

      if (enabled && competitor.timeLosses) {
         let percent = (maxLoss - competitor.getTimeLossAt(control)) * 100 / (maxLoss + maxGain);
         percent = Math.min(percent, 100);
         percent = Math.max(percent, 0);
         ret = this._colorScale(percent);
      } else {
         ret = 'rgb(255,255,255)';
      }
      return ret;
   }

   protected updateSelectedCompetitor(competitor: Competitor) {
      this.rs.toggleCompetitor(competitor);
   }

   /** Format title for split time */
   protected splitTitle(index: number): string {
      let ret = '';

      if (index === this.course().numSplits) {
         ret = (index - 1).toString() + '-F';
      } else {
         ret = (index).toString();
         if (this.course()?.hasControls) {
            ret = ret + ' (' + this.course().getControlCode(index) + ')';
         }
      }

      return ret;
   }

   protected getTimeOrStatus(competitor: Competitor): string {
      if (competitor.isNonStarter) {
         return 'DNS';
      } else if (competitor.isNonFinisher) {
         return 'RET';
      } else if (competitor.isDisqualified) {
         return 'DSQ';
      } else if (competitor.isOverMaxTime) {
         return 'Over time';
      } else if (competitor.completed()) {
         return TimeUtilities.formatTime(competitor.totalTime);
      } else {
         return 'mp';
      }
   }

   protected applySort(sortState: Sort, competitors: Competitor[]) {

      if (sortState.direction) {
         console.log(`Sorting ${sortState.active} ${sortState.direction} ending`);
      } else {
         console.log('Sorting cleared');
      }

      if (!sortState.direction || sortState.active == 'position)') {
         competitors.sort(Competitor.compareCompetitors);
      } else {
         const index = parseInt(sortState.active);
         if (sortState.direction == 'asc') {
            competitors.sort((c1, c2) => c1.splitTimes[index] - c2.splitTimes[index]);
         } else {
            competitors.sort((c1, c2) => c2.splitTimes[index] - c1.splitTimes[index]);
         }
      }
   }
}
