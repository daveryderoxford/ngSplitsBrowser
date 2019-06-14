/**
 * Cloud functions to maintain clubs list
*/
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Club } from "model/club";
import { OEvent } from "model/oevent";

/** Maintain clubs for newely created event */
export const created = functions.firestore
   .document('events/{eventId}')
   .onCreate(async (snapshot) => {
      const evt = snapshot.data() as OEvent;

      const clubs = await readClubs();

      addClubReference(clubs, evt);

      await writeClubs(clubs);
   });

/** Maintain clubs for updated event */
export const updated = functions.firestore
   .document('events/{eventId}')
   .onUpdate(async (change, context) => {
      const written = change.after.data() as OEvent;
      const previous = change.before.data() as OEvent;

      // Club changed
      if ((written.club !== previous.club) || (written.nationality !== previous.nationality)) {

         const clubs = await readClubs();

         removeClubReference(clubs, previous);
         addClubReference(clubs, written);

         await writeClubs(clubs);
      }

      // Splits status changed.  Increment/decement the counter
      if ( splitsValid(written) !== splitsValid(previous)) {
          const clubs = await readClubs();

          const club = findClub(clubs, written);
          if (splitsValid(written)) {
            club.numSplits++;
          } else {
            club.numSplits--;
          }
      }

   });

   function splitsValid(evt: OEvent): boolean {
      return evt.splits && evt.splits.valid;
   }

/** Maintain clubs when event is deleted */
export const deleted = functions.firestore
   .document('events/{eventId}')
   .onDelete(async (snapshot, context) => {
      const evt = snapshot.data() as OEvent;

      const clubs = await readClubs();

      const club = findClub(clubs, evt);
      if (splitsValid(evt)) {
        club.numSplits--;
      }

      removeClubReference(clubs, evt);

      await writeClubs(clubs);

   });

/** Rebuild the complete clubs list */
export const rebuildClubs = functions.https.onCall( async (data, context): Promise<void> => {

   // Check user is at least logged on
   if ( !context.auth ) {
      throw new functions.https.HttpsError('permission-denied' , 'rebuildClubs: Error: Not authorised to run function');
   }

   await admin.firestore().doc('clubs').delete();

   // Read all events
   const snap = await admin.firestore().collection('events').get();
   const events: OEvent[] = snap.docs.map( doc => doc.data() as OEvent );

   // Build new clubs array
   const clubs: Club[] = [];

   for (const evt of events) {
      addClubReference(clubs, evt);

      if ( splitsValid(evt) ) {
         const club = findClub(clubs, evt);
         club.numSplits++;
      }
   }

   await writeClubs(clubs);

});

function addClubReference(clubs: Club[], evt: OEvent): void {

   let club = findClub(clubs, evt);

   if (!club) {
      club = {
         key: makeKey(evt),
         name: evt.club,
         nationality: evt.nationality,
         numEvents: 0,
         numSplits: 0,
         lastEvent: evt.date
      };
      clubs.push(club);
      console.log("Creating new club " + club.name + "  " + club.nationality);
   }

   // Update club data
   club.numEvents = club.numEvents + 1;
   if (new Date(evt.date).valueOf() > new Date(club.lastEvent).valueOf()) {
      club.lastEvent = evt.date;
   }

   console.log("Added club reference " + club.name + "  " + club.nationality + " Num events" + club.numEvents);
}

function removeClubReference(clubs: Club[], evt: OEvent): void {

   const club = findClub(clubs, evt);

   if (!club) {
      console.log("ERROR:  Removing reference club not found - Skipping");
      return;
   }

   club.numEvents = club.numEvents - 1;
   if (club.numEvents === 0) {
      const index = clubs.indexOf(club);
      clubs.splice(index, 1);
   }

   console.log("Removed club reference " + club.name + "  " + club.nationality + " Num events" + club.numEvents);
}

function findClub(clubs: Club[], evt: OEvent): Club {
   return clubs.find((c) => (evt.club === c.name && evt.nationality === c.nationality));
}

async function readClubs(): Promise<Club[]> {
   const snap = await admin.firestore().doc('clubs').get();
   return snap.data() as Club[];
}

async function writeClubs(clubs: Club[]) {
   await admin.firestore().doc('clubs').set(clubs);
}

// Key functions
function makeKey(evt: OEvent): string {
   let key = padRight(evt.club.toLowerCase(), 10) + evt.nationality;
   key = encodeAsFirebaseKey(key);
   return key;
}

function padRight(str: string, length: number): string {
   while (str.length < length) {
      str = str + "-";
   }
   return str;
}

function encodeAsFirebaseKey(string) {
   return string.replace(/\%/g, "%25")
      .replace(/\./g, "%2E")
      .replace(/\#/g, "%23")
      .replace(/\$/g, "%24")
      .replace(/\//g, "%2F")
      .replace(/\[/g, "%5B")
      .replace(/\]/g, "%5D");
}
