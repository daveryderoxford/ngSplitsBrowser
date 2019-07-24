/**
 * Cloud fucntion to update event entry data when fixture reservation is added
 */

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { UserData, UserReservation } from "../model/user";
import { FixtureReservation, MapReservation } from "../model/fixture-reservation";

export const userUpdated = functions.firestore
   .document('users/{userId}')
   .onUpdate(async (change, context) => {

      const newValue = change.after.data() as UserData;
      const previousValue = change.before.data() as UserData;

      /** If entry added to user then update the event information */
      if (newValue.fixtures.length > previousValue.fixtures.length) {
         const userReservation = newValue.fixtures[newValue.fixtures.length - 1] as UserReservation;

         // Get entry document for the event
         try {
            const doc = admin.firestore().doc('enteries/' + userReservation.eventId);
            const snap = await doc.get();
            const eventRes = snap.data() as FixtureReservation;

            const course = eventRes.courses.find(c => c.name === userReservation.course);

            if (!course) {
               throw new Error("Course not found for map reservation");
            }

            const newReservation: MapReservation = {
               userId: context.auth.uid,
               firstname: newValue.firstname,
               surname: newValue.surname,
               club: newValue.club,
               madeAt: new Date().toISOString(),
               ecard: -1
            };
            course.reservations.push(newReservation);

            // Add new reservation to the course array
            await doc.set(eventRes);
         } catch (err) {
            console.log('Error encountered added user reservation to event reservation object.  Error:  ' + err);
         }
      }

   });

