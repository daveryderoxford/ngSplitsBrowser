import { TestBed, inject } from '@angular/core/testing';

import { CompetitorDataService } from './competitor-data.service';

describe('CompetitorDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompetitorDataService]
    });
  });

  it('should be created', inject([CompetitorDataService], (service: CompetitorDataService) => {
    expect(service).toBeTruthy();
  }));
});
