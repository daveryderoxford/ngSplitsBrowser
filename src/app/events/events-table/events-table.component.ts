import { ChangeDetectionStrategy, Component, OnInit, inject, input, output } from '@angular/core';
import { DataSource } from '@angular/cdk/table';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { OEvent } from '../model/oevent';
import { MatListModule } from '@angular/material/list';
import { BreakpointObserver } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-events-table',
    templateUrl: './events-table.component.html',
    styleUrls: ['./events-table.component.scss'],
    imports: [MatTableModule, MatIconModule, DatePipe, MatListModule],
    changeDetection:  ChangeDetectionStrategy.OnPush,
})
export class EventsTableComponent {
  private observer = inject(BreakpointObserver);

  isSmall = toSignal(this.observer.observe(['(max-width: 599px)']));

   currentRow: number

  events = input<OEvent[] | DataSource<OEvent>>();
  displayedColumns = input(["date", "name", "nationality", "club", "grade", "discipline", "type", "website", "actions"]);

  eventSelected = output<OEvent>();

  eventClicked(row: OEvent) {
    this.eventSelected.emit(row);
  }
}
