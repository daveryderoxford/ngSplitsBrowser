import { Component, OnInit } from '@angular/core';
import { Fixture, Nation } from 'app/model';
import { testFixtures } from './fixturesTestData';
import { LatLong } from 'app/model/fixture';
import { FixturesService } from '../fixtures.service';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})

export class FixturesComponent implements OnInit {
  selectedFixture: Fixture;

  fixtures: Fixture[] = [];

  homeLocation: LatLong;

  nationality: Nation;

  constructor(public fs: FixturesService) { }

  ngOnInit() {
    this.fixtures = testFixtures();

    this.fs.getFixtures().subscribe(); {

    }
  }

  onFeatureSelected(fixture: Fixture) {
    this.selectedFixture = fixture;
  }

}


