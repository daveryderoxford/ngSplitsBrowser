export interface FixtureReservation {
    eventId: string;
    userId: string;
    type: string;
    closeingDate: string;
    courses: FixtureCourse[];
}

export interface FixtureCourse {
    name: string;
    distance: number;
    maxMaps: number;
    reservations: MapReservation[];
}

export interface MapReservation {
    userId: string;
    firstname: string;
    surname: string;
    club: string;
    madeAt: string;
    ecard: number;
}
