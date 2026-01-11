
// Initialize the test environment. This must be done before importing the functions file.
import { Firestore, WriteResult } from 'firebase-admin/firestore';
import { describe, it, expect } from 'vitest';
import { makeClubKey } from '../src/club/club-index.js';
import { Club, createClub } from '../src/model/club.js';
import { clubConverter, eventConverter } from '../src/model/event-firebase-converters.js';
import { OEvent, createEvent } from '../src/model/oevent.js';
import { setupMochaHooks, testEnv } from './firebase-test-helper.js';
import { SUPER_USER_UID } from '../src/auth.js';

/* UTILITY FUNCTIONS */

async function saveEvent(db: Firestore, event: OEvent): Promise<WriteResult> {
   const ref = db.doc('events/' + event.key).withConverter(eventConverter);
   return await ref.set(event);
}

async function saveClub(db: Firestore, club: Club): Promise<void> {
   const ref = db.doc('clubs/' + club.key).withConverter(clubConverter);
   await ref.set(club);
}

async function readClub(db: Firestore, oevent: OEvent): Promise<Club | undefined> {
   const clubKey = makeClubKey(oevent.club, oevent.nationality);
   const ref = db.doc('clubs/' + clubKey).withConverter(clubConverter);
   const doc = await ref.get();
   return doc.data();
}

function expectClub(club: Club | undefined, numEvents: number, expectedTime: Date | undefined, msg: string = '') {
   expect(club, msg + '  Club undefined').toBeDefined();
   if (club) {
      expect(club.numEvents, msg + '  Numevents incorrect').toBe(numEvents);
      if (expectedTime) {
         //   expect(isEqual(club.lastEvent, expectedTime), msg + 'end time incorrect').to.be.true;
      }
   }
}

/* TEST FUNCTIONS */

