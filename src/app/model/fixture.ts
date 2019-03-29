import { ISODateString } from './date';
import { EventGrade, EventType, EventDiscipline } from './oevent';

export interface SBPoint {
   x: number;
   y: number;
}

export interface Fixture {
     id: string;
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
     postcode?: string;
}
