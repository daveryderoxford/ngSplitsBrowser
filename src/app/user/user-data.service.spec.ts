import { TestBed, inject } from '@angular/core/testing';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { testFirebaseConfig } from 'app/app.firebase-config';
import { EventService } from 'app/events/event.service';
import { ResultsSelectionService } from 'app/results/results-selection.service';
import { UserDataService } from './user-data.service';

xdescribe('UserDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideFirebaseApp(() => initializeApp(testFirebaseConfig)),
        provideAuth(() => getAuth()),
        provideFirestore(() => getFirestore()),
        UserDataService,
        EventService,
        ResultsSelectionService,
      ]
    });
  });

  it('should be created', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('user data on first login', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('user data when not logged in', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));

  it('should be created', inject([UserDataService], (service: UserDataService) => {
    expect(service).toBeTruthy();
  }));


});
