import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DialogsService } from '../../shared';
import { displayGraph } from "./splitsbrowser/splitsbrowser";
import { Results } from "../model";
import { ResultsSelectionService } from "../results-selection.service";


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
export class GraphComponent implements OnInit {

  results: Results;

  constructor(private route: ActivatedRoute,
    private rs: ResultsSelectionService,
    private dialog: DialogsService) {
  }


  ngOnInit() {

    this.route.data
      .subscribe((data: { results: Results }) => {
        const results = data.results;
        if (results) {
          displayGraph(results, { containerElement: "app-graph" });
        }
      });
  }
}
