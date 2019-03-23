
import { Club, OEvent, UserData } from "app/model";
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);


exports.updateEvent = functions.firestore
  .document( 'events/{eventId}' )
  .onUpdate( async ( change, context ) => {
    // Get an object representing the current document
    const newValue = change.after.data();

    // ...or the previous value before this update
    const previousValue = change.before.data();

     // Maintain list of clubs
    if ( newValue.club !== previousValue.club) {
        const clubs = await readClubs();
       removeReference( previousValue, clubs);
       addReference( newValue, clubs);


    }
  } );


exports.eventIndices = functions.database.ref("/events/{key}").onWrite(async event => {

  const written = event.data.val() as OEvent;
  const previous: OEvent = event.data.previous.val();


  if ((written.club !== previous.club) ||
    (written.date !== previous.date)) {

  }

});

exports.eventClubReferencesUpdate = functions.database.ref("/events/{key}").onUpdate(async event => {
  const written: OEvent = event.data.val();
  const previous: OEvent = event.data.previous.val();

  if ((written.club !== previous.club) ||
    (written.nationality !== previous.nationality)) {
    await removeClubReference(previous);
    await addClubReference(written);

    
  }
});

exports.eventClubReferencesDelete = functions.database.ref("/events/{key}").onDelete(async event => {
  await removeClubReference(event.data.previous.val());
});

exports.eventClubReferencesCreate = functions.database.ref("/events/{key}").onCreate(async event => {
  await addClubReference(event.data.val());
});

/** Read clubs object */
async function readClubs(): Promise<Club[]> {
   const doc = await admin.firestore().doc('/clubs/clubs').get();
   return doc.data() as Club[];
}
async function writeClubs(clubs: Club[]): Promise<void> {

}



