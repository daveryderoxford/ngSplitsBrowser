import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from '@ngneat/until-destroy';
import { OEvent } from "app/model";
import { Results } from "app/results/model";
import { DialogsService } from '../../shared';
import { ResultsSelectionService } from "../results-selection.service";
import { displayGraph } from "./splitsbrowser/splitsbrowser";
import { ResultsNavbarComponent } from "../results-navbar/results-navbar.component";

interface SplitsBrowserOptions {
  defaultLanguage?: boolean;
  containerElement?: string;
  topBar?: string;
}

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: "app-graph",
    templateUrl: "./graph.component.html",
    styleUrls: ["./graph.component.scss"],
    // To avoid angular re-writting style names that will be used by graphs view.
    // These styles will just get appended to the global styles file
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ResultsNavbarComponent]
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
