/** Pure component to show button groupto allow results view to be selected */

import { Component, input, output } from '@angular/core';
import { ResultsView } from '../model';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'app-results-view-button',
    template: `
      <mat-button-toggle-group [hideSingleSelectionIndicator]=true>
        @for (view of views(); track view.name) {
          <mat-button-toggle [checked]="selectedView().type === view.type" (click)="buttonClicked(view)">
            {{ view.name }}
          </mat-button-toggle>
        }
      </mat-button-toggle-group>
  `,
    styles: ``,
    imports: [MatButtonToggleModule, MatMenuModule, MatIconModule]
})
export class ResultsViewButtonComponent {

  views = input<ResultsView[]>([]);
  selectedView = input<ResultsView>();
  viewSelected = output<ResultsView>();

  buttonClicked(view: ResultsView) {
    this.viewSelected.emit(view);
  }
}
