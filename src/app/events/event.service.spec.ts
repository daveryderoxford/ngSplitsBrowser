/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { TestBed } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth, UserCredential } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { PaganationService } from 'app/shared';
import { test_clubs } from 'app/test/testdata.spec';
import { EventService } from './event.service';
import { Club } from './model/club';
import { testFirebaseConfig } from 'app/app.firebase-config';
import { FirestoreTestUtil } from 'app/test/local-firebase.spec';

function checkClub(club: Club, name: string, nat: string, msg?: string) {
   expect(club.name).toEqual(name, 'check of name for ' + msg);
   expect(club.nationality).toEqual(nat, 'check of nationality for ' + msg);
}

let fstest: FirestoreTestUtil;
let service: EventService;
let user: UserCredential;

xdescribe('EventService', () => {

   beforeAll(async () => {
      console.log('BeforeAll');

      configureAngular();

      console.log('Populating database');
      expect(service).toBeTruthy();

      fstest = new FirestoreTestUtil();
      user = await fstest.logon();
      console.log('logged on as ' + user.user.displayName);

      await fstest.loadDefaultData();
      expect(fstest).toBeTruthy();
   });

   function configureAngular() {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
         providers: [
            provideFirebaseApp(() => initializeApp(testFirebaseConfig)),
            provideAuth(() => getAuth()),
            provideFirestore(() => getFirestore()),
            EventService,
            PaganationService
         ]
      });
      service = TestBed.inject(EventService);
   }

   beforeEach(() => {
      console.log('BeforeEach');
      configureAngular();
   });

   it('should be created', () => {
      expect(service).toBeTruthy();
   });

   it('shall get clubs ordered by name/nationality', (done) => {

      fstest = new FirestoreTestUtil();

      service.getClubs().subscribe((clubs) => {
         console.log('Clubs retrived ');

         expect(clubs.length).toEqual(3);
         checkClub(clubs[0], 'SN', 'GBR', 'first club');
         checkClub(clubs[1], 'SN', 'NOR', 'second club');
         checkClub(clubs[2], 'TVOC', 'GBR', 'third club');
         done();
      });
   });

   it('shall get events for club ordered by date', (done) => {

      service.getEventsForClub(test_clubs[0]).subscribe(oevents => {
         console.log('Evens retrived ');
         expect(oevents.length).toEqual(1);
         expect(oevents[0].name).toEqual('Event B');
         done();
      });
   }, 10000);

   it('shall search for events with no search criteria', (done) => {

      service.search('date', null, 1).subscribe(oevents => {
         // Wait for first event to be reported, Initially we will get null.
         if (oevents.length === 1) {
            expect(oevents.length).toEqual(1);
            expect(oevents[0].name).toEqual('Event B');
            done();
         }
      });
   });

   xit('shall get additional pages of events', (done) => {

      const obs = service.search('date', null, 1);

      service.extendSearch();

      obs.subscribe(oevents => {
         if (oevents.length === 2) {
            expect(oevents.length).toEqual(2);
            expect(oevents[0].name).toEqual('Event B');
            expect(oevents[1].name).toEqual('Event A');
            done();
         }
      });

   });

});
