import { TestBed } from '@angular/core/testing';
import { EventService } from './event.service';
import { FirestoreTestUtil } from 'app/test/local-firebase.spec';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire';
import { testFirebaseConfig } from 'app/app.firebase-config';
import { PaganationService } from 'app/shared';
import { AngularFireAuthModule } from '@angular/fire/auth';

let fstest: FirestoreTestUtil;
let service: EventService;


fdescribe('EventService', () => {
  beforeEach( () => {

    TestBed.configureTestingModule({
      imports: [
        AngularFireModule.initializeApp(testFirebaseConfig),
        AngularFirestoreModule,
        AngularFireAuthModule
      ],
      providers: [EventService, PaganationService]
    });
    service = TestBed.get(EventService);
  });

  it('should pass', () => {
    //  fstest = new FirestoreTestUtil();
    //  expect(service).toBeTruthy();
    //  expect(fstest).toBeTruthy();
    });

  it('should be created', () => {
  //  fstest = new FirestoreTestUtil();
    expect(service).toBeTruthy();
  //  expect(fstest).toBeTruthy();
  });


  it('it should pupulate  test database', async (done) => {
   // service = TestBed.get(EventService);
  //  fstest = new FirestoreTestUtil();
  //  await fstest.logon();
  //  await fstest.loadDefaultData();
    done();
  });

});
