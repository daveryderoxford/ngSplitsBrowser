import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OEvent, UserResult } from 'app/model';
import { TimeUtilities, sbTime } from 'app/results/model';
import { NgClass, DatePipe } from '@angular/common';
import { MatLegacyTableModule } from '@angular/material/legacy-table';

@Component({
    selector: 'app-my-results-table',
    templateUrl: './my-results-table.component.html',
    styleUrls: ['./my-results-table.component.scss'],
    standalone: true,
    imports: [MatLegacyTableModule, NgClass, DatePipe]
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

  formatTime(time: sbTime): string {
    return TimeUtilities.formatTime(time);
  }

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

}
