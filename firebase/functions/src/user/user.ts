/** User administration cloud functions
 * Note that currently user onAuthCreate and onAuthDelete triggers 
 * are not support for Firebase v2 functions so we are limited to using Node version 20.
 * https://github.com/firebase/firebase-functions/issues/1383#issuecomment-3352900566
 */
import { getFirestore } from 'firebase-admin/firestore';
import * as functions from 'firebase-functions';
import * as logger from "firebase-functions/logger";
import { UserData } from "../model/user.js";
import { userConverter } from '../model/user-firebase-converters.js';

export const createUser = functions.auth.user().onCreate(async (user) => {

  const names = getNames(user.displayName);

  const userdata = createUserData(user.uid, names, user.email );
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

/** Creates new user data and saves it to the database */
function createUserData(uid: string, names: [string, string], email?: string): UserData {
  const userdata: UserData = {
    key: uid,
    email: email ?? "",
    firstname: names[0] ?? "",
    surname: names[1] ?? "",
    club: "",
    nationality: "",
    nationalId: "",
    results: [],
    postcode: "",
  };
  return userdata;
}

// Split displayName into first/last name using first occurance of space character
function getNames(displayName: string | undefined): [string, string] {
  if (!displayName) {
    return ['', ''];
  } else {
    const index = displayName.indexOf(' ');
    const firstname = displayName.substring(0, index);
    const lastname = displayName.substring(index + 1);
    return [firstname, lastname];
  }
}
