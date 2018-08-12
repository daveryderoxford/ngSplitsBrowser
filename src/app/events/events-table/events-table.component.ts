import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { OEvent } from 'app/model';

@Component({
  selector: 'app-events-table',
  templateUrl: './events-table.component.html',
  styleUrls: ['./events-table.component.scss']
})
export class EventsTableComponent implements OnInit {

  @Input() dataSource;
  @Input() displayedColumns = ["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"];

  @Output() eventSelected = new EventEmitter<OEvent>();

  currentRow: any = null;

  constructor() { }

  ngOnInit() {
  }

  onMouseEnter(row) {
    this.currentRow = row;
  }

  onMouseLeave() {
    this.currentRow = null;
  }

  rowStyle(row): string {
    if (this.currentRow === row) {
      return ("selected");
    } else {
      return ("");
    }
  }

  oeventClicked(row) {
    this.eventSelected.emit(row);
  }

}
