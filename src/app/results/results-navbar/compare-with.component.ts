import { Component, OnInit, OnChanges, input, output } from '@angular/core';
import { ComparisionOption, ALL_COMPARISON_OPTIONS } from 'app/results/graph/splitsbrowser/comparision-options';

import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-compare-with',
    template: `
  <button mat-button [matMenuTriggerFor]="picker">
    {{ buttonText }}
    <mat-icon>arrow_drop_down</mat-icon>
  </button>
  <mat-menu #picker="matMenu">
    @for (option of options; track option) {
      <button mat-menu-item (click)="select.emit(option)">
        {{option.nameKey}}
      </button>
    }
  </mat-menu>
  `,
    standalone: true,
    imports: [MatButtonModule, MatMenuModule, MatIconModule]
})
export class CompareWithComponent implements OnInit, OnChanges {

  selected = input<ComparisionOption>();
  select = output<ComparisionOption>();

  buttonText: string;
  options = ALL_COMPARISON_OPTIONS;

  ngOnInit() { }

  ngOnChanges() {
     if (this.selected()) {
        this.buttonText = this.selected()!.nameKey;
     } else {
        this.buttonText = 'Compare Against';
     }
  }
}
