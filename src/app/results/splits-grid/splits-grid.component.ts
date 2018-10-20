import { Component, OnInit, ViewChild } from "@angular/core";
import { ResultsSelectionService } from "../results-selection.service";
import {
   Results,
   Course,
   Competitor,
   CourseClass,
   sbTime,
   TimeUtilities
} from "../model";
import { SelectionModel } from "@angular/cdk/collections";
import { MatSort, MatTableDataSource } from "@angular/material";
import { FormControl } from "@angular/forms";

@Component({
   selector: "app-splits-grid",
   templateUrl: "./splits-grid.component.html",
   styleUrls: ["./splits-grid.component.scss"]
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

   @ViewChild(MatSort) sort: MatSort;

   constructor(private rs: ResultsSelectionService) { }

   ngOnInit() {

      this.dataSource.sort = this.sort;

      // Subecribed to updates from results selection
      this.rs.selectedResults.subscribe(results => this.selectedResultsUpdated(results));
      this.rs.selectedCourse.subscribe(course => this.selectedCourseUpdated(course));
      this.rs.selectedClass.subscribe(oclass => this.selectedClassesUpdated(oclass));

      /// Update resukts seelction when user changed form controls
      this.classSelect.valueChanges.distinctUntilChanged().subscribe( (courseClass: CourseClass) => {
         this.rs.selectClass(courseClass);
      });

      this.courseToggle.valueChanges.distinctUntilChanged().subscribe( (showCourses: boolean) => {
         this.rs.displayAllCourseCompetitors(showCourses);
      });


   }

   private selectedResultsUpdated(results: Results) {
      this.results = results;
   }

   private selectedCourseUpdated(course: Course) {
      this.course = course;

      // Created a column for each control for the course
      if (course) {
         this.splitsColumns = Array.from({ length: course.numSplits }, (x, i) =>
            i.toString()
         );

         this.displayedColumns = [...this.staticColumns, ...this.splitsColumns];
      }
   }

   selectedClassesUpdated(classes) {
      // When lass is updated then set the


      if (this.results && this.results.classes && this.results.classes.length > 0) {
         this.dataSource = new MatTableDataSource(this.results.classes[0].competitors);
         this.dataSource.sort = this.sort;

         this.oclass = this.results.classes[0];

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

   updateSelectedCompetitor(competitor: Competitor) {
      this.selectedCompetitors.toggle(competitor);
   }


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
