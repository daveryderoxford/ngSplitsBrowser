import { Component, OnInit } from "@angular/core";
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
/*
interface TableColumnDef {
  columnDef: string;
  header: string;
  cell: (row: Competitor) => string;
} */

@Component({
  selector: "app-splits-grid",
  templateUrl: "./splits-grid.component.html",
  styleUrls: ["./splits-grid.component.scss"]
})
export class SplitsGridComponent implements OnInit {
  results: Results;
  course: Course;
  dataSource: Competitor[] = [];

  selectedControl = new SelectionModel<number>(false, null);
  selectedCompetitors = new SelectionModel<Competitor>(true, null);

  /** Column definitions columns */
  staticColumns = ["position", "name", "total"];
  displayedColumns: string[] = [];
  splitsColumns: string[] = [];


  //  splitsColumnDefs: TableColumnDef[] = [];

  constructor(private rs: ResultsSelectionService) {}

  ngOnInit() {
    this.rs.selectedResults.subscribe(results => (this.results = results));

    this.rs.selectedCourse.subscribe(course =>
      this.selectedCourseUpdated(course)
    );
    this.rs.selectedClasses.subscribe(classes =>
      this.selectedClassesUpdated(classes)
    );
  }

  selectedCourseUpdated(course: Course) {
    this.course = course;


    if (course) {
    this.splitsColumns = Array.from({ length: course.numControls }, (x, i) =>
      i.toString()
    );

    this.displayedColumns = [...this.staticColumns, ...this.splitsColumns];
  }

    /*
    // Add column for each control
    this.splitsColumnDefs = [];

    for (let i = 0; i < course.controls.length; i++) {
      const col = {
        columnDef: i.toString(),
        header: i.toString(),
        cell: (comp: Competitor) => {
          const ret = TimeUtilities.formatTime(comp.splitTimes[i]);
          return ret;
        }
      };
      this.splitsColumnDefs.push(col);
    }

    /* Column definitions in order
    this.displayedColumns = [
      ...this.staticColumns,
      ...this.splitsColumnDefs.map(x => x.columnDef)
    ]; */
  }

  selectClass(courseClass: CourseClass) {
    this.rs.selectClass(courseClass);
  }

  selectedClassesUpdated(classes) {
    if (classes && classes.length > 0) {
      const oclass = this.results.classes.find(c => c.name === classes[0].name);
      this.dataSource = oclass.competitors;
    } else {
      this.dataSource = [];
    }
  }

  updateSelectedCompetitor() {}

  updateSelectedControl() {}
}