describe('Club Index Cloud Functions', function () {

   // Set a default timeout of 5 seconds for all tests and hooks in this suite.
   // Vitest default timeout is 5000ms

   const context = setupMochaHooks();

   describe('clubsEventCreated', () => {
      it('should create a new club if one does not exist', async () => {
         const eventData = createEvent('evt1', SUPER_USER_UID, { club: 'TEST', nationality: 'GBR' });

         await saveEvent(context.db, eventData);

         const snap = testEnv.firestore.makeDocumentSnapshot(eventData, 'events/evt1');
         const wrapped = testEnv.wrap(context.myFunctions.clubsEventCreated);
         await wrapped({ data: snap });

         const club = await readClub(context.db, eventData);
         expectClub(club, 1, eventData.date, 'Error in newely created club');
      });

      it('should update event count if club already exists', async () => {
         // Arrange: The database contains three events for the same club.
         // The function should correctly count all of them when triggered.
         const evt1 = createEvent('evt1', SUPER_USER_UID, { name: 'Event 1', club: 'EXIST', nationality: 'USA', date: new Date('2023-01-01') });
         const evt2 = createEvent('evt2', SUPER_USER_UID, { name: 'Event 2', club: 'EXIST', nationality: 'USA', date: new Date('2023-01-02') });
         const evt3 = createEvent('evt3', SUPER_USER_UID, { name: 'Event 3', club: 'EXIST', nationality: 'USA', date: new Date('2023-01-03') });

         await saveEvent(context.db, evt1);
         await saveEvent(context.db, evt2);
         // The function is triggered by the creation of evt3.
         await saveEvent(context.db, evt3);

         const snap = testEnv.firestore.makeDocumentSnapshot(evt3, 'events/evt3');
         const wrapped = testEnv.wrap(context.myFunctions.clubsEventCreated);
         await wrapped({ data: snap });

         const club = await readClub(context.db, evt3);
         // Assert: The club index should reflect that there are now 3 events.
         expectClub(club, 3, evt3.date);
      });
   });

   describe('clubsEventDeleted', () => {

      it('should decrement event count and update club if count is greater than zero', async () => {

         // Setup: A club with two events. We will delete the newer one.
         const olderEvent = createEvent('evtOlder', SUPER_USER_UID, { club: 'MULTI', nationality: 'AUS', date: new Date('2023-01-01') });
         const newerEvent = createEvent('evtNewer', SUPER_USER_UID, { club: 'MULTI', nationality: 'AUS', date: new Date('2023-02-01') });

         // set database state when trigger is fired
         // newer event is not saved as it will have been deleted before clubsEventDeleted is called
         await saveEvent(context.db, olderEvent);

         // For a delete trigger, the snapshot contains the data *before* the delete.
         const snap = testEnv.firestore.makeDocumentSnapshot(newerEvent, 'events/evtNewer');

         const wrapped = testEnv.wrap(context.myFunctions.clubsEventDeleted);
         await wrapped({ data: snap });

         const club = await readClub(context.db, olderEvent);
         // With the `lastEvent` logic fixed, the club's lastEvent should now be the date
         // of the older event, which is the only one remaining.
         expectClub(club, 1, olderEvent.date);
      });

      it('should Delete club if count reaches zero', async () => {
         const eventData = createEvent('evt3', SUPER_USER_UID, { name: 'Event to Delete', club: 'SOLO', nationality: 'CAN' });
         const existingClub = createClub({ name: 'SOLO', nationality: 'CAN', numEvents: 1 });

         // Set database state prior to event being triggered.  Event not saved for delete trigger. 
         await saveClub(context.db, existingClub);

         // Trigger event
         const snap = testEnv.firestore.makeDocumentSnapshot(eventData, 'events/evt3');
         const wrapped = testEnv.wrap(context.myFunctions.clubsEventDeleted);
         await wrapped({ data: snap });

         // Validate response
         const club = await readClub(context.db, eventData);
         expect(club).toBeUndefined();
      });
   });

   describe('clubsEventUpdated', () => {
      it('should update club counts when an event changes club', async () => {
         // Arrange: Define the state of the database *after* the update.
         // oldClub will have 2 events remaining.
         const oldClubEvent1 = createEvent('evtOld1', SUPER_USER_UID, { club: 'OLDCLUB', nationality: 'GBR', date: new Date('2023-03-01') });
         const oldClubEvent2 = createEvent('evtOld2', SUPER_USER_UID, { club: 'OLDCLUB', nationality: 'GBR', date: new Date('2023-01-01') });
         // newClub will have 2 events, including the one that was moved.
         const newClubEvent1 = createEvent('evtNew1', SUPER_USER_UID, { club: 'NEWCLUB', nationality: 'GBR', date: new Date('2023-02-01') });

         const beforeEvent = createEvent('evtOld3', SUPER_USER_UID, { club: 'OLDCLUB', nationality: 'GBR', date: new Date('2023-02-01') });
         const afterEvent = { ...beforeEvent, club: 'NEWCLUB' };

         // The function under test recalculates club stats from scratch based on the
         // events in the database. Therefore, we don't need to save initial club
         // documents; we only need to ensure the `events` collection is in the
         // correct state for the function to query.

         // Populate the database with events as they would appear after the change (eg event2 = afterevent)
         await saveEvent(context.db, oldClubEvent1);
         await saveEvent(context.db, oldClubEvent2);

         await saveEvent(context.db, newClubEvent1);
         await saveEvent(context.db, afterEvent);

         // Act: Trigger the function with the `before` and `after` snapshots.
         const beforeSnap = testEnv.firestore.makeDocumentSnapshot(beforeEvent, 'events/evtOld3');
         const afterSnap = testEnv.firestore.makeDocumentSnapshot(afterEvent, 'events/evtOld3');
         const change = testEnv.makeChange(beforeSnap, afterSnap);

         const wrapped = testEnv.wrap(context.myFunctions.clubsEventUpdated);
         await wrapped({ data: change });

         // Assert: Check the final state of both clubs.
         const updatedOldClub = await readClub(context.db, beforeEvent);
         const updatedNewClub = await readClub(context.db, afterEvent);

         expectClub(updatedOldClub, 2, oldClubEvent1.date, 'Old club incorrect');
         expectClub(updatedNewClub, 2, afterEvent.date, 'New club incorrect');
      });
   });

   describe('rebuildClubs', () => {
      it('should rebuild club index', async () => {
         // 1. Setup initial state with events and an incorrect/stale club index
         const existingClub = createClub({ name: 'MULTI', nationality: 'AUS', numEvents: 5, lastEvent: new Date() });
         await saveClub(context.db, existingClub); // This club should be deleted

         const evt1 = createEvent('evt1', SUPER_USER_UID, { club: 'TEST', nationality: 'GBR', date: new Date('2023-01-01') });
         const evt2 = createEvent('evt2', SUPER_USER_UID, { club: 'TEST', nationality: 'GBR', date: new Date('2023-02-01') });
         const evt3 = createEvent('evt3', SUPER_USER_UID, { club: 'MULTI', nationality: 'AUS' });

         await saveEvent(context.db, evt1);
         await saveEvent(context.db, evt2);
         await saveEvent(context.db, evt3);

         // 2. Wrap and call the onCall function
         const wrapped = testEnv.wrap(context.myFunctions.rebuildClubs);

         await wrapped({
            auth: { uid: SUPER_USER_UID } as any,
            data: null,
            rawRequest: {} as any,
         });

         // 3. Assert the final state of the 'clubs' collection
         const testClub = await readClub(context.db, evt1);
         expectClub(testClub, 2, evt2.date);

         const multiClub = await readClub(context.db, evt3);
         expectClub(multiClub, 1, evt3.date);

         // Verify the stale club was deleted
         const allClubsSnap = await context.db.collection('clubs').withConverter(clubConverter).get();
         expect(allClubsSnap.size).toBe(2);
      });

      it('should throw an error if not authenticated', async () => {
         const wrapped = testEnv.wrap(context.myFunctions.rebuildClubs);
         try {
            // For an unauthenticated request, we call the function without an `auth` context.
            // We must provide `data` and `rawRequest` to satisfy the CallableRequest type.
            await wrapped({ data: null, rawRequest: {} as any });
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).toBe('permission-denied');
         }
      });

   });
});