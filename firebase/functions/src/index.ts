// import { OEvent } from '../../../src/app/model/oevent';

import {UserData} from 'app/model';

export interface OEvent extends EventInfo {
  $key?: string;
  user: string;
  legacyPassword?: string;
  date_club_index?: string;
  club_date_index?: string;
}

export interface EventInfo {
  name: string;
  nationality: string;
  eventdate: string;
  club: string;
  type: string;
  webpage: string;
  email: string;
}

interface Club {
  name: string;
  nationality: string;
  numEvents: number;
}

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp(functions.config().firebase);

exports.updateUser = functions.firestore
    .document('users/{userId}')
    .onUpdate((change, context) => {
      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const updated = change.after.data() as UserData;

      // ...or the previous value before this update
      const old = change.before.data() as UserData;



      // If samrtcard has changed then look for new samrtcards

      // if names or club has changed look for new name/club
      if  ( !old || (updated.firstName !== old.firstName) || updated.surname !== old.surname) { } );
      {
        // Query for results
      }


    })

exports.eventIndices = functions.database.ref("/events/{key}").onWrite(async event => {

  const written = event.data.val() as OEvent;
  const previous: OEvent = event.data.previous.val();


  if ((written.club !== previous.club) ||
    (written.eventdate !== previous.eventdate)) {

    written.club_date_index = padRight(written.club.toLowerCase(), 10) + decreasingTimeIndex(written.eventdate);
    written.date_club_index = decreasingTimeIndex(written.eventdate) + padRight(written.club.toLowerCase(), 10);

    return (await event.data.ref.set(written));
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

function decreasingTimeIndex(dateStr: string): string {
  const d1 = new Date("2050-01-01 00:00:00").getTime() / 1000;
  const d2 = new Date(dateStr).getTime() / 1000;
  const minusDate = d1 - d2;

  const str = padRight(minusDate.toString(), 15);
  return (str);
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

