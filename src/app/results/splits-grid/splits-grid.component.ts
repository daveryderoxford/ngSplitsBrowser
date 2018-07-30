import { Component, OnInit, ViewChild } from "@angular/core";
import { ResultsSelectionService } from "app/results/results-selection.service";
import {
   Results,
   Course,
   Competitor,
   CourseClass,
   sbTime,
   TimeUtilities
} from "app/results/model";
import { SelectionModel } from "@angular/cdk/collections";
import { MatSort, MatTableDataSource } from "@angular/material";

@Component({
   selector: "app-splits-grid",
   templateUrl: "./splits-grid.component.html",
   styleUrls: ["./splits-grid.component.scss"]
})
export class SplitsGridComponent implements OnInit {
   results: Results;
   course: Course;
   dataSource = new MatTableDataSource<Competitor>([]);

   selectedControl = new SelectionModel<number>(false, null);
   selectedCompetitors = new SelectionModel<Competitor>(true, null);

   /** Column definitions columns */
   staticColumns = ["position", "name", "total"];
   displayedColumns: string[] = [];
   splitsColumns: string[] = [];

   colorCells = true;

   @ViewChild(MatSort) sort: MatSort;


   constructor(private rs: ResultsSelectionService) { }

   ngOnInit() {

      this.dataSource.sort = this.sort;

      this.rs.selectedResults.subscribe(results => this.selectedResultsUpdated(results));

      this.rs.selectedCourse.subscribe(course => this.selectedCourseUpdated(course));

      this.rs.selectedClasses.subscribe(classes => this.selectedClassesUpdated(classes));

   }

   private selectedResultsUpdated(results: Results) {
      this.results = results;
   }

   private selectedCourseUpdated(course: Course) {
      this.course = course;

      if (course) {
         this.splitsColumns = Array.from({ length: course.numSplits }, (x, i) =>
            i.toString()
         );

         this.displayedColumns = [...this.staticColumns, ...this.splitsColumns];
      }
   }

   selectClass(courseClass: CourseClass) {
      this.rs.selectClass(courseClass);
   }

   selectedClassesUpdated(classes) {

      if (this.results && this.results.classes && this.results.classes.length > 0) {
         this.dataSource = new MatTableDataSource(this.results.classes[0].competitors);
         this.dataSource.sort = this.sort;

         //  const oclass = this.results.classes.find(c => c.name === classes[0].name);
         //  this.dataSource = oclass.competitors;
      } else {
         this.dataSource = new MatTableDataSource([]);
      }
   }

   /** Returns color om a red/green color scale for a given percentage along the scale */
   private colorScale(percent: number): string {
      let r, g = 0;
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

   updateSelectedCompetitor() { }

   updateSelectedControl() { }

   /** Format title for split time */
   splitTitle(indexStr: string): string {
      const index = Number.parseInt(indexStr);
      if (index === 0) {
         return 'S-1';
      } else if (index === this.course.numSplits) {
         return (indexStr + '-F');
      } else {
         return (index + 1).toString();
      }
   }

   /** Format splitsbrowser time string */
   formatTime(time: sbTime) {
      return TimeUtilities.formatTime(time);
   }
}
