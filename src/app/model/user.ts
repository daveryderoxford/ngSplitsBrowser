
/** data associated with a user */
import { EventInfo, ControlCardType } from "./oevent";

/** All the user data stored for the user */
export interface UserData extends UserInfo {
    key: string;  // Matches with the users Firebase reference
    results: Array<UserResultData>;
}

export interface ECard {
    id: string;
    type: ControlCardType;
}

/** Information on the results for a user.  */
export interface UserResultData {
   eventInfo:  EventInfo;
   course: string;
   courseclass: string;
   name: string;
   classPosition: number;
   totalTime: number;  // in milliseconds
   distance: number;
   climb: number;
   courseWinner: string;
   courseWinningTime: number;
   classWinner: string;
   classWinningTime: number;
 }

 /** Information set by the users abouth themselves */
export interface UserInfo {
    firstName: string;
    lastName: string;
    club: string;
    nationality: string;  // short nationality code
    nationalId: string;   //
    ecards: Array<ECard>;
    ecardSI: string;      // hard coded ecard ids so I can search on them
    ecardEmit: string;
    autoFind: boolean;
    resultsLastupDated: Date;
}
