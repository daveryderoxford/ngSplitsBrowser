import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-event-title',
  imports: [DatePipe],
  template: `
    <span class="class">
      {{ courseClassName()}}
    </span>
    <span class="name">
      {{ name()}}
    </span>
    <span class="date">
      @if (date()) {
        {{ date() | date: 'dd.MM.yyyy' }}
      } 
    </span>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-rows: 1fr, 1fr;
      grid-template-colunms: auto, auto;
      grid-areas: "class  name"
                  "class date";
    }
    .class {
      grid-area: class;
    }
    .name {
      grid-area: name;
    }
    .date {
      grid-area: date;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTitle {

  name = input('');
  date = input<Date | undefined>(undefined);
  courseClassName = input('');
  
}
