// Initialize the test environment. This must be done before importing the functions file.
import { Bucket } from "@google-cloud/storage";
import { expect } from 'chai';
import { Firestore } from 'firebase-admin/firestore';
import { describe, it } from 'mocha';
import { eventConverter } from '../src/model/event-firebase-converters.js';
import { OEvent, createEvent } from '../src/model/oevent.js';
import { GetResultsFileData, SaveResultsFileData } from '../src/results/results.js';
import { setupMochaHooks, testEnv, v2Request } from './firebase-test-helper.js';

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

/**
 * Mocks an HTTP request and response for testing onRequest functions.
 * @param method The HTTP method (e.g., 'POST', 'GET').
 * @param body The request body.
 * @returns A mock request and a mock response handler.
 */
function mockHttpRequest(method: string, body: any) {
  const req = { method, body, headers: {} };

  let status = 200;
  let sentBody: any;

  const res = {
    status: (s: number) => {
      status = s;
      return res;
    },
    send: (b: any) => {
      sentBody = b;
    },
    json: (b: any) => {
      sentBody = b;
    },
    set: (field: string, value: any) => {
      // No-op for most tests
    },
    getSent: () => ({ status, body: sentBody }),
  };

  return { req, res };
}

/* TEST FUNCTIONS */

describe('Results Cloud Functions', function () {
  // Set a default timeout of 5 seconds for all tests and hooks in this suite.
  this.timeout(60000);

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
      const eventData = createEvent({
        key: 'evt-no-file',
        userId: 'test-user',
      });
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
      const eventData = createEvent({
        key: 'evt-save-ok',
        userId: 'auth-user-id',
      });
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
      const eventData = createEvent({
        key: 'evt-save-ok',
        userId: 'auth-user-id',
      });
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
      const eventData = createEvent({
        key: 'evt-save-unauth',
        userId: 'owner-id',
      });
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
  describe.only('createEventWithResults', () => {
    const VALID_API_KEY = 'test-api-key';

    before(() => {
      process.env['UPLOAD_API_KEY'] = VALID_API_KEY;
    });

    after(() => {
      delete process.env['UPLOAD_API_KEY'];
    });

    it('should create an event and save results for a valid POST request', async () => {
      const eventData: Partial<OEvent> = {
        name: 'API Created Event',
        club: 'API Club',
        date: new Date(),
      };
      const resultsData = 'col1;col2\nval1;val2';

      const { req, res } = mockHttpRequest('POST', {
        eventData,
        resultsData,
        apiKey: VALID_API_KEY,
      });

      // For onRequest functions, call the handler directly with mock req and res.
      await context.myFunctions.createEventWithResults(req as any, res as any);

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

      // 3. Assert Storage file creation
      const expectedPath = `results/third-party/${eventKey}-results`;
      const savedContent = await readFile(context.storage.bucket(), expectedPath);
      expect(savedContent).to.equal(resultsData);
    });

    it('should return 401 Unauthorized for an invalid API key', async () => {
      const { req, res } = mockHttpRequest('POST', {
        eventData: { name: 'test' },
        resultsData: 'test',
        apiKey: 'invalid-key',
      });

      await context.myFunctions.createEventWithResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(401);
      expect(body.error).to.contain('A valid API key is required');
    });

    it('should return 400 Bad Request if eventData is missing', async () => {
      const { req, res } = mockHttpRequest('POST', {
        resultsData: 'test',
        apiKey: VALID_API_KEY,
      });

      await context.myFunctions.createEventWithResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(400);
      expect(body.error).to.contain('must be called with "eventData" and "resultsData"');
    });

    it('should return 405 Method Not Allowed for non-POST requests', async () => {
      const { req, res } = mockHttpRequest('GET', {});

      await context.myFunctions.createEventWithResults(req as any, res as any);

      const { status, body } = res.getSent();
      expect(status).to.equal(405);
      expect(body).to.equal('Method Not Allowed');
    });

    it('should handle OPTIONS preflight request', async () => {
      const { req, res } = mockHttpRequest('OPTIONS', {});
      // For onRequest functions, call the handler directly with mock req and res.
      await context.myFunctions.createEventWithResults(req as any, res as any);
      const { status} = res.getSent();
      expect(status).to.equal(204);
    });
  });
});
