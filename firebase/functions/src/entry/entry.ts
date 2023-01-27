import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import { Entry, FixtureEntryDetails } from "../model/entry";
import * as builder from 'xmlbuilder';

interface ExtendedElement extends builder.XMLElement {
   controlCardElement?: any;
}

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
         console.log("latestEntry read " + fixture.latestEntry);
         const entryId = fixture.latestEntry + 1;
         console.log("latestEntry updated " + entryId);

         await snap.ref.update({ id: entryId });
         await fixSnapshot.ref.update({ latestEntry: entryId, courses: courses });

      } catch (err) {
         await snap.ref.update({ 'error': userFacingMessage(err) });
         return console.error("Error when creating entry", { fixture: context.params.id, err: JSON.stringify(err) });
      }
   });

/** When a course entry is deleted free up a map.  Do not decrement the last entry number  */
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
         return console.error("Error when deteting entry", { fixture: context.params.id, err: JSON.stringify(err) });
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
         return console.error("Error when changing entry", { fixture: context.params.id, err: JSON.stringify(err) });
      }
   });


/** Returns string of IOF EntryList XML document as a string */
export function iofXMLEntryList(fix: FixtureEntryDetails, entries: Entry[]): string {
   /*

   const controlCardElement = (entry: Entry, doc1) => {
      if (entry) {
         return doc1.ele('ControlCard', entry.ecard).up();
      } else {
         return doc1;
      }
   };

   const doc = builder.create('EntryList',
     // "http://www.orienteering.org/datastandard/3.0",
      // "http://www.w3.org/2001/XMLSchema-instance",
      //    'iofVersion': "3.0",
      //    'createTime': new Date().toISOString(),
      //     'creator': 'Splitsbrowser'
      .ele('Event')
      .ele('Name', fix.name).up()
      .ele('StartTime', fix.date)
      .ele('Date', fix.date).up()
      .up()
      .up();

   for (const entry of entries) {
      doc.ele('PersonEntry')
           .ele('Person')
             .ele('Id', entry.id).up()
             .ele('Name')
             .ele('Family', entry.surname).up()
             .ele('Given', entry.firstname).up()
           .up()
         .up()
         .ele('Organisation')
           .ele('Name', entry.club).up()
         .up()
         .controlCardElement(entry, doc)
         .ele('Class')
         .ele('Name', entry.course).up()
         .up()
         .ele('EntryTime', entry.madeAt).up()
         .up();
   }

   const xml = doc.end({ pretty: true }); */
   return ("");
}

/** Returns entry ist for a specific event in a given format */
export const exportEntryList = functions.https.onCall(async (data, context: functions.https.CallableContext) => {

   const eventId = data.eventId;
   const format = data.format;

   // Get the entries details
   const fixSnapshot = await admin.firestore().collection(`entry`).doc(eventId).get();
   const fixture = fixSnapshot.data() as FixtureEntryDetails;

   // Get entries
   const entriesSnapshot = await fixSnapshot.ref.collection('entries').get();
   const entries: Entry[] = entriesSnapshot.docs.map(doc => doc.data() as Entry);

   let text: string;

   if (format === "IOFXML") {
      text = iofXMLEntryList(fixture, entries);
   } else {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid file format spcifed ');
   }

   return text;
});

/*
 <?xml version="1.0" encoding="UTF-8"?>
<!--
  Entry list for an individual event, containing competitors and the classes entered.
-->
<EntryList xmlns="http://www.orienteering.org/datastandard/3.0"
           xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
           iofVersion="3.0"
           createTime="2011-07-20T12:16:31+02:00"
           creator="Example Software">
  <Event>
    <Name>Example event</Name>
    <StartTime>
      <Date>2011-07-31</Date>
      <Time>10:00:00+01:00</Time>
    </StartTime>
  </Event>
  <PersonEntry>
    <Person>
      <Id>1</Id>
      <Name>
        <Family>Wood</Family>
        <Given>George</Given>
      </Name>
    </Person>
    <!-- the Organisation element is to be omitted if the competitor does not represent a club -->
    <Organisation>
      <Id>5</Id>
      <Name>OC Back and Forth</Name>
      <Country code="GBR">Great Britain</Country>
    </Organisation>
    <!-- the ControlCard element is to be omitted if the competitor wishes to rent a control card -->
    <ControlCard>794021</ControlCard>
    <Class>
      <Id>1</Id>
      <Name>Men Elite</Name>
    </Class>
    <EntryTime>2011-07-14T18:20:05+01:00</EntryTime>
  </PersonEntry>
  <PersonEntry>
    <Person>
      <Id>2</Id>
      <Name>
        <Family>Martin</Family>
        <Given>Edgar</Given>
      </Name>
    </Person>
    <Organisation>
      <Id>2</Id>
      <Name>Bushmen OC</Name>
      <Country code="GBR">Great Britain</Country>
    </Organisation>
    <!-- this competitor wants to rent a control card, and thus the ControlCard element is omitted -->
    <Class>
      <Id>1</Id>
      <Name>Men Elite</Name>
    </Class>
    <EntryTime>2011-07-10T13:00:04+01:00</EntryTime>
  </PersonEntry>
  <PersonEntry>
    <Person>
      <Id>3</Id>
      <Name>
        <Family>Lawson</Family>
        <Given>Toni</Given>
      </Name>
    </Person>
    <!-- this competitor does not represent a club, and thus the Organisation element is omitted -->
    <ControlCard>973078</ControlCard>
    <Class>
      <Id>2</Id>
      <Name>Open</Name>
    </Class>
    <EntryTime>2011-07-12T05:33:17+01:00</EntryTime>
  </PersonEntry>
</EntryList>
  */


