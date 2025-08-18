import { Component, input, model, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { Competitor } from '../../model';

@Component({
    selector: 'app-compare-with-competitor',
    template: `
   <mat-form-field appearance="outline" subscriptSizing="dynamic" class="dense-form-field set-width">
      <mat-label>Comparison Competitor</mat-label>
      <mat-select [value]="this.selected()" (selectionChange)="selected.set($event.value)">
        @for (comp of competitors(); track comp.order) {
          <mat-option [value]="comp">
            {{ comp.name }}
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
    imports: [MatFormFieldModule, MatSelectModule]
})
export class CompareWithCompetitorSelect
{
  competitors = input.required<Competitor[]>();

  selected = model<Competitor>();

}
