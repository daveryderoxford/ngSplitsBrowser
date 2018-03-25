import { TestBed, inject } from '@angular/core/testing';

import { BulkImportService } from './bulk-import.service';

describe('BulkImportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BulkImportService]
    });
  });

  it('should be created', inject([BulkImportService], (service: BulkImportService) => {
    expect(service).toBeTruthy();
  }));
});
