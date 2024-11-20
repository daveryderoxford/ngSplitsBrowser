import { Component, OnInit, input, output } from '@angular/core';
import { OEvent } from 'app/model';
import { DataSource } from '@angular/cdk/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss'],
    standalone: true,
    imports: [MatTableModule, MatIconModule, DatePipe]
})
export class EventsTableComponent {

   currentRow: number;

  events = input<Array<OEvent> | DataSource<OEvent>>();
  displayedColumns = input(["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"]);

  eventSelected = output<OEvent>();

  eventClicked(row) {
    this.eventSelected.emit(row);
  }
}
