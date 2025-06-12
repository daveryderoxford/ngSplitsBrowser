import { Component, inject, OnInit, OnDestroy, output, viewChild, signal, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OEvent } from '../model/oevent';
import { EventService, EventSearchOrder } from '../event.service';

@Component({
  selector: 'app-events-virtual-list',
  standalone: true,
  imports: [
    DatePipe,
    ScrollingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './events-list.html',
  styleUrl: './events-list.scss'
})
export class EventsVirtualList implements OnDestroy {
  private eventService = inject(EventService);

  readonly viewport = viewChild(CdkVirtualScrollViewport);

  // Configuration for data fetching
  private defaultOrderBy: EventSearchOrder = 'date';
  private defaultPageSize = 30; // Number of events to fetch per page
  private scrollBuffer = 20; // Load more when X items from the end are reached

  eventSelected = output<OEvent>();

  isLoading = toSignal(this.eventService.loading, { initialValue: false });
  isDone = toSignal(this.eventService.done, { initialValue: false });
  
  events = toSignal(this.eventService.search(this.defaultOrderBy, {}, this.defaultPageSize), { initialValue: [] });

  onEventClicked(event: OEvent): void {
    this.eventSelected.emit(event);
  }

  protected trackByEventId(index: number, event: OEvent): string | number {
    return event.key;
  }

  protected triggerLoadMore(currentIndex: number): void {
    // Load more if the current scroll index is within the buffer zone from the end of the list
    if (currentIndex >= this.events().length - this.scrollBuffer) {
      this.eventService.extendSearch();
    }
  }

  ngOnDestroy(): void {
    // Consider if PaganationService needs explicit reset if this component's lifecycle demands it,
    // though EventService.search() re-initializes it.
  }
}
