// Initialize the test environment. This must be done before importing the functions file.
import { Bucket } from "@google-cloud/storage";
import { expect } from 'chai';
import { Firestore } from 'firebase-admin/firestore';
import { describe, it } from 'mocha';
import { eventConverter } from '../src/model/event-firebase-converters.js';
import { EventInfo, OEvent, createEvent } from '../src/model/oevent.js';
import { GetResultsFileData, SaveResultsFileData } from '../src/results/results.js';
import { setupMochaHooks, testEnv, v2Request, mockHttpRequest } from './firebase-test-helper.js';

/* UTILITY FUNCTIONS */

async function saveEvent(db: Firestore, event: OEvent): Promise<void> {
  const ref = db.doc('events/' + event.key).withConverter(eventConverter);
  await ref.set(event);
}

async function saveFile(bucket: Bucket, path: string, content: string): Promise<void> {
  await bucket.file(path).save(content);
}

async function readFile(bucket: Bucket, path: string): Promise<string> {
  const [content] = await bucket.file(path).download();
  return content.toString('utf-8');
}

/** Event info containing all madatory fields  */
function validEventInfo(): Partial<EventInfo> {
  return {
    name: 'Event Name',
    club: 'VALIDCLUB',
    nationality: 'GBR',
    date: new Date()
  }
}

/* TEST FUNCTIONS */

