import { TestBed, inject } from "@angular/core/testing";

import { EventAdminService } from "./event-admin.service";

xdescribe("EventAdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAdminService]
    });
  });

  it("should ...", inject([EventAdminService], (service: EventAdminService) => {
    expect(service).toBeTruthy();
  }));
});
