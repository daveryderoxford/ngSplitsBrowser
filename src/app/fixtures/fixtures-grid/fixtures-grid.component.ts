import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Fixture} from 'app/model';

@Component({
  selector: 'app-fixtures-grid',
  templateUrl: './fixtures-grid.component.html',
  styleUrls: ['./fixtures-grid.component.scss']
})
export class FixturesGridComponent implements OnInit {

  @Input() fixtures: Fixture[];

  @Input() selectedFixture: Fixture;

  @Output() fixtureSelected = new EventEmitter<Fixture>();

  displayedColumns = [ "date", "name",  "website"];

  constructor() { }

  ngOnInit() {
  }

  eventClicked( row ) {
    this.fixtureSelected.emit( row );
  }

}

