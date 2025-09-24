import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { MatButtonAppearance, MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { EventService } from 'app/events/event.service';
import { Competitor } from 'app/results/model';
import { UserDataService } from 'app/user/user-data.service';
import { createUserResult } from 'app/user-results/user-result';
import { firstValueFrom } from 'rxjs';
import { ResultsSearchDialog, SearchSelectedItem } from '../results/search/results-search-dialog/results-search-dialog';
import { DialogsService } from 'app/shared';

export type SearchButtonAppearance = 'list' | 'text' | 'icon';

@Component({
   selector: 'app-user-result-button',
   imports: [CommonModule, MatButtonModule, MatListModule],
   changeDetection: ChangeDetectionStrategy.OnPush,
   template: `
   @if (appearance() === 'list') {
      <button mat-list-item (click)="openSearchDialog()" aria-label="Add user result">
         Add user result
      </button>
   } @else {
    <button matButton="tonal" (click)="openSearchDialog()" aria-label="Add user result">
      Add user result
    </button>
   }
  `,
})
export class UserResultButton {
   private dialog = inject(MatDialog);
   private ds = inject(DialogsService);
   private usd = inject(UserDataService);
   private es = inject(EventService);

   appearance = input<SearchButtonAppearance>('list');

   async openSearchDialog(): Promise<void> {
      if (!this.es.selectedEvent()) {
         await this.ds.message(" Select event", "First load an event to add result from using the 'Events' menu");
         return;
      }
      const dialogRef = this.dialog.open(ResultsSearchDialog, {
         width: '420px',
         height: '80%',
         autoFocus: true,
         data: {
            competitorsOnly: true,
            title: 'Search result to add'
         }
      });

      const comp: SearchSelectedItem | undefined = await firstValueFrom(dialogRef.afterClosed());

      if (comp && (comp instanceof Competitor)) {
         console.log('Add Result: Selected competitor: ', comp.name);
         const userResult = createUserResult(this.es.selectedEvent(), comp);
         await this.usd.addResult(userResult);
      }
   }
}