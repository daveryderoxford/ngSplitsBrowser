/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as logger from "firebase-functions/logger";
import { UserData } from "../model/user.js";
import { userConverter } from '../model/user-firebase-converters.js';


/** Creates new user data and saves it to the database */
function createUserData(uid: string, email?: string): UserData {
    const userdata: UserData = {
        key: uid,
        email: email ?? "",
        firstname: "",
        surname: "",
        club: "",
        nationality: "", 
        nationalId: "",
        results: [],
        postcode: "",
    };
    return userdata;
}

export const createUser = functions.auth.user().onCreate(async (user) => {
    const userdata = createUserData(user.uid, user.email);
    try {
        await getFirestore().collection('users').doc(user.uid).withConverter(userConverter).set(userdata);
        logger.info(`Successfully created user data for ${user.uid}`);
    } catch (err) {
        logger.error(`createUser: Error creating user data for ${user.uid}.`, err);
    }
});

export const deleteUser = functions.auth.user().onDelete(async (user) => {
    // When a user is deleted, mark the user data as archived
    try {
        // Also update email to prevent a new user with the same email from linking to old data.
        const deletedEmail = user.email ? `${user.email}-DELETED` : `${user.uid}-DELETED`;
        await getFirestore().collection('users').doc(user.uid).update({ archived: true, email: deletedEmail });
        logger.info(`Successfully marked user ${user.uid} as archived.`);
    } catch (err) {
        logger.error(`deleteUser: Error archiving user ${user.uid}.`, err);
    }
});
