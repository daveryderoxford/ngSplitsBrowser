
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
    name: string;
    date: string;
    club: string;
    createdAt: string;
    fixtureId: string;         // Related to BOF event ID
    userId: string;          // Administrator for the entry
    type: EntryType;         // Type of entry allowed
    closingDate: string;    // Closing Date
    hasAgeClasses: boolean;
    courses: EntryCourse[];
    latestEntry: number;
}

export interface Entry {
    id: string;         // ID for the entry - generated from course Id plus count
    fixtureId: string;
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
    hiredCard?: boolean;
}

export interface FixtureDetailsAndEntries {
    details: FixtureEntryDetails;
    entries: Entry[];
}

/** A transaction to make a number of entries */
export interface EntryTransaction {
   userId: string;
   madeAt: string;
   price: number;
}


