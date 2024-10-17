
import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, UntypedFormControl, ReactiveFormsModule } from "@angular/forms";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource as MatTableDataSource, MatTableModule } from "@angular/material/table";
import { UntilDestroy } from '@ngneat/until-destroy';
import { Competitor, Course, CourseClass, Results, sbTime, TimeUtilities } from "../model";
import { ResultsSelectionService } from "../results-selection.service";
import { Repairer } from '../model/repairer';
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatOptionModule } from "@angular/material/core";
import { NgStyle, NgClass } from "@angular/common";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ResultsSearchComponent } from "../results-search/results-search.component";

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-splits-grid",
    templateUrl: "./splits-grid.component.html",
    styleUrls: ["./splits-grid.component.scss"],
    standalone: true,
    imports: [ResultsSearchComponent, MatFormFieldModule, MatSelectModule, ReactiveFormsModule, MatOptionModule, MatSlideToggleModule, MatTableModule, NgStyle, NgClass]
})
export class SplitsGridComponent implements OnInit {
   results: Results;
   course: Course;
   oclass: CourseClass;
   dataSource = new MatTableDataSource<Competitor>([]);

   selectedControl = new SelectionModel<number>(false, null);
   selectedCompetitors = new SelectionModel<Competitor>(true, null);

   /** Column definitions columns */
   staticColumns = ["position", "name", "total"];
   displayedColumns: string[] = [];
   splitsColumns: string[] = [];

   classSelect = new FormControl<CourseClass>(undefined);
   courseToggle = new FormControl<boolean>(true);
   colorToggle = new FormControl<boolean>(true);

   @ViewChild(MatSort) sort: MatSort;

   constructor(private rs: ResultsSelectionService) { }

   ngOnInit() {

      this.dataSource.sort = this.sort;

      // Subecribed to updates from results selection
      this.rs.selectedResults.subscribe(results => this.selectedResultsUpdated(results));
      this.rs.selectedCourse.subscribe(course => this.selectedCourseUpdated(course));
      this.rs.selectedClass.subscribe(oclass => this.selectedClassUpdated(oclass));

      // Update results seelction when user changed form controls
      this.classSelect.valueChanges.subscribe( (courseClass: CourseClass) => {
         this.rs.selectClass(courseClass);
      });

      this.courseToggle.valueChanges.subscribe( (courseDisplayed: boolean) => {
         this.rs.displayAllCourseCompetitors(courseDisplayed);
      });
   }

   private selectedResultsUpdated(results: Results) {

      // TO temp repairt here - should be moved ot where we read the results
      if (results.needsRepair()) {
         Repairer.repairEventData(results);
      }

      results.determineTimeLosses();

      this.results = results;
   }

   private selectedCourseUpdated(course: Course) {
      this.course = course;

      // Create a column for each control for the course
      if (course) {
         console.log("*****course updated" + course.name);
         console.log("numsplits: "+ course.numSplits);
         this.splitsColumns = Array.from({ length: course.numSplits }, (x, i) =>
            i.toString()
         )

         this.displayedColumns = [...this.staticColumns, ...this.splitsColumns];
      } else {
         console.log("*****course null");
      }
   }

   selectedClassUpdated(oclass: CourseClass) {

      this.oclass = oclass;

      if (oclass) {
         this.dataSource = new MatTableDataSource(oclass.competitors);
         this.dataSource.sort = this.sort;
      } else {
         this.dataSource = new MatTableDataSource([]);
      }
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
      this.selectedCompetitors.toggle(competitor);
   }

   /** Format title for split time */
   splitTitle(index: number): string {
      // eslint-disable-next-line radix
      if (index === 0) {
         return 'S-1';
      } else if (index === this.course.numSplits) {
         return (index.toString() + '-F');
      } else {
         let ret = (index + 1).toString();
         if ( this.course.hasControls ) {
            ret = ret + ' (' + this.course.controls[index].toString() + ')';
         }
         return ret;
      }
   }

   /** Format splitsbrowser time string */
   formatTime(time: sbTime) {
      return TimeUtilities.formatTime(time);
   }
}
