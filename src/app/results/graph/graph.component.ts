import { Component, OnInit, ElementRef, ViewEncapsulation } from "@angular/core";
import { OEvent } from "app/model/oevent";
import { ActivatedRoute, Params } from "@angular/router";

import { ResultsSelectionService } from "app/results/results-selection.service";

import { displayGraph } from "app/results/graph/splitsbrowser/splitsbrowser";
import { Results } from "app/results/model";
import { DialogsService } from 'app/dialogs/dialogs.service';


interface SplitsBrowserOptions {
  defaultLanguage?: boolean;
  containerElement?: string;
  topBar?: string;
}

@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.scss"],
  // To avoid angular re-writting style names that will be used by D3.  These styles will just get appende dto the global styles file
  encapsulation: ViewEncapsulation.None
})
export class GraphComponent implements OnInit {

  results: Results;

  constructor(private route: ActivatedRoute,
    private rs: ResultsSelectionService,
    private dialog: DialogsService) {
  }

  ngOnInit() {
    this.route.params.subscribe(async (params: Params) => {
      try {
        // load results for the event Id
        await this.rs.setSelectedEventByKey(params["id"]);
      } catch (e) {
        // Display a dialog with the error
        this.dialog.message('Error loading results', 'Error loading results ' + e.message);
      }
    });
    this.rs.selectedResults.subscribe((results: Results) => this.selectedResultsUpdated(results));

  }

  async selectedResultsUpdated(results: Results) {
    if (results) {
      displayGraph(results, { containerElement: "app-graph" });
    }
  }


}

