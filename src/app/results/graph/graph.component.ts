import { Component, OnInit, ElementRef, ViewEncapsulation, ChangeDetectionStrategy, AfterViewInit } from "@angular/core";
import { OEvent } from "app/model/oevent";
import { ActivatedRoute, Params } from "@angular/router";

import { ResultsSelectionService } from "app/results/results-selection.service";

import { displayGraph, removeGraph } from "app/results/graph/splitsbrowser/splitsbrowser";
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
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GraphComponent implements AfterViewInit {

  results: Results;
  viewer: any;
  loading = false;

  constructor(private route: ActivatedRoute,
    private rs: ResultsSelectionService,
    private dialog: DialogsService) {
  }

  ngAfterViewInit() {
    this.route.params.subscribe(async (params: Params) => {
      try {
        this.loading = true;
        removeGraph();
        // load results for the event Id
        await this.rs.setSelectedEventByKey(params["id"]);
      } catch (e) {
        // Display a dialog with the error
        this.dialog.message('Error loading results', 'Error loading results ' + e.message);
      } finally {
        this.loading = false;
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

