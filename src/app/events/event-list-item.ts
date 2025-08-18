import { ChangeDetectionStrategy, Component, Output, EventEmitter, input, output } from '@angular/core';
import { OEvent } from './model/oevent';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { EllipsisPipe } from "../shared/pipes/ellipsis-pipe";

@Component({
  selector: 'app-event-list-item',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DatePipe,
    MatDividerModule,
    EllipsisPipe
],
  template: `
    <mat-list-item class="event-list-item">
      @if (truncateTitle()) {
        <span matListItemTitle>{{ event().name | ellipsis:29 }}</span>
    } @else {
        <span matListItemTitle>{{ event().name  }}</span>
    }
      <span matListItemLine>{{ event().date | date:'mediumDate' }} - {{ event().club }} ({{ event().nationality }})</span>
      <span matListItemLine>Type: {{ event().type }} | Discipline: {{ event().discipline }}</span>
      <div matListItemMeta>
        <button mat-icon-button (click)="itemClicked()">
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </mat-list-item>
    <mat-divider/>
  `,
  styles: ``,  
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListItem {
  readonly event = input.required<OEvent>();
  // Workaround where titles are not trancated with ellipsis 
  // inside a cdkVirtualFor
  readonly truncateTitle = input(false);
  readonly eventClicked = output<OEvent>();
  

  itemClicked(): void {
    this.eventClicked.emit(this.event());
  }
}