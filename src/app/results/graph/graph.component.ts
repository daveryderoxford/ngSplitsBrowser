import { ChangeDetectionStrategy, Component, ViewEncapsulation, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { DialogsService } from '../../shared';
import { displayGraph } from "./splitsbrowser/splitsbrowser";
import { Results } from "app/results/model";
import { ResultsSelectionService } from "../results-selection.service";
import { OEvent } from "app/model";

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
  oevent: OEvent;

  constructor(private route: ActivatedRoute,
    private rs: ResultsSelectionService,
    private dialog: DialogsService) {
  }


  ngOnInit() {
    this.rs.selectedEvent.subscribe( oevent => this.oevent = oevent );

    this.rs.selectedResults.subscribe( results  => {
      if (results) {
        console.log('Graph First comp ' + results.allCompetitors[0].name);
        displayGraph(results, { containerElement: "app-graph" });
      } else {
        console.log('graph componennt null results');
      }
    });
/*
    this.route.data
      .subscribe((data: { results: Results }) => {
        const results = data.results;
        if (results) {
          console.log('Graph First comp ' + results.allCompetitors[0].name);
          displayGraph(results, { containerElement: "app-graph" });
        }
      }); */
  }
}
