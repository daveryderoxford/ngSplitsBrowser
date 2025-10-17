
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventSearchOrder, EventService } from 'app/events/event.service';
import { SelectedEventService } from 'app/events/selected-event.service';
import { EventListItem } from '../event-list-item';
import { Nations } from '../model/nations';
import { EventGrades, OEvent } from '../model/oevent';
import { AppBreakpoints } from 'app/shared/services/breakpoints';

@Component({
  selector: 'app-all-events-tab',
  templateUrl: './all-events-tab.component.html',
  styleUrls: ['./all-events-tab.component.scss'],
  imports: [MatProgressBarModule, 
    ScrollingModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    EventListItem
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllEventsTabComponent {
  protected es = inject(EventService);
  protected ses = inject(SelectedEventService);
  protected breakpoints = inject(AppBreakpoints);
  
  eventSelected = output<OEvent>();

  grades = EventGrades.grades;
  nations = Nations.getNations();
  
  // Configuration for data fetching
  private defaultOrderBy: EventSearchOrder = 'date';
  private defaultPageSize = 18; // Number of events to fetch per page
  private scrollBuffer = 9; // Load more when X items from the end are reached

  isLoading = toSignal(this.es.loading, { initialValue: false });
  isDone = toSignal(this.es.done, { initialValue: false });

  private events$ = this.es.search(this.defaultOrderBy, {}, this.defaultPageSize);
  events = toSignal(this.events$, { initialValue: [] });

  eventClicked(event: OEvent) {
    this.eventSelected.emit(event);
  }

  protected trackByEventId(_: number, event: OEvent): string {
    return event.key;
  }

  protected scrollPositionChanged(currentIndex: number): void {
    // Load more if the current scroll index is within the buffer zone from the end of the list
    if (currentIndex >= this.events().length - this.scrollBuffer) {
      console.log(`Current index: ${currentIndex}, Total events: ${this.events().length}, Scroll buffer: ${this.scrollBuffer}`);
      this.es.extendSearch();
    }
  }
}
