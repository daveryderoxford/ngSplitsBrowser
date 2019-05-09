import { ISODateString } from './date';
import { FixtureReservation } from './fixture-reservation';
import { EventDiscipline, EventGrade, EventType } from './oevent';

export interface LatLong {
   lat: number;
   lng: number;
}

export interface Fixture {
     id: string;
     date: ISODateString;
     name: string;
     club: string;
     clubURL: string;
     area: string;
     latLong?: LatLong;
     postcode: string;
     grade: EventGrade;
     type: EventType;
     discipline: EventDiscipline;
     webpage: string;
     nearestTown: string;
     association: string;
     distance?: number;
     hidden?: boolean;
     fixtureReservation?: FixtureReservation;
}
