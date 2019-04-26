import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { EventGrade, EventGrades } from 'app/model';

export interface FixtureTimeFilter {
  sat: boolean;
  sun: boolean;
  weekday: boolean;
}

export interface FixtureFilter {
  time: FixtureTimeFilter;
  distance: Map<EventGrade, number>;
}

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class FilterComponent implements OnInit {

  grades = EventGrades.grades;

  @Input() timeFilter: FixtureTimeFilter = { sat: true, sun: true, weekday: true };

  @Input() distanceFilter = new Map<EventGrade, number>();

  @Output() filterChanged = new EventEmitter<FixtureFilter>();

  constructor() { }

  ngOnInit() {
  }

  timeFilterClicked( key: string) {
    this.timeFilter[ key ] = !this.timeFilter[ key ];
    this.doFilterChanged();
  }

  private doFilterChanged() {
    this.filterChanged.emit( { time: this.timeFilter, distance: this.distanceFilter });
  }

}
