import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OEvent, UserResult } from 'app/model';

@Component({
  selector: 'app-my-results-table',
  templateUrl: './my-results-table.component.html',
  styleUrls: ['./my-results-table.component.scss']
})
export class MyResultsTableComponent implements OnInit {

  @Input() dataSource: UserResult[];
  @Input() displayedColumns = ["eventInfo.date",
                              "eventInfo.name",
                              "eventInfo.club",
                              "classPosition",
                              "classWinningTime",
                              "totalTime",
                              "minPerKm",
                              "behindWinner"
                              ];

  @Output() eventSelected = new EventEmitter<OEvent>();

  constructor() { }

  ngOnInit() {
  }

  minPerKm(res: UserResult): string {
     if (!res.result.distance || res.result.distance === 0) {
       return "";
     } else {
      return (res.result.totalTime / res.result.distance * 60).toString(2);
     }
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

}
