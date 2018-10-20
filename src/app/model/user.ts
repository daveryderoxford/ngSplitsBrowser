
/** data associated with a user */
import { sbTime } from "app/results/model";
import { ControlCardType, OEvent } from "./oevent";


export interface ECard {
    id: string;
    type: ControlCardType;
}

/** All the user data stored for the user */
export interface UserData extends UserInfo {
    key: string;  // Matches with the users Firebase reference
    results: UserResult[];
}

/** Information set by the users abouth themselves */
export interface UserInfo {
    firstname: string;
    surname: string;
    club: string;
    nationality: string;  // short nationality code
    nationalId: string;   //
    ecards: ECard[];
    autoFind: boolean;
    resultsLastupDated: Date;
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


