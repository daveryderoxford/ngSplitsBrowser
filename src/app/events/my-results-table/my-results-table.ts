import { ChangeDetectionStrategy, Component, OnInit, input, output } from '@angular/core';
import { TimeUtilities, sbTime } from 'app/results/model';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { UserResult } from 'app/user/user';
import { OEvent } from '../model/oevent';

@Component({
    selector: 'app-my-results-table',
    templateUrl: './my-results-table.html',
    styleUrls: ['./my-results-table.scss'],
    imports: [MatTableModule, DatePipe],
    changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class MyResultsTable implements OnInit {

  dataSource = input<UserResult[]>();
  displayedColumns = input(["eventInfo.date",
        "eventInfo.name",
        "eventInfo.club",
        "classPosition",
        "classWinningTime",
        "totalTime",
        "minPerKm",
        "behindWinner"
    ]);

  eventSelected = output<OEvent>();

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
