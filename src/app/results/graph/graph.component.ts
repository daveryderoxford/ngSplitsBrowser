import { Component, OnInit, ElementRef, ViewEncapsulation } from '@angular/core';
import { OEvent } from 'app/model/oevent';
import { ActivatedRoute, Params } from '@angular/router';

import { ResultsSelectionService } from 'app/results/results-selection.service';

import {SplitsBrowser} from 'app/results/graph/splitsbrowser/splitsbrowser';


interface SplitsBrowserOptions {
   defaultLanguage?: boolean;
   containerElement?: string;
   topBar?: string;
}

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss'],
  // To avoid angular re-writting style names that will be used by D3.  These styles will just get appende dto the global styles file
  encapsulation: ViewEncapsulation.None
})
export class GraphComponent implements OnInit {

  event: OEvent;

  constructor( private route: ActivatedRoute,
               private rs: ResultsSelectionService) {
    }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.rs.setSelectedEventByKey(params['id']));
    this.rs.getEventObservable().subscribe( (event: OEvent) => this.selectedEventUpdated(event));
  }

  async selectedEventUpdated( event: OEvent) {
    if (event) {
      this.event = event;
      const url = await this.rs.getSplitsURL();
      SplitsBrowser.loadEvent(url, {containerElement: 'app-graph'} );
    }
  }

}

