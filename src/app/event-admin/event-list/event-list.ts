import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { OEvent } from "../../events/model/oevent";

@Component({
   selector: "app-event-list",
   template: `
   <mat-list>
      @for (event of events; track event) {
         <mat-list-item (click) = "selected.emit(event)">
         <span matListItemTitle> {{ event.date | date; }} { { event.name; } }</span>
         <span matListItemLine>{{ event.nationality; }}  { { event.club; } }</span>
         </ <mat-list-item>
      }
   </mat-list>;
   `,
   styleUrl: 'event-list.scss',
   standalone: true,
   changeDetection: ChangeDetectionStrategy.OnPush,
   imports: [    
      MatListModule
   ],

})
export class EventAdminComponent {
   events = input.required<OEvent[]>();
   selected = output<OEvent>();
}


