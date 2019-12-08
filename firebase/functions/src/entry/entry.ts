import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Entry, FixtureEntryDetails } from "../model/entry";

function userFacingMessage(err: Error): string {
    return "An error occurred saving this entry";
}

export const createEntry = functions.firestore
    .document('entry/{fixtureId}/entries/{id}')
    .onCreate(async (snap, context) => {
        // Increment the number of entries by one for the course in the fixture
        const entry = snap.data() as Entry;

        try {
            // Get associated fixture details and increment the number of entries and total entries
            const fixSnapshot = await admin.firestore().collection(`entry`).doc(context.params.fixtureId).get();
            const fixture = fixSnapshot.data() as FixtureEntryDetails;
            const courses = fixture.courses;

            const index = fixture.courses.findIndex(c => c.name === entry.course);
            // Add one to the course
            if (index === -1) {
                throw Error("Course not found");
            }

            courses[index].reservedMaps++;
            console.log( "latestEntry read " + fixture.latestEntry );
            const entryId = fixture.latestEntry + 1;
            console.log( "latestEntry updated " + entryId);

            await snap.ref.update({ id: entryId });
            await fixSnapshot.ref.update( { latestEntry: entryId, courses: courses });

        } catch (err) {
            await snap.ref.update({ 'error': userFacingMessage(err) });
            return console.error( "Error when creating entry", { fixture: context.params.userId, err: JSON.stringify( err ) } );
        }
    });

/** When a course entry is deleted free up a mep.  Do not decrement the last entry number  */
export const deleteEntry = functions.firestore
    .document('entry/{fixtureId}/entries/{id}')
    .onDelete(async (snap, context) => {
        const entry = snap.data() as Entry;

        try {
            // Get associated fixture details and increment the number of entries and total entries
            const fixSnapshot = await admin.firestore().collection(`entry`).doc(context.params.fixtureId).get();
            const fixture = fixSnapshot.data() as FixtureEntryDetails;
            const courses = fixture.courses;

            const index = fixture.courses.findIndex(c => c.name === entry.course);
            // Add one to the course
            if (index === -1) {
                throw Error("Error adding entry - Course not found");
            }

            courses[index].reservedMaps--;

            await fixSnapshot.ref.update({ courses: courses });

        } catch (err) {
            await snap.ref.update({ 'error': userFacingMessage(err) });
            return console.error( "Error when deteting entry", { fixture: context.params.userId, err: JSON.stringify( err ) });
        }
    });

export const changeClass = functions.firestore
    .document('entry/{fixtureId}/entries/{id}')
    .onUpdate(async (change, context) => {
        const oldEntry = change.before.data() as Entry;
        const newEntry = change.after.data() as Entry;

        try {
            if (oldEntry.course !== newEntry.course) {
                const fixSnapshot = await admin.firestore().collection(`entry`).doc(context.params.fixtureId).get();
                const fixture = fixSnapshot.data() as FixtureEntryDetails;
                const courses = fixture.courses;

                const oldCourseIndex = fixture.courses.findIndex(c => c.name === oldEntry.course);
                const newCourseIndex = fixture.courses.findIndex(c => c.name === newEntry.course);

                if (oldCourseIndex === -1 || newCourseIndex === -1) {
                    throw Error("Error adding entry - Course not found");
                }

                courses[oldCourseIndex].reservedMaps--;
                courses[newCourseIndex].reservedMaps++;

                await fixSnapshot.ref.update({ courses: courses });

            }

        } catch (err) {
            await change.after.ref.update({ 'error': userFacingMessage(err) });
            return console.error( "Error when changing entry", { fixture: context.params.userId, err: JSON.stringify( err ) } );
        }
    });


