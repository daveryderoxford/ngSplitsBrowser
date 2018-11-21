import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { FirestoreTestUtil } from 'app/test/local-firebase.spec';
import { AngularFirestoreModule, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { testFirebaseConfig } from 'app/app.firebase-config';
import { PaganationService } from 'app/shared';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { test_clubs, test_events, test_results } from 'app/test/testdata.spec';

let fstest: FirestoreTestUtil;
let service: EventService;

fdescribe('EventService', () => {

  beforeEach(() => {
    console.log('BeforeEach');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(testFirebaseConfig),
        AngularFirestoreModule
      ],
      providers: [EventService, AngularFireAuth, AngularFirestore, PaganationService]
    });
    service = TestBed.get(EventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should populate test database', async (done) => {
    console.log('Populating database');
    expect(service).toBeTruthy();

    fstest = new FirestoreTestUtil();
    const user = await fstest.logon();
    console.log('logged on as ' + user.user.displayName);

    await fstest.loadDefaultData();
    expect(fstest).toBeTruthy();

    done();
  });

  it('shall get clubs ordered by name/nationality', async (done) => {

    fstest = new FirestoreTestUtil();
    await fstest.logon();

    service.getClubs().subscribe((clubs) => {
      expect(clubs.length).toBe(3);
      expect(clubs[0].name).toEqual('SN');
      expect(clubs[0].nationality).toEqual('NOR');
      expect(clubs[1].name).toEqual('SN');
      expect(clubs[2].name).toEqual('TVOC');
      done();
    });
  }, 10000 );

  it('shall get events for club ordered by date', (done) => {

    service.getEventsForClub(test_clubs[0]).subscribe(oevents => {
      expect(oevents.length).toEqual(1);
      expect(oevents[0].name).toEqual(test_events[0].name);
      done();
    });
  });

  it('shall search for events with no search criteria', (done) => {

    service.search('date', null, 1).subscribe(oevents => {

      done();
    });
  });

  it('shall get additional pages of events', (done) => {

    const obs = service.search('date', null, 1);

    service.extendSearch();

    obs.subscribe(oevents => {
      expect(oevents.length).toEqual(2);
      service.extendSearch();
    });

  });

});
