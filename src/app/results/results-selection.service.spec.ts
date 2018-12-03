
import 'jasmine-expect';
import { eventA, resultsa } from "app/test/testdata.spec";
import { of, zip } from "rxjs";
import { ResultsSelectionService } from "./results-selection.service";

let httpClientSpy: { get: jasmine.Spy };

let angularFirestoreSpy: {
  doc: jasmine.Spy,
  collection: jasmine.Spy,
 };

let angularFireStorageSpy: {
  ref: jasmine.Spy;
};

let service: ResultsSelectionService;

describe("ResultsSelectionService", () => {
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    angularFireStorageSpy = jasmine.createSpyObj('AngularFireStorage', ['ref']);
    angularFirestoreSpy = jasmine.createSpyObj('AngularFirestore', ['doc']);

    service = new ResultsSelectionService(<any> angularFirestoreSpy, <any> angularFireStorageSpy, <any> httpClientSpy );

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

  it("should set selected event and emit the relivant events", (done: DoneFn) => {

    const selectedResult = null;

    spyOn(service, "downloadResultsFile").and.returnValue(of(resultsa));

    /* Zip waits for for all expected observables to emit then emits array of value obtained */
    zip([
      service.selectedResults,
      service.selectedCompetitors,
      service.selectedControl,
      service.selectedClass,
      service.selectedCourse],
      (result, comps, control, oclass, çourse) => {
        expect(result).toEqual(selectedResult);
        expect(comps).toBe([]);
        expect(control).toBe('');
        expect(oclass).toEqual(selectedResult.classes[0]);
        expect(çourse).toBe(null);
        done();
      });

    service.setSelectedEvent(eventA).subscribe(oevent => {
      expect(oevent).toBe(selectedResult);
    });
  });

  it("should raise an error is selected result does not exist", (done: DoneFn) => {
  });

});
