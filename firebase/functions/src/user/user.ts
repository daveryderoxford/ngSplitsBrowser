import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as firebase from "firebase-app";
import { UserData } from "../model/user";

function userFacingMessage(err: Error): string {
    return "An error occurred saving this entry";
}

/** Creates new user data and saves it to the database */
function createUserData(): UserData {
    const userdata: UserData = {
        key: "",
        firstname: "",
        surname: "",
        club: "",
        nationality: "",
        nationalId: "",
        autoFind: true,
        results: [],
        fixtures: [],
        ecards: [],
        resultsLastupDated: new Date().toISOString(),
        postcode: ""
    };
    return userdata;
}

export const createUser = functions.auth.user().onCreate(async (user: firebase.auth.UserRecord, context) => {
    // Create user data when a user is created
    const userdata = createUserData();
    userdata.key = user.uid;
 //   userdata.email = user.email;
    try {
       await admin.firestore().doc('users/' + user.uid).set(userdata);
    } catch (err) {
       console.error('createUser: Error encountered createing user data ' + err.toString());
    }
});

export const deleteUser = functions.auth.user().onDelete(async (user: firebase.auth.UserRecord ) => {
    // When a user is deleted mark the user data as archived
    try {
       await admin.firestore().doc('users/' + user.uid).update( { archived: true } );
    } catch (err) {
       console.error('deleteUser: Error encountered marking deleted user as archived' + err.toString());
    }
});