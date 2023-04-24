import { Component, OnInit, Input } from "@angular/core";
import { OEvent,  } from "app/model";
import { resultsViews, ResultsView } from "../model/results-view";
import { ResultsSelectionService } from "../results-selection.service";
import { ComparisionOption } from 'app/results/graph/splitsbrowser/comparision-options';


@Component({
  selector: "app-results-navbar",
  templateUrl: "./results-navbar.component.html",
  styleUrls: ["./results-navbar.component.scss"]
})
export class ResultsNavbarComponent implements OnInit {

  @Input() oevent: OEvent;

  resultsViews: ResultsView[] = resultsViews;
  compareWith: ComparisionOption;

  constructor(public rs: ResultsSelectionService) {}

  ngOnInit() {
  }

  viewSelected(view: ResultsView) {
    console.log('Results navbar.  view seleted ' + view.name);
    this.rs.setResultsView(view);
  }

  onCompareWith(option: ComparisionOption) {
    // TODO
  }

}
