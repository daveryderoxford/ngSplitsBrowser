
import 'jasmine-expect';
import { eventA, resultsa } from "app/test/testdata.spec";
import { of, zip } from "rxjs";
import { TestBed } from '@angular/core/testing';
import { Firestore } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { ResultsDataService } from './results-data.service ';

let httpClientSpy: { get: jasmine.Spy; };

let angularFirestoreSpy: {
   doc: jasmine.Spy,
   collection: jasmine.Spy,
};

let angularFireStorageSpy: {
   ref: jasmine.Spy;
};

let service: ResultsDataService;

xdescribe("ResultsDataService", () => {
   beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      angularFireStorageSpy = jasmine.createSpyObj('AngularFireStorage', ['ref']);
      angularFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['doc']);

      TestBed.configureTestingModule({
         providers: [
            ResultsDataService, { provide: Firestore, useValue: angularFireStorageSpy }
         ],
      });
      service = inject(ResultsDataService);

   });

   it("should be created", () => {
      expect(service).toBeTruthy();
   });

   it("should load results for an event", (done: DoneFn) => {

      spyOn(service, "downloadResultsFile").and.returnValue(of(resultsa));

      service.loadResults(eventA).subscribe(results => {
         expect(results.classes.length).toEqual(4);
         expect(results.allCompetitors.length).toEqual(7);
         done();
      });

   });

});

