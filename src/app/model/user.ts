
/** data associated with a user */
import { sbTime } from "../results/model";
import { ControlCardType, OEvent } from "./oevent";
import { ISODateString } from "./date";
import { GradeFilter } from "./fixture-filter";
import { UserFixture } from '../../../firebase/functions/src/model/user';

export interface ECard {
    id: string;
    type: ControlCardType;
}

/** Information set by the users abouth themselves */
export interface UserInfo {
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
        totalTime: sbTime;
        distance: number;
        climb: number;
        courseWinner: string;
        courseWinningTime: sbTime;
        classWinner: string;
        classWinningTime: sbTime;
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
