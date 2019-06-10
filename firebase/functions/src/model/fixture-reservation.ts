export interface FixtureReservation {
    eventId: string;
    closeingDate: string;
    courses: FixtureCourse[];
}

export interface FixtureCourse {
    name: string;
    distance: number;
    reservations: MapReservation[];
}

export interface MapReservation {
    userId: string;
    firstname: string;
    surname: string;
    club: string;
    madeAt: string;
    ecard: number;
    waitinglist?: number;
}
