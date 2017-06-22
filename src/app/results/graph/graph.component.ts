import { Component, OnInit } from '@angular/core';
import { OEvent } from 'app/model/oevent';
import { ActivatedRoute, Params } from '@angular/router';

import { ResultsSelectionService } from 'app/results/results-selection.service';

import {SplitsBrowser} from 'app/results/graph/splitsbrowser/splitsbrowser';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnInit {

  event: OEvent;

  constructor(
    private route: ActivatedRoute,
    private rs: ResultsSelectionService) { }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => this.rs.setSelectedEventByKey(params['id']));
    this.rs.getEventObservable().subscribe( (event: OEvent) => this.selectedEventUpdated(event));
  }

  async selectedEventUpdated( event: OEvent) {
    if (event) {
      console.log('GraphComponent: Event Next')
      this.event = event;
      // Load the results
      const url = await this.rs.getSplitsURL();
      SplitsBrowser.loadEvent(url);
    }
  }

}

