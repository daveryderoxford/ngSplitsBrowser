// Initialize the test environment. This must be done before importing the functions file.
import { expect } from 'chai';
import { Firestore, WriteResult } from 'firebase-admin/firestore';
import { Bucket } from '@google-cloud/storage';
import { describe, it } from 'mocha';
import { eventConverter } from '../src/model/event-firebase-converters.js';
import { OEvent, createEvent } from '../src/model/oevent.js';
import { GetResultsFileData, SaveResultsFileData } from '../src/results/results.js';
import { setupMochaHooks, testEnv } from './firebase-test-helper.js';

/* UTILITY FUNCTIONS */

async function saveEvent(db: Firestore, event: OEvent): Promise<WriteResult> {
   const ref = db.doc('events/' + event.key).withConverter(eventConverter);
   return await ref.set(event);
}

async function saveFile(bucket: Bucket, path: string, content: string): Promise<void> {
   await bucket.file(path).save(content);
}

async function readFile(bucket: Bucket, path: string): Promise<string> {
   const [content] = await bucket.file(path).download();
   return content.toString('utf-8');
}

/* TEST FUNCTIONS */

describe('Results Cloud Functions', function () {

   // Set a default timeout of 5 seconds for all tests and hooks in this suite.
   this.timeout(5000);

   const context = setupMochaHooks();

   describe('getResultsFile', () => {
      it('should return file content for a valid eventKey', async () => {
         const eventData = createEvent({
            key: 'evt-get-ok',
            userId: 'test-user',
         });
         const fileContent = 'This is the results file content.';
         const filePath = `results/${eventData.userId}/${eventData.key}-results`;

         await saveEvent(context.db, eventData);
         await saveFile(context.storage.bucket(), filePath, fileContent);

         const wrapped = testEnv.wrap(context.myFunctions.getResultsFile);
         const result = await wrapped({ eventKey: 'evt-get-ok' });

         expect(result).to.equal(fileContent);
      });

      it('should throw "not-found" if the event does not exist', async () => {
         const wrapped = testEnv.wrap<GetResultsFileData>(context.myFunctions.getResultsFile);
         try {
            await wrapped({ eventKey: 'evt-not-found' } as any);
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('not-found');
            expect(e.message).to.contain('Event with key evt-not-found not found.');
         }
      });

      it('should throw "not-found" if the file does not exist in storage', async () => {
         const eventData = createEvent({
            key: 'evt-no-file',
            userId: 'test-user',
         });
         await saveEvent(context.db, eventData);

         const wrapped = testEnv.wrap<GetResultsFileData>(context.myFunctions.getResultsFile);
         try {
            await wrapped({ eventKey: 'evt-no-file' } as any);
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('not-found');
            expect(e.message).to.contain('File not found at path');
         }
      });
   });

   describe('saveResultsFile', () => {
      it('should save a file for an authenticated and authorized user', async () => {
         const eventData = createEvent({
            key: 'evt-save-ok',
            userId: 'auth-user-id',
         });
         const fileContent = 'Here are the new results.';
         const filePath = `results/${eventData.userId}/${eventData.key}-results`;

         await saveEvent(context.db, eventData);

         // Cast away typing  
         const wrapped = testEnv.wrap<SaveResultsFileData>(context.myFunctions.saveResultsFile as any);
         const result = await wrapped(
            { eventKey: 'evt-save-ok', resultsData: fileContent },
            { auth: { uid: 'auth-user-id', token: {} } }
         );

         expect(result.success).to.be.true;

         const savedContent = await readFile(context.storage.bucket(), filePath);
         expect(savedContent).to.equal(fileContent);
      });

      it('should throw "unauthenticated" if user is not logged in', async () => {
         const wrapped = testEnv.wrap<SaveResultsFileData>(context.myFunctions.saveResultsFile as any);
         try {
            await wrapped({ eventKey: 'any-event', resultsData: 'any-data' });
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('unauthenticated');
         }
      });

      it('should throw "permission-denied" if user is not the event owner', async () => {
         const eventData = createEvent({
            key: 'evt-save-unauth',
            userId: 'owner-id',
         });
         await saveEvent(context.db, eventData);

         const wrapped = testEnv.wrap<SaveResultsFileData>(context.myFunctions.saveResultsFile as any);
         try {
            await wrapped(
               { eventKey: 'evt-save-unauth', resultsData: 'any-data' },
               { auth: { uid: 'not-the-owner-id', token: {} } }
            );
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('permission-denied');
         }
      });

      it('should throw "not-found" if the event does not exist', async () => {
         const wrapped = testEnv.wrap<boolean>(context.myFunctions.saveResultsFile);
         try {
            const data: SaveResultsFileData = { eventKey: 'evt-not-found', resultsData: 'any-data' };
            const context = null;
            await wrapped(data, context);
   
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('not-found');
         }
      });

      it('should throw "invalid-argument" if resultsData is missing', async () => {
         const wrapped = testEnv.wrap<SaveResultsFileData>(context.myFunctions.saveResultsFile);
         try {
            // Cast to 'any' to bypass TypeScript type checking for the test
            await wrapped(
               { eventKey: 'any-event', resultsData: undefined } as any,
               { auth: { uid: 'any-user', token: {} } }
            );
            expect.fail('Function should have thrown an error');
         } catch (e: any) {
            expect(e.code).to.equal('invalid-argument');
         }
      });
   });
});