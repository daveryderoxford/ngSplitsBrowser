import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, computed, effect, inject } from "@angular/core";
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
import { FastestPanelComponent } from "../fastest-panel/fastest-panel.component";
import { toSignal } from '@angular/core/rxjs-interop';

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
  imports: [ResultsNavbarComponent, CompetitorListComponent, FastestPanelComponent]
})
export class GraphComponent implements OnInit {

  private route = inject(ActivatedRoute);
  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);
  private dialog = inject(DialogsService);


  results = toSignal(this.rd.selectedResults);
  oevent = toSignal(this.rd.selectedEvent);

  leg = computed<number>( () => this.rs.selectedCourse().controls.indexOf( this.rs.selectedControl() ));

  constructor() {
 
    effect(() => {
      if (this.results()) {
        console.log('Graph First comp ' + this.results().allCompetitors[0].name);
        displayGraph(this.results(), { containerElement: "app-graph", topBar: "nav.results-navbar-container" });
      } else {
        console.log('graph componennt null results');
      }
    });
  }


  ngOnInit() {

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
