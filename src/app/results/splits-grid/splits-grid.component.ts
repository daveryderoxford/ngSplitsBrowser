
import { SelectionModel } from "@angular/cdk/collections";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatSort, MatTableDataSource } from "@angular/material";
import { distinctUntilChanged } from 'rxjs/operators';
import { Competitor, Course, CourseClass, Results, sbTime, TimeUtilities } from "../model";
import { ResultsSelectionService } from "../results-selection.service";

@Component({
   selector: "app-splits-grid",
   templateUrl: "./splits-grid.component.html",
   styleUrls: ["./splits-grid.component.scss"],
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

   classSelect = new FormControl();
   courseToggle = new FormControl();
   colorToggle = new FormControl();

   @ViewChild(MatSort, { static: false }) sort: MatSort;

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
      this.results = results;
   }

   private selectedCourseUpdated(course: Course) {
      this.course = course;

      // Create a column for each control for the course
      if (course) {
         this.splitsColumns = Array.from({ length: course.numSplits }, (x, i) =>
            i.toString()
         );

         this.displayedColumns = [...this.staticColumns, ...this.splitsColumns];
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
   splitTitle(indexStr: string): string {
      // tslint:disable-next-line:radix
      const index = Number.parseInt(indexStr);
      if (index === 0) {
         return 'S-1';
      } else if (index === this.course.numSplits) {
         return (indexStr + '-F');
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
