
export type EntryType = "MapReservation" | "OnlineEntry";

export type PreferedStart = "Early" | "Middle" | "Late";


export interface FixtureEntryDetails {
    eventId: string;         // Related to BOF event ID
    userId: string;          // Administrator for the entry
    type: EntryType;         // Type of entry allowed
    closeingDate: string;    // Closing Date
    courses: {               // Array of course details
        name: string;
        distance: number;
        maxMaps: number;
        ageClasses?: string[];
    }[];
}

export interface Entry {
    Id: string;
    userId: string;     // User Id of competitor
    course: string;
    ageClass: string;
    firstname: string;
    surname: string;
    club: string;
    madeAt: string;
    ecard: number;
    preferedStart?: PreferedStart;
    startTime?: string;
    hiredCard: boolean;
}

export interface EntryGroup {
   userId: string;
   price: number;
}


