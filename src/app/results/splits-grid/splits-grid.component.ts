import { NgClass, NgStyle } from "@angular/common";
import { Component, computed, inject, OnInit, viewChild } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { MatOptionModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSort, MatSortModule, Sort } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { Competitor, CourseClass, sbTime, TimeUtilities } from "../model";
import { ResultsDataService } from '../results-data.service ';
import { ResultsNavbarComponent } from "../results-navbar/results-navbar.component";
import { ResultsSearchComponent } from "../results-search/results-search.component";
import { ResultsSelectionService } from "../results-selection.service";

@Component({
   selector: "app-splits-grid",
   templateUrl: "./splits-grid.component.html",
   styleUrls: ["./splits-grid.component.scss"],
   standalone: true,
   imports: [ResultsSearchComponent, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatOptionModule, MatSlideToggleModule, MatTableModule, MatSortModule, NgStyle, NgClass, ResultsNavbarComponent]
})
export class SplitsGridComponent implements OnInit {
   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);

   results = toSignal(this.rd.selectedResults);
   course = this.rs.selectedCourse;
   oclass = this.rs.selectedClass;

   /** Column definitions columns */
   staticColumns = ["position", "name", "total"];

   classSelect = new FormControl<CourseClass>(undefined);
   courseToggle = new FormControl<boolean>(true);
   colorToggle = new FormControl<boolean>(true);
   selectedToggle = new FormControl<boolean>(false);

   sortHeader = viewChild(MatSort);

   selectedOnly = toSignal(this.selectedToggle.valueChanges, { initialValue: false });

   splitsColumns = computed(() =>
      this.course() ?
         Array.from({ length: this.course().numSplits }, (x, i) => i.toString()) : []
   );

   displayedColumns = computed(() => [...this.staticColumns, ...this.splitsColumns()]);

   tableData = computed<MatTableDataSource<Competitor>>(() => {
      const r = this.results();

      if (this.oclass()) {
         const comps = this.selectedOnly() ?
            this.oclass().competitors.filter((comp) => this.rs.isCompetitorSelected(comp)) :
            this.oclass().competitors;
         const ds = new MatTableDataSource(comps);
         ds.sort = this.sortHeader();
         return ds;
      } else {
         return new MatTableDataSource([]);
      }
   });

   ngOnInit() {

      this.classSelect.valueChanges.subscribe((courseClass: CourseClass) => {
         this.rs.selectClass(courseClass);
      });

      this.courseToggle.valueChanges.subscribe((courseDisplayed: boolean) => {
         this.rs.displayAllCourseCompetitors(courseDisplayed);
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
      this.rs.toggleSelectedSelectedCompetitor(competitor);
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

   sortChanged(sortState: Sort) {
      if (sortState.direction) {
         console.log(`Sorted ${sortState.direction} ending`);
      } else {
         console.log('Sorting cleared');
      }

     /* this.sortedData = data.sort((a, b) => {
         const isAsc = sort.direction === 'asc';
         switch (sort.active) {
            case 'name':
               return compare(a.name, b.name, isAsc);
            case 'calories':
               return compare(a.calories, b.calories, isAsc);
            case 'fat':
               return compare(a.fat, b.fat, isAsc);
            case 'carbs':
               return compare(a.carbs, b.carbs, isAsc);
            case 'protein':
               return compare(a.protein, b.protein, isAsc);
            default:
               return 0;
         } 
      }); */
   }

   /** Format splitsbrowser time string. 
    */
   formatTime(time: sbTime): string {
      return
      !time ? '' : TimeUtilities.formatTime(time);
   }
}
