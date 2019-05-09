export interface FixtureReservation {
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
    name: string;
    club: string;
}



