/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { getFunctions, httpsCallable } from '@angular/fire/functions';
import { MatButtonModule } from '@angular/material/button';
import { Toolbar } from 'app/shared/components/toolbar';
import { LegacyEventImport } from './event-import/legacy-event-import';


@Component({
  selector: 'app-sys-admin-switchboard',
  imports: [MatButtonModule, Toolbar],
  template: `
    <app-toolbar title="System admin"/>
    <div class=container>
      <div class=buttons>
        <button matButton='tonal' (click)="eventImport()" [disabled]="busy()">
          Upload Legacy Events
        </button>
        <button matButton='tonal' (click)="rebuildClubIndex()" [disabled]="busy()">
          Rebuild club index
        </button>
      </div>
      <span class="message">
         {{msgText()}}
      </span>
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
    .message {
      width: 100%;
      text-align: center;
      padding: 20px;
      font-size: 1.2em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SysAdminSwitchboard {
  private eventsImport = inject(LegacyEventImport);
  private functions = getFunctions(inject(FirebaseApp));

  busy = signal(false);

  msgText = this.eventsImport.message;

  async eventImport() {
    console.log('Sys-admin: Loading legacy events...');
    this.busy.set(true);

    try {
      await this.eventsImport.loadEvents();
      console.log('Sys-admin: Legacy events imported successfully.');
    } catch (error) {
      console.error('Error importing events:', error);
    } finally {
      this.busy.set(false);
    }
  }

  async rebuildClubIndex() {
    console.log('Sys-admin: Rebuilding club index...');
    this.busy.set(true);

    try {
      const rebuild = httpsCallable(this.functions, 'rebuildClubs');
      const result = await rebuild({});
      console.log('Sys-admin: Rebuild indices completed successfully:', result);
    } catch (error: any) {
      // Getting the Error details.
      const code = error.code;
      const message = error.message;
      const details = error.details;
      console.log(`Sys-admin: Rebuild indices: error code ${code}, message: ${message}, details: ${details}`);
    } finally {
      this.busy.set(false);
    }
  }
}
