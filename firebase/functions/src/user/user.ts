import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserData } from "../model/user.js";

/** Creates new user data and saves it to the database */
function createUserData(): UserData {
    const userdata: UserData = {
        key: "",
        email: "",
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

export const createUser = functions.auth.user().onCreate(async (user: any, context) => {
    // Create user data when a user is created
    const userdata = createUserData();
    userdata.key = user.uid;
    userdata.email = user.email;
    try {
        await admin.firestore().doc( 'users/' + user.uid ).set( userdata );
        console.log( 'Creating user data for ' + user.uid );
    } catch ( err: any ) {
        console.error( 'createUser: Error encountered creating user data.  User Id: ' + user.uid + "  " + err.toString() );
    }
} );

export const deleteUser = functions.auth.user().onDelete(async (user: any) => {
    // When a user is deleted mark the user data as archived
    try {
        await admin.firestore().doc( 'users/' + user.uid ).update( { archived: true } );
    } catch ( err: any) {
        console.error( 'deleteUser: Error encountered marking deleted user as archived.  User Id: ' + user.uid + "  " + err.toString() );
    }
} );
