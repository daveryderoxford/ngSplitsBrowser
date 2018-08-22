import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OEvent, UserResultData } from 'app/model';
import { TimeUtilities } from '../../results/model';

@Component({
  selector: 'app-my-results-table',
  templateUrl: './my-results-table.component.html',
  styleUrls: ['./my-results-table.component.scss']
})
export class MyResultsTableComponent implements OnInit {

  @Input() dataSource: UserResultData[];
  @Input() displayedColumns = ["eventInfo.date",
                              "eventInfo.name",
                              "eventInfo.club",
                              "classPosition",
                              "classWinningTime",
                              "totalTime",
                               "minPerKm"
                              ];

  @Output() eventSelected = new EventEmitter<OEvent>();

  constructor() { }

  ngOnInit() {
  }

  minPerKm(res: UserResultData): string {
     if (!res.distance || res.distance === 0) {
       return "";
     } else {
      return (res.totalTime / res.distance * 60).toString(2);
     }
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

}
