import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ComparisionOption, ALL_COMPARISON_OPTIONS } from 'app/results/graph/splitsbrowser/comparision-options';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';


@Component({
    selector: 'app-compare-with',
    template: `
  <button mat-button [matMenuTriggerFor]="picker">
      {{ buttonText }}
       <mat-icon>arrow_drop_down</mat-icon>
  </button>
  <mat-menu #picker="matMenu">
    <button mat-menu-item *ngFor="let option of options" (click)="select.emit(option)">
      {{option.nameKey}}
    </button>
  </mat-menu>
    `,
    standalone: true,
    imports: [MatLegacyButtonModule, MatLegacyMenuModule, MatIconModule, NgFor]
})
export class CompareWithComponent implements OnInit, OnChanges {

  @Input() selected: ComparisionOption;
  @Output() select = new EventEmitter<ComparisionOption>();

  buttonText: string;
  options = ALL_COMPARISON_OPTIONS;

  constructor() { }

  ngOnInit() { }

  ngOnChanges() {
     if (this.selected) {
        this.buttonText = this.selected.nameKey;
     } else {
        this.buttonText = 'Compare Against';
     }
  }
}
