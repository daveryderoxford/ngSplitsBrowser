/* eslint-disable max-len */

import { UserData, OEvent, SplitsFileInfo, EventSummary } from "app/model";

/** User data */
export const user1 = { uid: "user1", email: "user1@example.com" };
export const user2 = { uid: "user2", email: "user2@example.com" };
export const user3 = { uid: "user3", email: "user3@example.com" };
export const users = [user1, user2, user3];

/** User data */
export const userdata1: UserData = {
   /** All the user data stored for the user */
   key: 'user1',
   results: [],
   firstname: 'Firstname 1',
   surname: 'Surname 1',
   club: 'ACLUB',
   nationality: 'GBR',
   nationalId: 'GBR12345',
   ecards: [{ id: '11111', type: 'SI' }, { id: '55555', type: "Emit" }],
   autoFind: true,
   resultsLastupDated: new Date('2018-10-21').toISOString()
};
export const userdata2: UserData = {
   /** All the user data stored for the user */
   key: 'user2',
   results: [],
   firstname: 'Firstname 2',
   surname: 'Surname 2',
   club: 'BCLUBNAME',
   nationality: 'NOR',
   nationalId: 'NOR12345',
   ecards: [{ id: '22222', type: 'SI' }, { id: '66666', type: "Emit" }],
   autoFind: false,
   resultsLastupDated: new Date('2018-10-21').toISOString()
};
export const userdata3: UserData = {
   /** All the user data stored for the user */
   key: 'user3',
   results: [],
   firstname: 'Firstname 3',
   surname: 'Surname 3',
   club: 'ACLUB',
   nationality: 'GBR',
   nationalId: 'GBR12345',
   ecards: [{ id: '33333', type: 'SI' }],
   autoFind: true,
   resultsLastupDated: new Date('2018-10-21').toISOString()
};
export const test_userdata = [userdata1, userdata2, userdata3];


/** OEvents
 * User 1 has 1 event user 2 has 2 events
 */
export const eventA: OEvent = {
   key: 'eventkeyA',
   userId: 'user1',
   yearIndex: 2018,
   gradeIndex: { Regional: true, Local: true },
   name: 'Event A',
   nationality: 'GBR',
   date: '2018-10-21',
   club: 'SN',
   grade: 'Regional',
   type: 'Foot',
   discipline: 'Long',
   webpage: 'www.webpage1.co.uk',
   email: 'user1.@mydomain.co.uk',
   controlCardType: 'SI'
};

export const eventB: OEvent = {
   key: 'eventkeyB',
   userId: 'user2',
   yearIndex: 2018,
   gradeIndex: { National: true, Regional: true, Local: true },
   name: 'Event B',
   nationality: 'GBR',
   date: '2018-10-22',
   club: 'TVOC',
   grade: 'National',
   type: 'Foot',
   discipline: 'Long',
   webpage: 'www.webpage2.co.uk',
   email: 'user2.@mydomain.co.uk',
   controlCardType: 'SI',
};

export const eventC: OEvent = {
   key: 'eventkeyC',
   userId: 'user2',
   legacyPassword: 'Joe',
   yearIndex: 2017,
   gradeIndex: { Local: true },
   name: 'Event C',
   nationality: 'NOR',
   date: '2017-01-10',
   club: 'SN',
   grade: 'Local',
   type: 'Foot',
   discipline: 'Long',
   webpage: 'www.webpageC.co.uk',
   email: 'user2.@mydomain.co.uk',
   controlCardType: 'Emit',
};
export const test_events = [eventA, eventB, eventC];

/* Results Event A
   Event has 2 courses. one with one class and one with 2 classes */
export const splitsInfoA: SplitsFileInfo = {
   uploadDate: new Date('2018-10-23').toISOString(),
   splitsFilename: 'resultsa',
   splitsFileFormat: 'SICSV',
   valid: true,
};
eventA.splits = splitsInfoA;

export const eventSummaryA: EventSummary = {
   numcompetitors: 7,
   courses: [
      { name: 'Course 1', length: 4.1, climb: 35, numcompetitors: 3, classes: ['Class A'] },
      { name: 'Course 2', length: 12.3, climb: 22, numcompetitors: 4, classes: ['Class B', 'Class C', 'Class D'] },
   ]
};
eventA.summary = eventSummaryA;

export const resultsa =
`Stno;SI card;Database Id;Name;YB;Block;nc;Start;Finish;Time;Classifier;Club no.;Cl.name;City;Nat;Cl. no.;Short;Long;Num1;Num2;Num3;Text1;Text2;Text3;Adr. name;Street;Line2;Zip;City;Phone;Fax;Email;Id/Club;Rented;Start fee;Paid;Course no.;Course;Km;m;Course controls;Pl;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;
 ;11; ;Runner A1; ; ; ;10:00:00; ;12:14; ; ; ;ABC; ; ;Class A; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;4;1;10:00:00;10:12:14;212;01:48;229;06:14;208;08:43;222;08:43;
 ;12; ;Runner A2; ; ; ;10:30:00; ;14:12; ; ; ;DEF; ; ;Class A; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;4;2;10:30:00;10:44:12;212;03:37;229;07:56;208;10:32;222;08:43;
 ;13; ;Runner A3; ; ; ;11:00:00; ;13:32; ; ; ;GHI; ; ;Class A; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 1;4.1;35;4;3;11:00:00;11:13:32;212;03:01;229;07:05;208;09:59;222;08:43;
 ;21; ;Runner B1; ; ; ;10:00:00; ;12:14; ; ; ;ABC; ; ;Class B; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;2.3;22;3;1;10:00:00;10:12:14;212;01:48;999;07:05;998;09:59;
 ;22; ;Runner B2; ; ; ;10:30:00; ;14:12; ; ; ;DEF; ; ;Class B; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;2.3;22;3;2;10:30:00;10:44:12;212;03:37;999;07:05;998;09:59;
 ;23; ;Runner C1; ; ; ;11:00:00; ;13:32; ; ; ;GHI; ; ;Class C; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;2.3;22;3;3;11:00:00;11:13:32;212;03:01;999;07:05;998;09:59;
 ;23; ;Runner D1; ; ; ;11:30:00; ;13:32; ; ; ;GHI; ; ;Class D; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ; ;Course 2;2.3;22;3;3;11:00:00;11:30:32;212;03:01;999;07:05;998;09:59;
 `;

 export const test_results = [

 ];

 export const test_clubs = [
    { key: 'GBR-TVOC', name: 'TVOC', nationality: 'GBR', numEvents: 1, lastEvent: '2018-10-21' },
    { key: 'GBR-SN', name: 'SN', nationality: 'GBR', numEvents: 1, lastEvent: '2018-10-21' },
    { key: 'NOR-SN', name: 'SN', nationality: 'NOR', numEvents: 1, lastEvent: '2017-01-10' }
 ];
/* Results Event B */

