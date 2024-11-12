import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from '@ngneat/until-destroy';
import { OEvent } from "app/model";
import { Results } from "app/results/model";
import { DialogsService } from '../../shared';
import { ResultsSelectionService } from "../results-selection.service";
import { displayGraph } from "./splitsbrowser/splitsbrowser";
import { ResultsNavbarComponent } from "../results-navbar/results-navbar.component";
import { ResultsDataService } from '../results-data.service ';
import { CompetitorListComponent } from '../competitor-list/competitor-list.component';

interface SplitsBrowserOptions {
  defaultLanguage?: boolean;
  containerElement?: string;
  topBar?: string;
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: "app-graph",
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.scss"],
  // To avoid angular re-writting style names that will be used by graphs view.
  // These styles will just get appended to the global styles file
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ResultsNavbarComponent, CompetitorListComponent]
})
export class GraphComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private rs = inject(ResultsSelectionService);
  private rd = inject(ResultsDataService);
  private dialog = inject(DialogsService);

  results: Results;
  oevent: OEvent;

  ngOnInit() {
    this.rd.selectedEvent.subscribe(oevent => this.oevent = oevent);

    this.rd.selectedResults.subscribe(results => {
      if (results) {
        console.log('Graph First comp ' + results.allCompetitors[0].name);
        displayGraph(results, { containerElement: "app-graph", topBar: "nav.results-navbar-container" });
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
