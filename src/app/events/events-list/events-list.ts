import { Component, inject, OnInit, OnDestroy, output, viewChild, signal, Signal, ChangeDetectionStrategy } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OEvent } from '../model/oevent';
import { EventService, EventSearchOrder } from '../event.service';
import { MatButtonModule } from '@angular/material/button';
import { EventListItemComponent } from './event-list-item.component';

@Component({
  selector: 'app-events-list',
  standalone: true,
  imports: [
    ScrollingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule, 
    MatButtonModule,
    MatIconModule,
    EventListItemComponent
  ],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventsList implements OnDestroy {
  private eventService = inject(EventService);

  readonly viewport = viewChild(CdkVirtualScrollViewport);

  // Configuration for data fetching
  private defaultOrderBy: EventSearchOrder = 'date';
  private defaultPageSize = 30; // Number of events to fetch per page
  private scrollBuffer = 20; // Load more when X items from the end are reached

  eventSelected = output<OEvent>();

  isLoading = toSignal(this.eventService.loading, { initialValue: false });
  isDone = toSignal(this.eventService.done, { initialValue: false });

  private events$ = this.eventService.search(this.defaultOrderBy, {}, this.defaultPageSize)
  events = toSignal(this.events$, { initialValue: [] });

  onEventClicked(event: OEvent): void {
    this.eventSelected.emit(event);
  }

  protected trackByEventId(_: number, event: OEvent): string {
    return event.key;
  }

  protected scrollPositionChanged(currentIndex: number): void {
    // Load more if the current scroll index is within the buffer zone from the end of the list
    console.log(`Current index: ${currentIndex}, Total events: ${this.events().length}, Scroll buffer: ${this.scrollBuffer}`);
    if (currentIndex >= this.events().length - this.scrollBuffer) {
      this.eventService.extendSearch();
    }
  }

  ngOnDestroy(): void {
    // Consider if PaganationService needs explicit reset if this component's lifecycle demands it,
    // though EventService.search() re-initializes it.
  }
}
