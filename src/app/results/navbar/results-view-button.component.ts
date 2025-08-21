/** Pure component to show button groupto allow results view to be selected */

import { Component, inject, input, output } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { AppBreakpoints } from 'app/shared/services/breakpoints';
import { ResultsView } from '../model';

@Component({
    selector: 'app-results-view-button',
    template: `
    @if (hs.narrowScreen()) {
      <mat-form-field appearance="outline" subscriptSizing="dynamic" class="dense-form-field set-width">
        <mat-label>View</mat-label>
        <mat-select [value]="selectedView()" (selectionChange)="buttonClicked($event.value)">
          <mat-select-trigger>
            {{ selectedView().name }}
          </mat-select-trigger>
          @for (view of views(); track view.name) {
            <mat-option [value]="view">{{ view.name }}</mat-option>
          }
        </mat-select>
      </mat-form-field> 
    } @else {
      <mat-button-toggle-group [hideSingleSelectionIndicator]=true>
        @for (view of views(); track view.name) {
          <mat-button-toggle [checked]="selectedView().type === view.type" (click)="buttonClicked(view)">
            {{ view.name }}
          </mat-button-toggle>
        }
      </mat-button-toggle-group>
    }
  `,
    styles: `
    .set-width {
      min-width: 100px;
      max-width: 100px;
    }`,
  imports: [MatButtonToggleModule, MatMenuModule, MatIconModule, MatSelectModule, MatFormFieldModule]
})
export class ResultsViewButtonComponent {
  protected hs = inject(AppBreakpoints)

  views = input<ResultsView[]>([]);
  selectedView = input<ResultsView>();
  viewSelected = output<ResultsView>();

  buttonClicked(view: ResultsView) {
    console.log(`View selected: ${view.name}`);
    this.viewSelected.emit(view);
  }
}