describe('Results Cloud Functions', function () {
  // Set a default timeout of 5 seconds for all tests and hooks in this suite.
  this.timeout(60000);

  const context = setupMochaHooks();

  describe('getResultsFile', () => {
    it('should return file content for a valid eventKey', async () => {
      const eventData = createEvent('evt-get-ok', 'test-user', validEventInfo());
      const fileContent = 'This is the results file content.';
      const filePath = `results/${eventData.userId}/${eventData.key}-results`;

      await saveEvent(context.db, eventData);
      await saveFile(context.storage.bucket(), filePath, fileContent);

      const wrapped = testEnv.wrap(context.myFunctions.getResultsFile);
      const req = v2Request<GetResultsFileData>({ eventKey: 'evt-get-ok' });
      const result = await wrapped(req);

      expect(result).to.equal(fileContent);
    });

    it('should throw "not-found" if the event does not exist', async () => {
      const wrapped = testEnv.wrap(context.myFunctions.getResultsFile);
      try {
        await wrapped(v2Request({ eventKey: 'evt-not-found' }));
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('not-found');
      }
    });

    it('should throw "not-found" if the file does not exist in storage', async () => {
      const eventData = createEvent('evt-no-file', 'test-user', validEventInfo());
      await saveEvent(context.db, eventData);

      const wrapped = testEnv.wrap(context.myFunctions.getResultsFile);
      try {
        await wrapped(v2Request({ eventKey: 'evt-no-file' }));
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('not-found');
        expect(e.message).to.contain('File not found at path');
      }
    });
  });

  describe('saveResultsFile', () => {
    it('should save a file for an authenticated and authorized user', async () => {
      const eventData = createEvent('evt-save-ok', 'auth-user-id', validEventInfo());
      const fileContent = 'Here are the new results.';
      const filePath = `results/${eventData.userId}/${eventData.key}-results`;

      await saveEvent(context.db, eventData);

      const wrapped = testEnv.wrap(context.myFunctions.saveResultsFile);
      const req = v2Request<SaveResultsFileData>({ eventKey: 'evt-save-ok', resultsData: fileContent }, 'auth-user-id');
      const result = await wrapped(req);

      expect(result.success).to.be.true;

      const savedContent = await readFile(context.storage.bucket(), filePath);
      expect(savedContent).to.equal(fileContent);
    });

    it('should throw "unauthenticated" if user is not logged in', async () => {
      const eventData = createEvent('evt-save-ok', 'auth-user-id', validEventInfo());
      await saveEvent(context.db, eventData);
      console.log('*****Event saved');

      const wrapped = testEnv.wrap(context.myFunctions.saveResultsFile);
      const req = v2Request<SaveResultsFileData>({ eventKey: 'evt-save-ok', resultsData: 'any-data' });
      delete req.auth;
      try {
        await wrapped(req);
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('unauthenticated');
      }
    });

    it('should throw "permission-denied" if user is not the event owner', async () => {
      const eventData = createEvent('evt-save-unauth', 'owner-id', validEventInfo() );
      await saveEvent(context.db, eventData);

      const wrapped = testEnv.wrap(context.myFunctions.saveResultsFile);
      const req = v2Request<SaveResultsFileData>({ eventKey: 'evt-save-unauth', resultsData: 'any-data' }, 'not-the-owner-id');
      try {
        await wrapped(req);
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('permission-denied');
      }
    });

    it('should throw "not-found" if the event does not exist', async () => {
      const wrapped = testEnv.wrap(context.myFunctions.saveResultsFile);
      const req = v2Request<SaveResultsFileData>({ eventKey: 'evt-not-found', resultsData: 'any-data' }, 'any-user');
      try {
        await wrapped(req);
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('not-found');
      }
    });

    it('should throw "invalid-argument" if resultsData is missing', async () => {
      const wrapped = testEnv.wrap(context.myFunctions.saveResultsFile);
      const req = v2Request<any>({ eventKey: 'any-event' }, 'any-user'); // 'resultsData' is missing
      try {
        await wrapped(req);
        expect.fail('Function should have thrown an error');
      } catch (e: any) {
        expect(e.code).to.equal('invalid-argument');
      }
    });
  });

  // For onRequest functions, call the handler directly with mock req and res.
  describe('uploadResults', () => {
    const VALID_API_KEY = 'test-api-key';

    before(() => {
      process.env['UPLOAD_API_KEY'] = VALID_API_KEY;
    });

    after(() => {
      delete process.env['UPLOAD_API_KEY'];
    });

    it('should create an event, parse results, generate summary and save results for a valid POST request', async () => {
      const eventData: Partial<EventInfo> = {
        name: 'API Created Event',
        club: 'API Club',
        date: new Date(), // This is required
        nationality: 'GBR' // This is required
      };

    const testResultsData = `<?xml version="1.0" encoding="UTF-8"?>
<ResultList xmlns="http://www.orienteering.org/datastandard/3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" iofVersion="3.0">
  <Event>
    <Name>Test Event</Name>
    <StartTime>
      <Date>2025-11-03</Date>
    </StartTime>
  </Event>
  <ClassResult>
    <Class>
      <Name>M21</Name>
    </Class>
    <PersonResult>
      <Person>
        <Name>
          <Family>Doe</Family>
          <Given>John</Given>
        </Name>
      </Person>
      <Result>
        <Time>600</Time>
        <Status>OK</Status>
      </Result>
    </PersonResult>
  </ClassResult>
</ResultList>`;

      const { req, res } = mockHttpRequest('POST', {
        eventData: eventData,
        resultsData: testResultsData,
        userId: 'VALID_USER_ID',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();

      // 1. Assert HTTP response
      expect(status).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.eventKey).to.be.a('string');

      const eventKey = body.eventKey;

      // 2. Assert Firestore document creation
      const eventDoc = await context.db.collection('events').doc(eventKey).withConverter(eventConverter).get();
      const savedEvent = eventDoc.data();
      expect(savedEvent).to.exist;
      expect(savedEvent!.name).to.equal(eventData.name);
      expect(savedEvent!.club).to.equal(eventData.club);
      expect(savedEvent!.userId).to.equal('VALID_USER_ID');

      expect(savedEvent!.summary).to.exist;
      expect(savedEvent!.summary!.numcompetitors).to.equal(1);
      expect(savedEvent!.summary!.courses).to.have.lengthOf(1);
      expect(savedEvent!.summary!.courses[0].classes[0]).to.equal('M21');
      expect(savedEvent!.summary!.courses[0].numcompetitors).to.equal(1);

      // 3. Assert Storage file creation
      const expectedPath = `results/VALID_USER_ID/${eventKey}-results`;
      const savedContent = await readFile(context.storage.bucket(), expectedPath);
      expect(savedContent).to.equal(testResultsData);
    });

    it('should return 401 Unauthorized for an invalid API key', async () => {
      const { req, res } = mockHttpRequest('POST', {
        eventData: { name: 'test', date: new Date(), club: 'test', nationality: 'GBR' },
        resultsData: 'test',
        apiKey: 'invalid-key',
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(401);
      expect(body.error).to.contain('A valid API key is required');
    });

    it('should return 400 Bad Request if eventData is missing', async () => {
      const { req, res } = mockHttpRequest('POST', {
        resultsData: 'test',
        userId: 'test-user',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(400);
      expect(body.error).to.contain('The function must be called with "eventData", "resultsData" and "userId".');
    });

    it('should return 400 Bad Request if eventData.name is missing', async () => {
      const { req, res } = mockHttpRequest('POST', {
        eventData: { date: new Date(), club: 'Test Club', nationality: 'GBR' },
        resultsData: 'test',
        userId: 'test-user',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(400);
      expect(body.error).to.equal('Missing required fields in eventData: name');
    });

    it('should return 400 Bad Request if multiple required fields are missing', async () => {
      const { req, res } = mockHttpRequest('POST', {
        eventData: { date: new Date() },
        resultsData: 'test',
        userId: 'test-user',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(400);
      expect(body.error).to.equal('Missing required fields in eventData: name, club, nationality');
    });

    it('should return 500 Internal Server Error for invalid resultsData', async () => {
      const eventData: Partial<EventInfo> = {
        name: 'Invalid Results Event',
        club: 'Test Club',
        date: new Date(),
        nationality: 'GBR',
      };
      const { req, res } = mockHttpRequest('POST', {
        eventData,
        resultsData: 'this is not valid xml or any other format',
        userId: 'test-user',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(500);
      expect(body.error).to.equal('Error parsing results file');
    });

    it('should return 405 Method Not Allowed for non-POST requests', async () => {
      const { req, res } = mockHttpRequest('GET', {});

      await context.myFunctions.uploadResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(405);
      expect(body).to.equal('Method Not Allowed');
    });

    it('should handle OPTIONS preflight request', async () => {
      const { req, res } = mockHttpRequest('OPTIONS', {});
      // For onRequest functions, call the handler directly with mock req and res.
      await context.myFunctions.uploadResults(req as any, res as any);
      const { status} = res.getSent();
      expect(status).to.equal(204);
    });
  });
});
