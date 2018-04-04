
/** data associated with a user */
import { EventInfo } from "app/model/oevent";

export interface UserData extends UserInfo {
    $key: string;  // Firsbase user Id.
    results: Array<UserResultData>;
}

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

export interface UserInfo {
    firstName: string;
    lastName: string;
    yearOfBirth: number;
    club: string;
    nationality: string;
    nationalId: number;
    ecardSI: number;      // hard coded ecard ids so I can search on them
    ecardEmit: number;
    autoFind: boolean;
}
