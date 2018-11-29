import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { ComparisionOption, ALL_COMPARISON_OPTIONS } from 'app/results/graph/splitsbrowser/comparision-options';


@Component({
  selector: 'app-compare-with',
  template: `
  <button mat-button [matMenuTriggerFor]="picker">
      {{ buttonText }}
       <mat-icon>arrow_drop_down</mat-icon>
  </button>
  <mat-menu #picker="matMenu">
    <button mat-menu-item *ngFor="let option of options" (click)="onSelect.emit(option)">
      {{option.nameKey}}
    </button>
  </mat-menu>
    `,
  })
export class CompareWithComponent implements OnInit, OnChanges {

  @Input() selected: ComparisionOption;
  @Output() onSelect = new EventEmitter<ComparisionOption>();

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
