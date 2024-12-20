import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSortModule, Sort } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { Competitor, CourseClass } from "../model";
import { BracketedPipe, FormatTimePipe } from '../model/results-pipes';
import { TimeUtilities } from "../model/time";
import { Navbar } from "../navbar/navbar";
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from "../results-selection.service";
import { ClassMenuButtonComponent } from "../navbar/class-menu-button.component";
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
    selector: "app-splits-grid",
    templateUrl: "./results-table.html",
    styleUrls: ["./results-table.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatSlideToggleModule, MatTableModule, MatSortModule, Navbar, FormatTimePipe, BracketedPipe, ClassMenuButtonComponent, MatCheckboxModule]
})
export class ResultsTable implements OnInit {
   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);

   course = this.rs.course;
   oclass = this.rs.oclass;

   sortState = signal<Sort>({ active: '', direction: '' });

   /** Column definitions columns */
   staticColumns = ["position", "name", "total"];

   courseToggle = new FormControl<boolean>(true);
   colorToggle = new FormControl<boolean>(true);
   selectedToggle = new FormControl<boolean>(false);

   selectedOnly = toSignal(this.selectedToggle.valueChanges, { initialValue: false });

   splitsColumns = computed(() =>
      this.course() ?
         Array.from({ length: this.course().numSplits }, (x, i) => i.toString()) : []
   );

   displayedColumns = computed(() => [...this.staticColumns, ...this.splitsColumns()]);

   tableData = computed<Competitor[]>(() => {
      const r = this.rd.results();

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

   ngOnInit() {

      this.courseToggle.valueChanges.subscribe((courseDisplayed: boolean) => {
         this.rs.setCourseOrClass(courseDisplayed);
      });
   }

   /** Returns color om a red/green color scale for a given percentage along the scale */
   private colorScale(percent: number): string {
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
   cellColor(enabled: boolean, control: number, competitor: Competitor): string {

      let ret: string;
      const maxLoss = 180;
      const maxGain = 100;

      if (enabled && competitor.timeLosses) {
         let percent = (maxLoss - competitor.timeLosses[control]) * 100 / (maxLoss + maxGain);
         percent = Math.min(percent, 100);
         percent = Math.max(percent, 0);
         ret = this.colorScale(percent);
      } else {
         ret = 'rgb(255,255,255)';
      }
      return ret;
   }

   updateSelectedCompetitor(competitor: Competitor) {
      this.rs.toggleCompetitor(competitor);
   }

   /** Format title for split time */
   splitTitle(index: number): string {
      // eslint-disable-next-line radix
      if (index === 0) {
         return 'S-1';
      } else if (index === this.course().numSplits) {
         return (index.toString() + '-F');
      } else {
         let ret = (index + 1).toString();
         if (this.course().hasControls) {
            ret = ret + ' (' + this.course().controls[index].toString() + ')';
         }
         return ret;
      }
   }

   getTimeOrStatus(competitor: Competitor): string {
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

   applySort(sortState: Sort, competitors: Competitor[]) {

      if (sortState.direction) {
         console.log(`Sorting ${sortState.active} ${sortState.direction} ending`);
      } else {
         console.log('Sorting cleared');
      }

      if (!sortState.direction || sortState.active == 'position)') {
         competitors.sort((c1, c2) => Competitor.compareCompetitors(c1, c2));
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
