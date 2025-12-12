import { inject, Injectable, signal } from '@angular/core';
import { OEvent } from './model/oevent';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SelectedEventService {
  private router = inject(Router);

  private _selectedEvent = signal<OEvent | undefined>(undefined);

  readonly selectedEvent = this._selectedEvent.asReadonly();

  setSelectedEvent(event: OEvent | undefined) {
    this._selectedEvent.set(event);
  }

  /** Navigates to the results graph page for a given event. */
  navigateToEvent(event: Partial<OEvent> & { key: string;}): Promise<boolean> {
    return this.router.navigate(['results', 'graph', event.key], {
      queryParams: {
        eventName: event.name,
        eventDate: event.date ? event.date.toISOString() : undefined,
        url: event.url,
      },
    });
  }

}