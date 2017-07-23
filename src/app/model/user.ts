
/** data associated with a user */
import { EventInfo } from 'app/model/oevent';

export interface FullUserData extends UserInfo {
    $key: string;  // Firsbase user Id.
    results: Array<UserResultData>;
}

export interface UserResultData extends EventInfo {
   course: string;
   class: string;
   distance: number;
   climb: string;
   courseWinner: string;
   coursePosition: number;
   courseWinningTime: number;
   classWinner: string;
   classWinningTime: number;
   classPosition: number;
   time: number;  // in milliseconds
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
