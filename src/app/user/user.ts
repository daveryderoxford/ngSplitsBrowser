/** data associated with a user */
import { UserResult } from '../user-results/user-result';

/** All the user data stored for the user */
export interface UserData   {
    key: string;  // Matches with the users Firebase reference
    email: string;
    firstname: string;
    surname: string;
    club: string;
    nationality: string;  // short nationality code
    nationalId: string;
    postcode: string;
    results: UserResult[];
}