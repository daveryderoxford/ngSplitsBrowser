/* eslint-disable require-jsdoc */

/**
 * Cloud functions for creating events, and reading and writing splits files.
 */
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import { error, log } from 'firebase-functions/logger';
import { OEvent } from '../model/oevent.js';
import { eventConverter } from '../model/event-firebase-converters.js';
import { isAuthorised } from '../auth.js';

export interface GetResultsFileData {
  eventKey: string;
}

export interface SaveResultsFileData {
  eventKey: string;
  resultsData: string;
  apiKey?: string;
}

export interface CreateEventWithResultsData {
  eventData: Partial<OEvent>;
  resultsData: string;
  apiKey: string;
}

export interface SaveResultsFileResponse {
  success: boolean;
}

export interface CreateEventWithResultsResponse {
  success: boolean;
  eventKey: string;
}

/**
 * Gets the content of a results file from Google Cloud Storage.
 */
export const getResultsFile = onCall<GetResultsFileData>(async (request) => {
  log(`getResultsFile: eventKey: ${request.data.eventKey}`);

  const { eventKey } = request.data;
  if (!eventKey) {
    throw new HttpsError('invalid-argument', 'getResultsFile: The function must be called with a valid "eventKey".');
  }

  try {
    const eventData = await readEventData(eventKey);

    const { file, filePath } = getStorageFile(eventData);
    
    const [exists] = await file.exists();
    if (!exists) {
      log(`.  getResultsFile: Error reading ${filePath}.  File not found`);
      throw new HttpsError('not-found', `getResultsFile: File not found at path: ${filePath}`);
    }
    const [content] = await file.download();
    return content.toString('utf-8');
  } catch (err) {
    error(`.  getResultsFile: Error getting results for event ${eventKey}.`, err);
    // Re-throw HttpsError, wrap others
    if (err instanceof HttpsError) {
      throw err;
    }
    throw new HttpsError('internal', 'getResultsFile: An unexpected error occurred.', err);
  }
});

/**
 * Saves a results file to Google Cloud Storage.
 */
export const saveResultsFile = onCall<SaveResultsFileData>(async (request) => {
  log(`saveResultsFile: Saving evnt data for eventKey: ${request.data.eventKey}`);
  const { eventKey, resultsData, apiKey } = request.data;
  if (!eventKey || typeof resultsData !== 'string') {
    throw new HttpsError('invalid-argument', 'saveResultsFile: The function must be called with an "eventKey" and "resultsData".');
  }

  if (!request.auth && !isValidApiKey(apiKey)) {
    throw new HttpsError('unauthenticated', 'saveResultsFile: You either need to be logged on or supply an API key to execute this function".');
  }

  try {
    const eventData = await readEventData(eventKey);

    if (!isAuthorised(eventData.userId, request.auth) && !isValidApiKey(apiKey)) {
      throw new HttpsError('permission-denied', `saveResultsFile: You do not have permission to save results for event ${eventKey}.`);
    }

    const { file, filePath } = getStorageFile(eventData);

    await file.save(resultsData, {
      contentType: 'text/plain; charset=utf-8',
    });
    log(`saveResultsFile: Successfully saved ${filePath}`);
    return { success: true };
  } catch (err) {
    error(`saveResultsFile: Error saving results for event ${eventKey}.`, err);
    // Re-throw HttpsError, wrap others
    if (err instanceof HttpsError) {
      throw err;
    }
    throw new HttpsError('internal', 'saveResultsFile: An unexpected error occurred while saving the file.', err);
  }
});

/**
 * Creates an event and uploads a results file. This function is intended for use by trusted third parties
 * and requires an API key for authentication.
 * 
 * Example usage: 
 * 
 
 curl -X POST "YOUR_FUNCTION_URL" \
-H "Content-Type: application/json" \
-d '{
      "apiKey": "YOUR_API_KEY",
      "eventData": {
        "name": "My Awesome Event",
        "date": "2024-07-29T10:00:00.000Z",
        "club": "My Club",
        "nationality": "GBR",
        "grade": "National",
        "discipline": "Long",
        "type": "Foot",
        "webpage": "http://example.com",
        "controlCardType": "SI"
      },
      "resultsData": "Stno;Name;Time;\\n1;First Runner;12:34;\\n2;Second Runner;15:01;"
    }'
    
 */
export const createEventWithResults = onRequest(async (request, response) => {
  // Set CORS headers for preflight and actual requests
  response.set('Access-Control-Allow-Origin', '*');
  response.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (request.method === 'OPTIONS') {
    // Send response to OPTIONS preflight request
    response.status(204).send('');
    return;
  }

  if (request.method !== 'POST') {
    response.status(405).send('Method Not Allowed');
    return;
  }

  log(`createEventWithResults: Creating event and uploading results for: ${request.body.eventData?.name}`);

  const { eventData, resultsData, apiKey } = request.body as CreateEventWithResultsData;

  if (!isValidApiKey(apiKey)) {
    response.status(401).json({ error: 'A valid API key is required.' });
    return;
  }

  if (!eventData || !resultsData) {
    response.status(400).json({ error: 'The function must be called with "eventData" and "resultsData".' });
    return;
  }

  const db = getFirestore();
  const newEventRef = db.collection('events').doc().withConverter(eventConverter);

  const newEvent = {
    ...eventData,
    key: newEventRef.id,
    // Assign a designated user ID for third-party uploads, or leave it null.
    // This depends on your application's data ownership model.
    // For now, we'll leave it as potentially undefined.
  } as OEvent;

  try {
    // 1. Upload results to storage
    const { file, filePath } = getStorageFile(newEvent);
    await file.save(resultsData, {
      contentType: 'text/plain; charset=utf-8',
    });
    log(`createEventWithResults: Successfully saved results to ${filePath}`);

    // 2. Create event document in Firestore
    await newEventRef.set(newEvent);
    log(`createEventWithResults: Successfully created event with key ${newEvent.key}`);

    response.status(200).json({ success: true, eventKey: newEvent.key });

  } catch (err) {
    error(`createEventWithResults: Error processing request for event ${eventData.name}.`, err);
    response.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

/** Read event data  throwing an HttpsError if the file is not found */
async function readEventData(eventKey: string): Promise<OEvent> {
  const eventDocRef = getFirestore().collection('events').doc(eventKey).withConverter(eventConverter);
  const eventSnap = await eventDocRef.get();
  const eventData = eventSnap.data() as OEvent | undefined;

  if (!eventData) {
    throw new HttpsError('not-found', `ResultsFile: Event with key ${eventKey} not found.`);
  }

  return eventData;

}

function isValidApiKey(apiKey?: string): boolean {
  if (!apiKey) {
    return false;
  }
  const validApiKey = process.env.UPLOAD_API_KEY;
  return apiKey === validApiKey;
}

function getStorageFile(eventData: OEvent) {
  const bucket = getStorage().bucket();
  let filePath: string;

  if (eventData.legacyPassword) {
     filePath = `results/legacy/${eventData.key}`;
  } else if (eventData.userId) {
    filePath = `results/${eventData.userId}/${eventData.key}-results`;
  } else {
    filePath = `results/third-party/${eventData.key}-results`;
  }
  log(`ResultsFile: Reading file from ${filePath}`);

  const file = bucket.file(filePath);
  return { file, filePath };
}
