import { TestBed, inject } from "@angular/core/testing";

import { ResultsSelectionService } from "./results-selection.service";

describe("ResultsSelectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ResultsSelectionService]
    });
  });

  it("should be created", inject([ResultsSelectionService], (service: ResultsSelectionService) => {
    expect(service).toBeTruthy();
  }));
});
