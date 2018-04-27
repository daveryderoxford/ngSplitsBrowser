
/** data associated with a user */
import { EventInfo } from "app/model/oevent";

/** All the user data stored for the user */
export interface UserData extends UserInfo {
    key: string;  // Matches with the users Firebase reference
    results: Array<UserResultData>;
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
    ecardSI: string;      // hard coded ecard ids so I can search on them
    ecardEmit: string;
    autoFind: boolean;
}

/** Informtion on users ecards */
export interface ECardInfo {
    id: string;
    type: string;
}
