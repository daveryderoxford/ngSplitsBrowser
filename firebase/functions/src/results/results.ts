/* eslint-disable require-jsdoc */

/**
 * Cloud functions for reading and writing splits files.
 */
import { getStorage } from 'firebase-admin/storage';
import { getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { error, log } from 'firebase-functions/logger';
import { OEvent } from '../model/oevent.js';
import { eventConverter } from '../model/event-firebase-converters.js';

export interface GetResultsFileData {
  eventKey: string;
}

export interface SaveResultsFileData {
  eventKey: string;
  resultsData: string;
}

/**
 * Gets the content of a results file from Google Cloud Storage.
 */
export const getResultsFile = onCall(async (request) => {
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

  if (!request.auth) {
    log('saveResultsFile: Error: Not authorised to run function');
    throw new HttpsError('unauthenticated', 'saveResultsFile: You must be logged in to save results.');
  }

  const { eventKey, resultsData } = request.data;
  if (!eventKey || typeof resultsData !== 'string') {
    throw new HttpsError('invalid-argument', 'saveResultsFile: The function must be called with an "eventKey" and "resultsData".');
  }

  try {
    const eventData = await readEventData(eventKey);

    if (eventData.userId !== request.auth.uid) {
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

function getStorageFile(eventData: OEvent) {
  const bucket = getStorage().bucket();
  let filePath: string;

  if (eventData.legacyPassword) {
     filePath = `results/legacy/${eventData.key}`;
  } else {
    filePath = `results/${eventData.userId}/${eventData.key}-results`;
  }
  log(`ResultsFile: Reading file from ${filePath}`);

  const file = bucket.file(filePath);
  return { file, filePath };

}
