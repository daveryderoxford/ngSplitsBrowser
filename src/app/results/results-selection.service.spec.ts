import { TestBed, inject } from "@angular/core/testing";

import { ResultsSelectionService } from "./results-selection.service";
import { HttpClient } from "@angular/common/http";
import { Results, CourseClass, Course, Competitor } from "./model";
import { EventTypes } from "app/model";

type EventType = "results" | "control" | "competitor" | "course";

let selectedResult: Results;
let selectedConpetitors: Competitor[];
let selectedControl: string;
let selectedClass: CourseClass;
let selectedCourse: Course;
let eventsRecieved: EventType[];
let eventcount;


function checkState( eventOrdering: EventType[]) {

}

function eventRecieved(eventType: EventType, actual: any, expected: any) {
  // Check the event order
  eventcount++;
  expect(eventType).toBe(eventsRecieved[eventcount]);
  // Check the event contents
  expect(actual).toBe(expected);
}

/** */
function registerListeners(service: ResultsSelectionService) {
  service.selectedResults.subscribe( res => eventRecieved( 'results', res, selectedResult));
  service.selectedCompetitors.subscribe( res => selectedConpetitors = res);
  service.selectedCompetitors.subscribe( res => selectedConpetitors = res);
  service.selectedClass.subscribe( res => selectedConpetitors = res);
  
  eventcount = 0;
}


describe("ResultsSelectionService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ResultsSelectionService,
        AngularFireStorage,
        HttpClient
      ]
    });
  });

  it("should be created", inject([ResultsSelectionService], (service: ResultsSelectionService) => {
    expect(service).toBeTruthy();
  }));

  it("should load results from file", inject([ResultsSelectionService], (service: ResultsSelectionService) => {
    registerListeners(service);


 
    service.loadResults
    await checkSele
    
    expect(service).toBeTruthy();
  }));

});
