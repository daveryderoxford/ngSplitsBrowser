import { ISODateString } from './date';
import { EventGrade, EventType, EventDiscipline } from './oevent';

export interface LatLong {
   lat: number;
   lng: number;
}

export interface Fixture {
     id: string;
     date: ISODateString;
     name: string;
     club: string;
     clubURL?: string;
     latLong?: LatLong;
     grade?: EventGrade;
     type?: EventType;
     discipline?: EventDiscipline;
     webpage?: string;
     nearestTown?: string;
     association?: string;
     postcode?: string;
}
