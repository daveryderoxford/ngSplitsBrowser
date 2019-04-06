import { Component, OnInit } from '@angular/core';
import { Fixture, Nation } from 'app/model';
import { testFixtures } from './fixturesTestData';
import { LatLong } from 'app/model/fixture';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})


export class FixturesComponent implements OnInit {
  selectedFixture: Fixture;

  fixtures: Fixture[] = testFixtures();

  homeLocation: LatLong;

  nationality: Nation;

  constructor() { }

  ngOnInit() {
  }

  onFeatureSelected(fixture: Fixture) {
    this.selectedFixture = fixture;
  }

}


