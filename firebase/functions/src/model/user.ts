
/** data associated with a user */
import { ControlCardType, OEvent } from "./oevent";
import { ISODateString } from "./date";
import { GradeFilter } from "./fixture-filter";

export interface ECard {
    id: string;
    type: ControlCardType;
}

/** Information set by the users abouth themselves */
export interface UserInfo {
    email: string;         // Not on client
    firstname: string;
    surname: string;
    club: string;
    nationality: string;  // short nationality code
    nationalId: string;
    ecards: ECard[];
    autoFind: boolean;
    resultsLastupDated: ISODateString;
    postcode: string;
    fixtureGradeFilters?: GradeFilter[];
}

/** All the user data stored for the user */
export interface UserData extends UserInfo {
    key: string;  // Matches with the users Firebase reference
    results: UserResult[];
    fixtures: UserFixture[] | UserReservation[];
    reminders: string[];  // array of eventIds
    archived: boolean;
}

/** Information on the results for a user.
 * the event key plus the ecard +id uniqiely identifies the result
 */
export interface UserResult {
    ecardId: string;
    event: OEvent;
    firstname: string;
    surname: string;
    club: string;
    result?: {
        course: string;
        courseclass: string;
        coursePosition: number;
        classPosition: number;
        totalTime: number;
        distance: number;
        climb: number;
        courseWinner: string;
        courseWinningTime: number;
        classWinner: string;
        classWinningTime: number;
    };
}

export interface UserFixture {
    eventId: string;
    date: string;
    name: string;
}
export interface UserReservation extends UserFixture {
    course: string;
    waitinglist?: number;
}
