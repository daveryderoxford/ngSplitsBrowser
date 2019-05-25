import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FixtureTimeFilter } from 'app/model/fixture-filter';

@Component( {
   selector: 'app-fixture-week-filter',
   template: `
 <div>
    <mat-button-toggle-group multiple="true">

      <mat-button-toggle disableRipple class="toggelebutton" [checked]="timeFilter.sat"
        (click)="timeFilterClicked('sat')">
        Sat
      </mat-button-toggle>
      <mat-button-toggle disableRipple class="toggelebutton" [checked]="timeFilter.sun"
        (click)="timeFilterClicked('sun')">
        Sun
      </mat-button-toggle>
      <mat-button-toggle disableRipple class="toggelebutton" [checked]="timeFilter.weekday"
        (click)="timeFilterClicked('weekday')">
        Weekday
      </mat-button-toggle>

    </mat-button-toggle-group>
  </div>
  `,
   styles: [
      `mat-button-toggle {
         height: 38px;
         line-height: 38px;
         padding: 0 8px;
      }`,
      `::ng-deep .mat-button-toggle-appearance-standard .mat-button-toggle-label-content {
         line-height: 35px !important;
         padding: 0 8px !important;
      }`
   ]
} )
export class FixtureWeekFilterComponent implements OnInit {

   @Input() timeFilter: FixtureTimeFilter;

   @Output() filterChanged = new EventEmitter<FixtureTimeFilter>();

   constructor () { }

   ngOnInit() {
   }

   timeFilterClicked( key: string ) {
      this.timeFilter[ key ] = !this.timeFilter[ key ];
      this.filterChanged.emit( this.timeFilter);
   }

}
