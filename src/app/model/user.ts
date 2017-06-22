

/** data associated with a user */
export interface UserData {
    events?: Array<string> | null;
    club?: string | null;
    nationality?: string | null;
    nationalId?: number | null;
    EcardSI?: number | null;      // hard coded so I can search on them
    EcardEmit?: number | null;
    autoFind: boolean;
}
