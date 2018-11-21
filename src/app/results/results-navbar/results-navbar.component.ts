import { Component, OnInit, Input } from "@angular/core";
import { OEvent } from "app/model";
import { resultsViews, ResultsView } from "../model/results-view";
import { ResultsSelectionService } from "../results-selection.service";
import { HighlightSpanKind } from "typescript";
import { Observable } from "rxjs";

@Component({
  selector: "app-results-navbar",
  templateUrl: "./results-navbar.component.html",
  styleUrls: ["./results-navbar.component.scss"]
})
export class ResultsNavbarComponent implements OnInit {

  @Input() oevent: OEvent;

  displayOptions: Array<string> = [];

  resultsViews: ResultsView[];

  constructor(public rs: ResultsSelectionService) {
    this.resultsViews = resultsViews;
  }

  ngOnInit() {
  }

  viewSelected(view: ResultsView) {
    console.log('Results navbar.  view seleted ' + view.name);
    this.rs.setResultsView(view);
  }
}
