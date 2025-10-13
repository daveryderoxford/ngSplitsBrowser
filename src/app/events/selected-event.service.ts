import { Injectable, signal } from '@angular/core';
import { OEvent } from './model/oevent';

@Injectable({
  providedIn: 'root',
})
export class SelectedEventService {
  private _selectedEvent = signal<OEvent | undefined>(undefined);

  readonly selectedEvent = this._selectedEvent.asReadonly();

  setSelectedEvent(event: OEvent | undefined) {
    this._selectedEvent.set(event);
  }
}