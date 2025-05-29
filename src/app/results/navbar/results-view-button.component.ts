/** Pure component to show button groupto allow results view to be selected */

import { Component, OnInit, input, output } from '@angular/core';
import { ResultsView } from '../model';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'app-results-view-button',
    template: `
  <mat-button-toggle-group [hideSingleSelectionIndicator]=true>
  
    @for (view of primaryViews; track view) {
      <mat-button-toggle class="toolbar-toggle-button" [checked]="selectedView().type === view.type"
        (click)="buttonClicked(view)" >
        {{ view.name }}
      </mat-button-toggle>
    }
  
    <mat-button-toggle [matMenuTriggerFor]="moreMenu">
      More <mat-icon>arrow_drop_down</mat-icon>
    </mat-button-toggle>
  </mat-button-toggle-group>
  
  <mat-menu #moreMenu="matMenu" xPosition="before">
    @for (view of additionalViews; track view) {
      <button mat-menu-item (click)="buttonClicked(view)">
        {{ view.name }}
      </button>
    }
  </mat-menu>
  `,
    styles: `
    @use '@angular/material' as mat;

    // Customize the entire app. Change :root to your selector if you want to scope the styles.
    :host {
      @include mat.button-toggle-overrides((
        shape: 5px,
        selected-state-background-color: var(--mat-sys-primary),
        selected-state-text-color: var(--mat-sys-on-primary)

      ));
    }
  `,
    imports: [MatButtonToggleModule, MatMenuModule, MatIconModule]
})
export class ResultsViewButtonComponent implements OnInit {

  /* Ordered array of views the user may select
      If the primary property is set on the view it will be displayed as a button
      If the primary propery is not set it will be displayed in the 'More' menu
  */
  views = input<ResultsView[]>([]);
  selectedView = input<ResultsView>();
  viewSelected = output<ResultsView>();

  primaryViews: ResultsView[] = [];
  additionalViews: ResultsView[] = [];

  ngOnInit() {
    this.primaryViews = this.views().filter(view => view.primary);
    this.additionalViews = this.views().filter(view => !view.primary);
  }

  buttonClicked(view: ResultsView) {
    this.viewSelected.emit(view);
  }
}
