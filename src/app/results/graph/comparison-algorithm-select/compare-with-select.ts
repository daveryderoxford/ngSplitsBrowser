import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { ALL_COMPARISON_OPTIONS, ComparisionOption } from 'app/results/graph/splitsbrowser/comparision-options';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-compare-with',
    template: `
   <mat-form-field appearance="outline" subscriptSizing="dynamic" class="dense-form-field set-width">
      <mat-label>Compare to</mat-label>
      <mat-select [value]="this.selected()" (selectionChange)="selected.set($event.value)">
        @for (option of options; track option.name) {
          <mat-option [value]="option">
            {{ option.name }}
          </mat-option>
        }
      </mat-select>
  </mat-form-field>
  `,
  styles:`
    .set-width {
      min-width: 180px;  
      max-width: 180px;  
    }
  `,
    imports: [MatFormFieldModule, MatSelectModule],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class CompareWithSelect {

  selected = model.required<ComparisionOption>();

  options = ALL_COMPARISON_OPTIONS;

}
