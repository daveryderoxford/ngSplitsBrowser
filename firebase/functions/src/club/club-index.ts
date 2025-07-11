/* eslint-disable require-jsdoc */
/* eslint-disable max-len */
/**
 * Cloud functions to maintain clubs list
*/
import { isEqual } from 'date-fns';
import { getFirestore } from 'firebase-admin/firestore';
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { Club, createClub } from '../model/club.js';
import { clubConverter, eventConverter } from '../model/event-firebase-converters.js';
import { OEvent } from '../model/oevent.js';
import { error, log, warn } from 'firebase-functions/logger';

interface ClubKeyData {
  name: string,
  nationality: string;
}

/** Maintain clubs for newely created event */
export const clubsEventCreated = onDocumentCreated('events/{eventId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    log('clubsEventCreated: No data associated with the event on create.');
    return;
  }
  const evt = snapshot.data() as OEvent;

  await updateClub(evt);

});

const keyChanged = (evt1: OEvent, evt2: OEvent) => (evt1.club !== evt2.club || evt1.nationality !== evt2.nationality);

/** Maintain clubs for updated event */
export const clubsEventUpdated = onDocumentUpdated('events/{eventId}', async (event) => {
  const change = event.data;
  if (!change) {
    log('onDocumentUpdated: No data associated with the event on update.');
    return;
  }

  const written = change.after.data() as OEvent;
  const previous = change.before.data() as OEvent;

  // Club key changed - need to update club for pervious and new event
  if (keyChanged(written, previous)
    || (written.splits?.valid !== previous.splits?.valid)
    || (!isEqual(written.date, previous.date))
  ) {
    await updateClub(written);
    // If the club key itself changed, we must also update the old club's stats.
    // If only the date or splits changed, the club key is the same, and the
    // first `updateClub(written)` call is sufficient.
    if (keyChanged(written, previous)) {
      await updateClub(previous);
    }
  }
});

/** Maintain clubs when event is deleted */
export const clubsEventDeleted = onDocumentDeleted('events/{eventId}', async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    log('onDocumentDeleted: No data associated with the event on delete.');
    return;
  }
  const evt = snapshot.data() as OEvent;

  await updateClub(evt);

});

/** Rebuild the complete clubs list */
export const rebuildClubs = onCall(async (request): Promise<void> => {
  log('rebuildClubs: Rebuilding clubs list...');

  // Check user is at least logged on
  if (!request.auth) {
    log('rebuildClubs: Error: Not authorised to run function');
    throw new HttpsError('permission-denied', 'rebuildClubs: Error: Not authorised to run function');
  }

  const eventsCollection = getFirestore().collection('events').withConverter<OEvent>(eventConverter);
  const eventsSnap = await eventsCollection.get();
  const events = eventsSnap.docs.map(doc => doc.data());

  // Form a map of events for clubkey
  const clubsMap = new Map<string, OEvent[]>();
  for (const evt of events) {
    if (!evt.club || !evt.nationality) {
      warn(`Event with key ${evt.key || 'unknown'} is missing 'club' or 'nationality' property. Skipping.`);
      continue;
    }

    const clubKey = makeClubKey(evt.club, evt.nationality);

    const eventsForClub = clubsMap.get(clubKey);
    if (eventsForClub) {
      eventsForClub.push(evt);
    } else {
      clubsMap.set(clubKey, [evt]);
    }
  }

  // Delete only events and create new ones in a batch to  ensure an atomic update
  const clubsCollectionRef = getFirestore().collection('clubs').withConverter<Club>(clubConverter);
  const existingClubsSnap = await clubsCollectionRef.get();

  const batch = getFirestore().batch();

  // Add all existing clubs to the batch for deletion.
  existingClubsSnap.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  // Add all newly calculated clubs to the batch to be created.
  for (const clubEvents of clubsMap.values()) {

    const keyData = { name: clubEvents[0].club, nationality: clubEvents[0].nationality };
    const club = createClubFromEvents(clubEvents, keyData);
    const clubRef = clubsCollectionRef.doc(club.key);
    batch.set(clubRef, club);
  }
  await batch.commit();
});


// eslint-disable-next-line no-undef 
// @ts-ignore 
 function printClub(club: Club) {
  log(`club:
    Key: ${club.key} 
    Name: ${club.name}
    Natioanlity: ${club.nationality}
    Last event: ${club.lastEvent.toDateString()}
    numEvents:  ${club.numEvents}
    numSplits ${club.numSplits}
    `);
} 


/** Update club data for a specified event based on current events in the database */
async function updateClub(oevent: OEvent) {
  // The club's name is in the `club` property of the OEvent object.
  const keyData = { name: oevent.club, nationality: oevent.nationality };

  const events = await getEvents(keyData);
  const club = createClubFromEvents(events, keyData);
  
  await writeClub(club);

}

/* Gets clubs for event ordered by event date */
async function getEvents(keyData: ClubKeyData): Promise<OEvent[]> {
  const eventsCollection = getFirestore().collection('events').withConverter<OEvent>(eventConverter);
  const eventQuery = eventsCollection
    .where('club', '==', keyData.name)
    .where('nationality', '==', keyData.nationality)
    .orderBy('date', 'desc');
  const snapshot = await eventQuery.get();
  const events =  snapshot.docs.map((doc) => doc.data());
  return events
}

/* Create cliub object from a list of events */
function createClubFromEvents(events: OEvent[], keyData: ClubKeyData): Club {
  const numSplits = events.reduce<number>((acc, event) => acc + ((event.splits?.valid) ? 1 : 0), 0);
  const lastEvent = (events.length > 0) ? events[0].date : new Date(0);

  const club = createClub({
    name: keyData.name,
    nationality: keyData.nationality,
    numEvents: events.length,
    numSplits: numSplits,
    lastEvent: lastEvent

  });
  return club;
}

// Write club
async function writeClub(club: Club): Promise<void> {
  const clubDoc = getFirestore().doc('clubs/' + club.key).withConverter<Club>(clubConverter);

  if (club.numEvents < 0) {
    error('ClubIndex:  Number of events unexopectily negative for key.  Key: ' + club.key);
  } else if (club.numEvents === 0) {
    await clubDoc.delete();
   // log(`ClubIndex: Deleted club ${club.name}` + '  ' + club.nationality);
  } else {
    await clubDoc.set(club);
  }
}

// Key functions
export function makeClubKey(club: string, nationality: string): string {
  const paddedClub = club.toLowerCase().padEnd(10, '-');
  const key = encodeAsFirebaseKey(paddedClub + nationality);
  return key;
}

const invalidKeyChars: { [key: string]: string } = {
  '%': '%25',
  '.': '%2E',
  '#': '%23',
  '$': '%24',
  '/': '%2F',
  '[': '%5B',
  ']': '%5D',
};

function encodeAsFirebaseKey(str: string) {
  return str.replace(/[%.#$/\[\]]/g, (match) => invalidKeyChars[match]);
}
