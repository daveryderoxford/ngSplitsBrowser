
/** data associated with a user */
export interface ExtUserData extends UserInfo {
    $key: string;  // Firsbase user Id.
    events: Array<string>;
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
