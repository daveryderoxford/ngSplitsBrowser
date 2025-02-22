import { Component, model } from '@angular/core';
import { ALL_COMPARISON_OPTIONS, ComparisionOption } from 'app/results/graph-page/splitsbrowser/comparision-options';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-compare-with',
    template: `
  <button mat-button [matMenuTriggerFor]="picker">
    {{ selected().name }}
    <mat-icon>arrow_drop_down</mat-icon>
  </button>
  <mat-menu #picker="matMenu">
    @for (option of options; track option) {
      <button mat-menu-item (click)="selected.set(option)">
        {{option.name}}
      </button>
    }
  </mat-menu>
  `,
    imports: [MatButtonModule, MatMenuModule, MatIconModule]
})
export class CompareWithSelect {

  selected = model.required<ComparisionOption>();

  options = ALL_COMPARISON_OPTIONS;

}
