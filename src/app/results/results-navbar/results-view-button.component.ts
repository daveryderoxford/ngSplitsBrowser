/** Pure component to show button groupto allow results view to be selected */

import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { OEvent } from 'app/model';
import { ResultsView } from '../model';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { NgFor } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@Component({
    selector: 'app-results-view-button',
    template: `
  <mat-button-toggle-group>

    <mat-button-toggle class="toggelebutton" [checked]="selectedView.type === view.type"
                     (click)="buttonClicked(view)"  *ngFor="let view of primaryViews">
       {{ view.name }}
    </mat-button-toggle>

    <mat-button-toggle class="toggelebutton" [matMenuTriggerFor]="moreMenu">
      More <mat-icon>arrow_drop_down</mat-icon>
    </mat-button-toggle>
  </mat-button-toggle-group>

  <mat-menu #moreMenu="matMenu" xPosition="before">
    <button mat-menu-item (click)="buttonClicked(view)" *ngFor="let view of additionalViews">
       {{ view.name }}
    </button>
  </mat-menu>
  `,
    styles: [
        `mat-button-toggle {
      height:38px;
      line-height: 38px;
      padding: 0 5px;
    }`,
        `
    ::ng-deep .mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
      line-height: 35px !important;
      padding: 0 5px !important;
    }`
    ],
    standalone: true,
    imports: [MatButtonToggleModule, NgFor, MatLegacyMenuModule, MatIconModule]
})
export class ResultsViewButtonComponent implements OnInit {

  /* Ordered array of views the user may select
      If the primary property is set on the view it will be displayed as a button
      If the primary propery is not set it will be displayed in the 'More' menu
  */
  @Input() views: ResultsView[] = [];
  @Input() selectedView: ResultsView;

  @Output() viewSelected = new EventEmitter<ResultsView>();

  primaryViews: ResultsView[];
  additionalViews: ResultsView[];

  constructor() {
  }

  ngOnInit() {
    this.primaryViews = this.views.filter(view => view.primary);
    this.additionalViews = this.views.filter(view => !view.primary);
  }

  buttonClicked(view: ResultsView) {
    this.viewSelected.emit(view);
  }
}
