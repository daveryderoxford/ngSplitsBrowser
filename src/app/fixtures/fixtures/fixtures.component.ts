import { Component, OnInit } from '@angular/core';
import { Fixture, Nation } from 'app/model';
import { testFixtures } from './fixturesTestData.spec';
import { LatLong } from 'app/model/fixture';
import { FixturesService } from '../fixtures.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-fixtures',
  templateUrl: './fixtures.component.html',
  styleUrls: ['./fixtures.component.scss']
})

export class FixturesComponent implements OnInit {
  selectedFixture: Fixture;

  fixtures: Fixture[];
  homeLocation: Observable<LatLong>;
  postcode: Observable<string>;

  constructor(public fs: FixturesService) { }

  ngOnInit() {
   this.fs.getFixtures().subscribe( f => this.fixtures = f );
   this.homeLocation = this.fs.getHomeLocation();
   this.postcode = this.fs.getPostcode();
  }

  onFeatureSelected(fixture: Fixture) {
    this.selectedFixture = fixture;
  }

  postcodeChanged( p: string) {
    this.fs.setPostcode(p);
  }

}


