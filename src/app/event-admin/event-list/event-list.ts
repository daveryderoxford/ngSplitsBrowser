/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { OEvent } from "../../events/model/oevent";
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FileButton } from '../file-button/file-button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
   selector: "app-event-list",
   template: `
   <mat-list>
      @for (event of events(); track event.key) {
         <mat-list-item (click)="additionalDetail.emit(event)">
            <span matListItemTitle> {{ event.date | date }} </span>
            <span matListItemLine>{{ event.name }} {{ event.club }}</span>
            @if (!event.splits) {
                <span matListItemLine class="error">SPLITS NOT UPLOADED</span>
            } @else if (event.splits.valid === false) {
               <span matListItemLine ><span class="error">SPLITS NOT VALID - {{event.splits.splitsFilename}}</span></span>
            }
            <span matListItemMeta>
               <button mat-icon-button matTooltip="Edit details" (click)="edit.emit(event)">
                  <mat-icon class="green">edit</mat-icon>
               </button>
               <file-button matTooltip="Upload results" (fileSelected)="upload.emit({event: event, files: $event})"/>
               <button mat-icon-button matTooltip="Delete event" (click)="delete.emit(event)">
                  <mat-icon class="red">delete</mat-icon>
               </button>
            </span>
          </mat-list-item>
      } @empty {
         <mat-list-item>
            <span matListItemTitle>No events uploaded yet</span>
         </mat-list-item>
      }
   </mat-list>
   `,
   styleUrl: 'event-list.scss',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [MatListModule, DatePipe, MatIconModule, MatButtonModule, FileButton, MatTooltipModule],
})
export class EventList {
   events = input.required<OEvent[]>();
   edit = output<OEvent>();
   delete = output<OEvent>();
   upload = output<{ event: OEvent, files: File[]; }>();
   additionalDetail = output<OEvent>();
}
