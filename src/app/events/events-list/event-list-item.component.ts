import { ChangeDetectionStrategy, Component, Output, EventEmitter, input, output } from '@angular/core';
import { OEvent } from '../model/oevent';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-list-item',
  standalone: true,
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    DatePipe
  ],
  template: `
    <mat-list-item class="event-list-item">
      <span matListItemTitle>{{ event().name }}</span>
      <span matListItemLine>{{ event().date | date:'mediumDate' }} - {{ event().club }} ({{ event().nationality }})</span>
      <span matListItemLine>Type: {{ event().type }} | Discipline: {{ event().discipline }}</span>
      <div matListItemMeta>
        <button mat-icon-button (click)="itemClicked()">
          <mat-icon>arrow_forward</mat-icon>
        </button>
      </div>
    </mat-list-item>
  `,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListItemComponent {
  readonly event = input.required<OEvent>();
  readonly eventClicked = output<OEvent>();

  itemClicked(): void {
    this.eventClicked.emit(this.event());
  }
}