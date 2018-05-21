import { TestBed, inject } from '@angular/core/testing';

import { PaganationService } from './paganation.service';

describe('PaganationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaganationService]
    });
  });

  it('should be created', inject([PaganationService], (service: PaganationService) => {
    expect(service).toBeTruthy();
  }));
});
