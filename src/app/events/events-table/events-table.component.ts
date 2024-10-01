import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OEvent } from 'app/model';
import { DataSource } from '@angular/cdk/table';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgIf, DatePipe } from '@angular/common';
import { MatLegacyTableModule } from '@angular/material/legacy-table';

@Component({
    selector: 'app-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss'],
    standalone: true,
    imports: [MatLegacyTableModule, NgClass, NgIf, MatIconModule, DatePipe]
})
export class EventsTableComponent {

   currentRow: number;

  @Input() events: Array<OEvent> | DataSource<OEvent>;
  @Input() displayedColumns = ["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"];

  @Output() eventSelected = new EventEmitter<OEvent>();

  constructor() { }

  eventClicked(row) {
    this.eventSelected.emit(row);
  }

}
