import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-event-title',
  imports: [DatePipe],
  template: `
    <span class="oclass">
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
      grid-template-columns: auto, auto;
      grid-template-areas: "name name"
                           "oclass date";
    }
    .oclass {
      grid-area: oclass;
      align-self: center;
      font-size: 80%;

    }
    .name {
      grid-area: name;
      font-size: 80%;
    }
    .date {
      grid-area: date;
      font-size: 80%;

    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventTitle {

  name = input('');
  date = input<Date | undefined>(undefined);
  courseClassName = input('');
  
}
