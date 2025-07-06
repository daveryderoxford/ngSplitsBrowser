import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Toolbar } from 'app/shared/components/toolbar';
import { LegacyEventImport } from './event-import/event-import';

@Component({
  selector: 'app-sys-admin-switchboard',
  imports: [MatButtonModule, Toolbar],
  template: `
    <app-toolbar title="System admin"/>
    <div class=container>
      <div class=buttons>
        <button matButton='tonal' (click)="eventImport()">Upload Legacy Events</button>
        <button matButton='tonal' >Another Action</button>
      </div>
    </div>
  `,
  styles: `
    :host {
      width: 100%;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .container {
      width:100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background-color: var(--mat-sys-surface-container-low);    }
    .buttons {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      background-color: white;    
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SysAdminSwitchboard {
  private eventsImport = inject(LegacyEventImport);

  eventImport() {
    this.eventsImport.loadEvents();
  }
}
