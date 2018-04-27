import { TestBed, inject } from "@angular/core/testing";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore } from "angularfire2/firestore";
import { AngularFireStorage } from "angularfire2/storage";

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

  it("should save new event data", inject([EventAdminService], (service: EventAdminService) => {
    expect(service).toBeTruthy();
  }));


  it("should update event info properties", inject([EventAdminService], (service: EventAdminService) => {
    expect(service).toBeTruthy();
  }));


  it("should ...", inject([EventAdminService], (service: EventAdminService) => {
    expect(service).toBeTruthy();
  }));
});
