import { ISODateString } from './date';
import { EventDiscipline, EventGrade, EventType } from './oevent';

export interface LatLong {
   lat: number;
   lng: number;
}

export interface Point {
   east: number;
   north: number;
}

export interface RGData {
   baseURL: string;
   maps: { id: string; name: string, mapfile: string }[];
}

export interface Fixture {
     id: string;
     date: ISODateString;
     name: string;
     club: string;
     clubURL: string;
     area: string;
     latLong?: LatLong;
     gridRef?: Point;
     postcode: string;
     grade: EventGrade;
     type: EventType;
     discipline: EventDiscipline;
     webpage: string;
     nearestTown: string;
     association: string;
     distance?: number;
     rg: RGData;
}
