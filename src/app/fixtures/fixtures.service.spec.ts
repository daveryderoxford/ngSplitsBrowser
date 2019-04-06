import { TestBed } from '@angular/core/testing';

import { FixturesService } from './fixtures.service';

describe('FixturesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FixturesService = TestBed.get(FixturesService);
    expect(service).toBeTruthy();
  });
});
