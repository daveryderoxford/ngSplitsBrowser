/* eslint-disable max-len */

/* eslint-disable @typescript-eslint/quotes */
import { provideHttpClient } from "@angular/common/http";
import { inject, TestBed } from "@angular/core/testing";

import 'jasmine-expect';
import { EventInfo } from 'app/events/model/oevent';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { firebaseConfig } from 'app/app.firebase-config';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { EventAdminService } from './event-admin.service';

const testEventInfo1: EventInfo = {
  name: "test name 1",
  date: new Date(2003,2,2), 
  nationality: "SWE",
  club: "TVOC",
  grade: "Regional",
  type: "Foot",
  discipline: "Long",
  webpage: "www.sn.co.uk",
  email: "fred@splitsbrowser.org.uk",
  controlCardType: "SI"
};

const testEventInfo2: EventInfo = {
  name: "test name 2",
  date: new Date(2007, 8,9),
  nationality: "NOR",
  club: "TVOC",
  grade: "Local",
  type: "Trail",
  discipline: "Urban",
  webpage: "www.tvoc.co.uk",
  email: "joe@splitsbrowser.org.uk",
  controlCardType: "Emit"
};

const resultsfile = [
  "Stno;SI card;Database Id;Name;YB;Block;nc;Start;Finish;Time;Classifier;Club no.;Cl.name;City;Nat;Cl. no.;Short;Long;Num1;Num2;Num3;Text1;Text2;Text3;Adr. name;Street;Line2;Zip;City;Phone;Fax;Email;Id/Club;Rented;Start fee;Paid;Course no.;Course;Km;m;Course controls;Pl;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;",
  "; ; ;First Runner; ; ; ;10:00:00; ;12:14; ; ; ;ABC; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;3;1;10:00:00;10:12:14;212;01:48;229;06:14;208;08:43;",
  "; ; ;Second Runner; ; ; ;10:30:00; ;14:12; ; ; ;DEF; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;3;2;10:30:00;10:44:12;212;03:37;229;07:56;208;10:32",
  "; ; ;Third Runner; ; ; ;11:00:00; ;13:32; ; ; ;GHI; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;3;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;",
  "; ; ;Fourth Runner; ; ; ;10:00:00; ;12:14; ; ; ;GHI; ; ;Class 2; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;4.1;35;3;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;",
  "; ; ;Fith Runner; ; ; ;11:00:00; ;14:12; ; ; ;GHI; ; ;Class 2; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;4.1;35;3;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;",
  "; ; ;Sith Runner; ; ; ;12:00:00; ;13:32; ; ; ;GHI; ; ;Class 3; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;4.1;35;3;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;",
];

const resultsfile2 = [
  "Stno;SI card;Database Id;Name;YB;Block;nc;Start;Finish;Time;Classifier;Club no.;Cl.name;City;Nat;Cl. no.;Short;Long;Num1;Num2;Num3;Text1;Text2;Text3;Adr. name;Street;Line2;Zip;City;Phone;Fax;Email;Id/Club;Rented;Start fee;Paid;Course no.;Course;Km;m;Course controls;Pl;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;",
  "; ; ;X Runner; ; ; ;10:00:00; ;12:14; ; ; ;ABC; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course A;4.1;35;3;1;10:00:00;10:12:14;212;01:48;229;06:14;208;08:43;",
  "; ; ;Y Runner; ; ; ;10:30:00; ;14:12; ; ; ;DEF; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course B;4.1;35;3;2;10:30:00;10:44:12;212;03:37;229;07:56;208;10:32",
  "; ; ;Z Runner; ; ; ;11:00:00; ;13:32; ; ; ;GHI; ; ;Class 1; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course C;4.1;35;3;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;",
];

let eventAdmin: EventAdminService;

xdescribe("EventAdminService", () => {
  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(firebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        provideHttpClient(),
        EventAdminService
      ],
    });

    eventAdmin = TestBed.inject(EventAdminService);
  });

  it("should create event admin service", () => {
    expect(eventAdmin).toBeTruthy();
  });

  it("should save new event data", inject([EventAdminService], async (done: any) => {
    const event = await eventAdmin.add(testEventInfo1);
    expect(event).toBeDefined();

    const eventresult = await eventAdmin.getEvent(event.key);

    expect(eventresult.key).toBeDefined();
    expect(eventresult.splits).toBeNull();
    expect(eventresult).toEqual(jasmine.objectContaining(testEventInfo1));

    await eventAdmin.delete(eventresult);

    const eventresult1 = await eventAdmin.getEvent(event.key);

    done();

  }));

  it("should update event info properties", inject([EventAdminService], async (done: any) => {
    const event = await eventAdmin.add(testEventInfo1);

    await eventAdmin.update(event.key, testEventInfo2);

    const eventresult = await eventAdmin.getEvent(event.key);
    expect(eventresult).toEqual(jasmine.objectContaining(testEventInfo2));

    done();

  }));

  it("should save a results and update summary etc", async (done) => {
    const event = await eventAdmin.add(testEventInfo1);
    const eventresult = await eventAdmin.getEvent(event.key);

    const file = new File(resultsfile, 'test');
    await eventAdmin.uploadResults(eventresult, file);

    const eventresult1 = await eventAdmin.getEvent(event.key);
    expect(eventresult1.splits).toBeObject();
    expect(eventresult1.summary.courses).toBeArrayOfSize(2);
    expect(eventresult1.summary.numcompetitors).toEqual(6);

    // re-read the results and make sure they exist

    // Read competitor array

    done();

  });

  it("should update a results file that has already been downloaded once", async (done) => {
    const event = await eventAdmin.add(testEventInfo1);
    const eventresult = await eventAdmin.getEvent(event.key);

    const file = new File(resultsfile, 'test');
    await eventAdmin.uploadResults(eventresult, file);

    // Read all search results and check them

  });

  it("should delate the datbase entry and file when the event is deleted", async (done) => {
    const event = await eventAdmin.add(testEventInfo1);
    const eventresult = await eventAdmin.getEvent(event.key);

    const file = new File(resultsfile, 'test');
    await eventAdmin.uploadResults(eventresult, file);

    await eventAdmin.delete(eventresult);

  });

  it("should rollback when db transaction fails", async (done) => {
    done();
  });

});
