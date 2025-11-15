import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { log, error } from 'firebase-functions/logger';
import { defineSecret } from 'firebase-functions/params';
import { onRequest } from 'firebase-functions/v2/https';
import { eventConverter } from '../model/event-firebase-converters.js';
import { CourseSummary, createEvent, EventInfo, EventSummary } from '../model/oevent.js';
import { getStorageFile } from './results.js';
import { parseEventData } from './import/import.js';
import { Repairer } from './model/repairer.js';
import { Results } from './model/results.js';
import { Course } from './model/course.js';

export interface addResultsHttp {
  eventData: Partial<EventInfo>;
  userId: string;
  resultsData: string;
  apiKey: string;
}

const uploadApiKeySecret = defineSecret('UPLOAD_API_KEY');

/**
 * Creates an event and uploads a results file. This function is intended for use by trusted third parties
 * and requires an API key for authentication.
 *
 * Example usage:
 *
curl -X POST "https://us-central1-splitsbrowser-b5948.cloudfunctions.net/uploadResults" \
-H "Content-Type: application/json" \
-d '{
   "apiKey": "MY_API_KEY",
   "userId": "f8HlxQcl0AZBPrd4IHvTEGFH4Uv2",
   "eventData": {
      "name": "Forest Challenge",
      "date": "2024-08-15T11:00:00.000Z",
      "club": "FOREST",
      "nationality": "SWE",
      "discipline": "Long"
   },
   "resultsData": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><ResultList xmlns=\"http://www.orienteering.org/datastandard/3.0\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" iofVersion=\"3.0\"><ClassResult><Class><Name>Blue</Name></Class><PersonResult><Person><Name><Family>Smith</Family><Given>John</Given></Name></Person><Result><FinishTime>2024-08-15T11:47:32+02:00</FinishTime><Time>2552.0</Time><Status>OK</Status></Result></PersonResult></ClassResult></ResultList>"
}'
 */
export const uploadResults = onRequest({ secrets: [uploadApiKeySecret] }, async (request, response) => {
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

  const { eventData, userId, resultsData, apiKey } = request.body as addResultsHttp;

  if (!isValidApiKey(apiKey)) {
    const msg = 'A valid API key is required.';
    log('Request failed' + msg);
    response.status(401).json({ error: msg });
    return;
  }

  if (!eventData || !userId || !resultsData) {
    const msg = 'The function must be called with "eventData", "resultsData" and "userId".';
    log('Request failed' + msg);
    response.status(400).json({ error: msg });
    return;
  }

  // Verify that the user exists
  try {
    await getAuth().getUser(userId);
  } catch (err: any) {
    if (err.code === 'auth/user-not-found') {
      const msg = `The specified userId "${userId}" does not exist.`;
      log('Request failed: ' + msg);
      response.status(400).json({ error: msg });
    } else {
      error(`An unexpected error occurred while verifying userId "${userId}".`, err);
      response.status(500).json({ error: 'An unexpected error occurred during user validation.' });
    }
    return;
  }

  const requiredFields: Array<keyof EventInfo> = ['name', 'date', 'club', 'nationality'];
  const missingFields = requiredFields.filter(field => !eventData[field]);

  if (missingFields.length > 0) {
    const msg = `Missing required fields in eventData: ${missingFields.join(', ')}`;
    log('Request failed' + msg);
    response.status(400).json({ error: msg });
    return;
  }
  // Validate results file ancd create event summary
  let results: Results = null;
  try {
    results = parseEventData(resultsData);
    if (results.needsRepair) {
      Repairer.repairEventData(results);
    }

  } catch (err: any) {
    error(`createEventWithResults: Error parsing results data ${eventData.name}.`, err);
    response.status(500).json({ error: 'Error parsing results file' });
    return;
  }

  // Generate firestore Id
  const db = getFirestore();
  const newEventRef = db.collection('events').doc().withConverter(eventConverter);

  // JSON does not support dates 
  eventData.date = new Date(eventData.date);

  const newEvent = createEvent(newEventRef.id, userId, eventData as EventInfo);
  newEvent.summary = populateSummary(results);

  try {
    // Upload results to storage
    const { file, filePath } = getStorageFile(newEvent);
    await file.save(resultsData, {
      contentType: 'text/plain; charset=utf-8',
    });
    log(`createEventWithResults: Successfully saved results to ${filePath}`);

    newEvent.splits = {
      splitsFilename: filePath,
      splitsFileFormat: 'auto',
      valid: true,
      uploadDate: new Date(),
    };

    // Create event document in Firestore
    await newEventRef.set(newEvent);
    log(`createEventWithResults: Successfully created event with key ${newEvent.key}`);

    response.status(200).json({ success: true, eventKey: newEvent.key });

  } catch (err) {
    error(`createEventWithResults: Error processing request for event ${eventData.name}.`, err);
    response.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

export function isValidApiKey(apiKey?: string): boolean {
  if (!apiKey) {
    return false;
  }
  const result = (apiKey.trim() === uploadApiKeySecret.value().trim());
  return result;
}

/** Populate the event summary based on a Results object */
function populateSummary(results: Results): EventSummary {
  const summary: EventSummary = {
    numcompetitors: 0,
    courses: new Array()
  };

  if (!results) {
    console.warn('EventAdminService: No results provided to populate summary');
    return summary;
  }

  if (!results.courses || results.courses.length === 0) {
    console.warn('EventAdminService: No courses found in results');
    return summary;
  }

  for (const course of results.courses) {
    const courseSummary = createCourseSummary(course);

    for (const eclass of course.classes) {
      courseSummary.numcompetitors = courseSummary.numcompetitors + eclass.competitors.length;
      summary.numcompetitors = summary.numcompetitors + eclass.competitors.length;
      courseSummary.classes.push(eclass.name);
    }
    summary.courses.push(courseSummary);
  }

  return (summary);
}

/** Creates an object summarising the results */
function createCourseSummary(course: Course): CourseSummary {
  const summary: CourseSummary = {
    name: course.name,
    length: course.length,
    climb: course.climb,
    classes: [],
    numcompetitors: 0,
  };
  return (summary);
}
