/**
 * Cloud functions for creating events, and reading and writing splits files.
 */
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
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

/**
 * Gets the content of a results file given an event Id from google storage.
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
  const { eventKey, resultsData } = request.data;
  if (!eventKey || typeof resultsData !== 'string') {
    throw new HttpsError('invalid-argument', 'saveResultsFile: The function must be called with an "eventKey" and "resultsData".');
  }

  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'saveResultsFile: You either need to be logged on to execute this function".');
  }

  try {
    const eventData = await readEventData(eventKey);

    if (!isAuthorised(eventData.userId, request.auth)) {
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

export function getStorageFile(eventData: OEvent) {
  const bucket = getStorage().bucket();
  let filePath: string;

  if (eventData.legacyPassword) {
     filePath = `results/legacy/${eventData.key}`;
  } else if (eventData.userId) {
    filePath = `results/${eventData.userId}/${eventData.key}-results`;
  } else {
    throw(Error('Failed to get storage file location.  UserId not specified in event data '))
  }
  log(`ResultsFile: Reading file from ${filePath}`);

  const file = bucket.file(filePath);
  return { file, filePath };
}
