// tslint:disable:max-line-length

import { TestBed, inject } from "@angular/core/testing";

import { AngularFireAuth } from "angularfire2/auth";
import { AngularFirestore, AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireStorage, AngularFireStorageModule } from "angularfire2/storage";

import { EventAdminService } from "./event-admin.service";
import { AngularFireModule } from "angularfire2";
import { HttpClient } from "@angular/common/http";
import { OEvent, EventInfo } from "app/model";

const testFirebaseConfig = {
  apiKey: "AIzaSyCht99i3Nsn0WNv8t6skBaq1GY-xlHoZoY",
  authDomain: "splitsbrowsertest.firebaseapp.com",
  databaseURL: "https://splitsbrowsertest.firebaseio.com",
  projectId: "splitsbrowsertest",
  storageBucket: "splitsbrowsertest.appspot.com",
  messagingSenderId: "751003486699"
};

const testEventInfo1: EventInfo = {
  name: "test name 1",
  date: "01/02/2003",
  nationality: "GBR",
  club: "SN",
  grade: "Regional",
  type: "Foot",
  discipline: "Long",
  webpage: "www.sn.co.uk",
  email: "fred@splitsbrowser.org.uk",
  punchingType: "SI"
};

const testEventInfo2: EventInfo = {
  name: "test name 2",
  date: "09/08/2007",
  nationality: "NOR",
  club: "TVOC",
  grade: "Local",
  type: "Trail",
  discipline: "Urban",
  webpage: "www.tvoc.co.uk",
  email: "joe@splitsbrowser.org.uk",
  punchingType: "Emit"
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


describe("EventAdminService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EventAdminService],
      imports: [
        AngularFireModule.initializeApp(testFirebaseConfig),
        AngularFirestoreModule,
        AngularFireStorageModule,
        HttpClient
      ]
    });
  });

  it("should ...", inject([EventAdminService], (eventAdmin: EventAdminService) => {
    expect(eventAdmin).toBeTruthy();
  }));

  it("should save new event data", inject([EventAdminService], async (eventAdmin: EventAdminService) => {
    const key = await eventAdmin.saveNew(testEventInfo1);
    expect(key).toBeDefined();

    const eventresult = await eventAdmin.getEvent(key).toPromise();

    expect(eventresult.key).toBeDefined();
    expect(eventresult.splits).toBeNull();
    expect(eventresult).toEqual(jasmine.objectContaining(testEventInfo1));

    await eventAdmin.delete(eventresult);

    const eventresult1 = await eventAdmin.getEvent(key).toPromise();

  }));

  it("should update event info properties", inject([EventAdminService], async (eventAdmin: EventAdminService) => {
    const key = await eventAdmin.saveNew(testEventInfo1);

    await eventAdmin.updateEventInfo(key, testEventInfo2);

    const eventresult = await eventAdmin.getEvent(key).toPromise();
    expect(eventresult).toEqual(jasmine.objectContaining(testEventInfo2));

  }));

  it("should save a results and update summary etc", inject([EventAdminService], async (eventAdmin: EventAdminService) => {
    const key = await eventAdmin.saveNew(testEventInfo1);
    const eventresult = await eventAdmin.getEvent(key).toPromise();

    const file = new File(resultsfile, 'test');
    await eventAdmin.uploadResults(eventresult, file);

    const eventresult1 = await eventAdmin.getEvent(key).toPromise();
    expect(eventresult1.splits).toBeObject();
    expect(eventresult1.summary.courses).toBeArrayOfSize(2);
    expect(eventresult1.summary.numcompetitors).toEqual(6);

    // re-read the results and make sure they exist

    // Read competitor array


  }));
});

it("should update a results file that has already been downloaded once", inject([EventAdminService], async (eventAdmin: EventAdminService) => {
  const key = await eventAdmin.saveNew(testEventInfo1);
  const eventresult = await eventAdmin.getEvent(key).toPromise();

  const file = new File(resultsfile, 'test');
  await eventAdmin.uploadResults(eventresult, file);


}));

it("should delate the datbase entry and file when the event is deleted", inject([EventAdminService], async (eventAdmin: EventAdminService) => {
  const key = await eventAdmin.saveNew(testEventInfo1);
  const eventresult = await eventAdmin.getEvent(key).toPromise();

  const file = new File(resultsfile, 'test');
  await eventAdmin.uploadResults(eventresult, file);

  await eventAdmin.delete(eventresult);
   
}));


it("should rollback when db transaction fails", inject([EventAdminService], (eventAdmin: EventAdminService) => {
  // TODO not sure how to test this.
}));
