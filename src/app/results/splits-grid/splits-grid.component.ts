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

  private rgbString(r: number, g: number, b: number): string {
    return 'rgb(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ')';
  }


 private perc2color(perc: number): string {
    let r, g, b = 0;
    if (perc < 50) {
      r = 255;
      g = Math.round(5.1 * perc);
    } else {
      g = 255;
      r = Math.round(510 - 5.10 * perc);
    }
    const h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
  }

  /** select cell color based on time loss */
  cellColor(control: number, competitor: Competitor): string {

    let ret: string;

    if (this.colorCells && competitor.timeLosses) {

      let percent = 100 - 100 / (180 + 60) * competitor.timeLosses[control];
      percent = Math.min(percent, 100);
      percent = Math.max(percent, 0);
      ret = this.perc2color(percent);
       /*
      const b = 200;
      const g = 200;

      if (competitor.timeLosses[control] > 0) {

        let r = 255 - (255 - 150) / 180 * competitor.timeLosses[control];
        r = Math.round(r);
        r = Math.min(255, r);
        ret = this.rgbString(r, g, b);
      } else {
        ret = 'rgb(255,255,255)';
      } */
    } else {
      ret = 'rgb(255,255,255)';
    }
    return ret;
  }

  updateSelectedCompetitor() { }

  updateSelectedControl() { }

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

  formatTime(time: sbTime) {
    return TimeUtilities.formatTime(time);
  }
}
