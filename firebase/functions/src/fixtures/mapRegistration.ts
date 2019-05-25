

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

exports.addMapRegistration = functions.https.onCall(  (data, context) => {
  // Read result of the Cloud Function.

    // Message text passed from the client.
    const text = data.text;
    // Authentication / user information is automatically added to the request.
    const uid = context.auth.uid;
    const name = context.auth.token.name || null;
    const picture = context.auth.token.picture || null;
    const email = context.auth.token.email || null;

});
