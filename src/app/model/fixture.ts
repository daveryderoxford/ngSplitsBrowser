import {EventGrade, EventType,  EventDiscipline, ISODateString } from 'app/model';

export interface SBPoint {
   x: number;
   y: number;
}

export interface Fixture {

     date: ISODateString;
     name: string;
     club: string;

     clubURL?: string;

     gridReference?: SBPoint;
     latLong?: SBPoint;
     grade?: EventGrade;
     type?: EventType;
     discipline?: EventDiscipline;
     webpage?: string;
     nearestTown?: string;
     association?: string;
}
