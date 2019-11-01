
import * as admin from "firebase-admin";
import * as functions from 'firebase-functions';

const SUPER_USER = "l8Rex76EDGTME2i44gbpcF7EKOH2";

async function grantModeratorRole( email: string ) {
   const user = await admin.auth().getUserByEmail( email );
   await admin.auth().setCustomUserClaims( user.uid, { admin: true } );
}

export const grantAdmin = functions.https.onCall( async ( data, context ) => {

   // Only alllow super user or admin user
   if ( context.auth.token.admin === true || context.auth.uid === SUPER_USER ) {
      await grantModeratorRole( data.email );
      return { result: "Request fulfilled! ${email} is now a moderator." };

   } else {
      return { error: "Request not authorized. User must be a super usser or admin to give user admin permissions." };
   }
});
