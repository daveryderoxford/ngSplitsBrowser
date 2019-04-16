/** Splitsbrowser Goole clould functions exports */

import { OEvent } from "../../../src/app/model/oevent";
import { Club } from "../../../src/app/model/club";

import { Fixtures } from "./fixtures/fixtures";

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

admin.initializeApp(functions.config().firebase);

/** Run to perfrom maintenance tasks once/day */
exports.maintenance = async (event, callback) => {
   const pubsubMessage = event.data;
   console.log(Buffer.from(pubsubMessage.data, 'base64').toString());

   try {
      await new Fixtures().processFixtures();
   } catch (e) {
      console.error("Maintainance task error:  " + e.toString());
   }

   callback();
};


exports.updateEvent = functions.firestore
   .document('events/{eventId}')
   .onWrite(async (change, context) => {
      const written = change.after.data() as OEvent;


   });

exports.updateEvent = functions.firestore
   .document('events/{eventId}')
   .onUpdate(async (change, context) => {
      // Get an object representing the current document
      const newValue = change.after.data() as OEvent;

      // ...or the previous value before this update
      const previousValue = change.before.data() as OEvent;


      if (newValue.club !== previousValue.club) {
         const clubs = await readClubs();
         await removeClubReference(previousValue);
         await addClubReference(newValue);


      }

   });

exports.eventClubReferencesUpdate = functions.firestore
   .document('events/{eventId}')
   .onUpdate(async (change, context) => {
      const written = change.after.data() as OEvent;

      // ...or the previous value before this update
      const previous = change.before.data() as OEvent;

      if ((written.club !== previous.club) ||
         (written.nationality !== previous.nationality)) {
         await removeClubReference(previous);
         await addClubReference(written);


      }
   });

exports.eventClubReferencesDelete = functions.firestore
   .document('events/{eventId}')
   .onDelete(async (snapshot) => {
      const event = snapshot.data() as OEvent;
      await removeClubReference(event);
   });

exports.eventClubReferencesCreate = functions.firestore
   .document('events/{eventId}')
   .onCreate(async (snapshot) => {
      const event = snapshot.data() as OEvent;

      await addClubReference(event);
   });

/** Read clubs object */
async function readClubs(): Promise<Club[]> {
   const doc = await admin.firestore().doc('/clubs/clubs').get();
   return doc.data() as Club[];
}
async function writeClubs(clubs: Club[]): Promise<void> {

}

async function addClubReference(event: OEvent): Promise<void> {
   const clubRef = getClubRef(event);

   const clubSnapshot: admin.database.DataSnapshot = await clubRef.once("value");
   let club = clubSnapshot.val();

   if (!club) {
      club = {
         name: event.club,
         nationality: event.nationality,
         numEvents: 0
      };
      console.log("Creating new club " + club.name + "  " + club.nationality);
   }
   club.numEvents = club.numEvents + 1;

   await clubRef.set(club);

   console.log("Added club reference " + club.name + "  " + club.nationality + " Num events" + club.numEvents);

}

async function removeClubReference(event): Promise<void> {
   const clubRef = getClubRef(event);
   const clubSnapshot = await clubRef.once("value") as admin.database.DataSnapshot;
   const club: Club = clubSnapshot.val();

   if (!club) {
      console.log("Removing reference club not found");
      return;
   }

   club.numEvents = club.numEvents - 1;
   if (club.numEvents === 0) {
      await clubRef.remove();
   } else {
      await clubRef.set(club);
   }

   console.log("Removed club reference " + club.name + "  " + club.nationality + " Num events" + club.numEvents);
}

function getClubRef(event: OEvent): admin.database.Reference {
   let key = padRight(event.club.toLowerCase(), 10) + event.nationality;
   key = encodeAsFirebaseKey(key);
   const ref = admin.database().ref("clubs/" + key);
   return (ref);
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




