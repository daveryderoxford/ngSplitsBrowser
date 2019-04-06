import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import {Fixture} from 'app/model';

@Component({
  selector: 'app-fixtures-grid',
  templateUrl: './fixtures-grid.component.html',
  styleUrls: ['./fixtures-grid.component.scss'],
})
export class FixturesGridComponent implements OnInit {

  _selectedFixture: Fixture;

  @Input() fixtures: Fixture[];

  @Input() selectedFixture: Fixture;

  @Output() fixtureSelected = new EventEmitter<Fixture>();

  displayedColumns = [ "date", "name",  "website"];

  constructor() { }

  ngOnInit() {
  }

  eventClicked( row ) {
    this._selectedFixture = row;
    this.fixtureSelected.emit( row );
  }

  selected( fixture: Fixture): boolean {
    return (this._selectedFixture === fixture);
  }

}

