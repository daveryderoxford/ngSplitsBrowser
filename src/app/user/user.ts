/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/

/** data associated with a user */
import { sbTime } from "../results/model";
import { OEvent } from "../events/model/oevent";

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

/** Information on the results for a user.
 * the event key plus the ecard +id uniqiely identifies the result
 */
export interface UserResult {
    ecardId: string;
    event: OEvent;
    firstname: string;
    surname: string;
    club: string;
    result: {
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
