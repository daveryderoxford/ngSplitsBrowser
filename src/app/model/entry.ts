
export type EntryType = "MapReservation" | "OnlineEntry";

export type PreferedStart = "Early" | "Middle" | "Late";

export interface EntryCourse {
    name: string;
    maxMaps: number;
    reservedMaps: number;
    distance?: number;
    climb?: number;
    ageClasses?: string[];
}

export interface FixtureEntryDetails {
    fixtureId: string;         // Related to BOF event ID
    userId: string;          // Administrator for the entry
    type: EntryType;         // Type of entry allowed
    closeingDate: string;    // Closing Date
    hasAgeClasses: boolean;
    courses: EntryCourse[];
}

export interface Entry {
    id: string;         // ID for the entry - generated from course Id plus count
    userId: string;     // User Id of competitor
    course: string;
    ageClass?: string;
    firstname: string;
    surname: string;
    club?: string;
    madeAt: string;
    ecard?: number;
    preferedStart?: PreferedStart;
    startTime?: string;
    hiredCard: boolean;
}

export interface EntryGroup {
   userId: string;
   price: number;
}


