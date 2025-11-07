import { getFirestore } from 'firebase-admin/firestore';
import { log, error } from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { eventConverter } from '../model/event-firebase-converters.js';
import { CourseSummary, EventSummary, OEvent } from '../model/oevent.js';
import { getStorageFile } from './results.js';
import { parseEventData } from './import/import.js';
import { Repairer } from './model/repairer.js';
import { Results } from './model/results.js';
import { Course } from './model/course.js';

export interface addResultsHttp {
  eventData: Partial<OEvent>;
  resultsData: string;
  apiKey: string;
}
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
export const uploadResults = onRequest(async (request, response) => {
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

  const { eventData, resultsData, apiKey } = request.body as addResultsHttp;

  if (!isValidApiKey(apiKey)) {
    response.status(401).json({ error: 'A valid API key is required.' });
    return;
  }

  if (!eventData || !resultsData) {
    response.status(400).json({ error: 'The function must be called with "eventData" and "resultsData".' });
    return;
  }

  const newEvent = {
    ...eventData,
    userId: 'Third'
  } as OEvent;

  // Validate results file ancd create event summary
  try {
    const results = parseEventData(resultsData);
    if (results.needsRepair) {
      Repairer.repairEventData(results);
    }

    newEvent.summary = populateSummary(results);
  } catch (err: any) {
    error(`createEventWithResults: Error parsing results data ${eventData.name}.`, err);
    response.status(500).json({ error: 'Error parsing results file' });
    return;
  }

  // Generate firestore Id
  const db = getFirestore();
  const newEventRef = db.collection('events').doc().withConverter(eventConverter);
  newEvent.key = newEventRef.id;

  try {
    // Upload results to storage
    const { file, filePath } = getStorageFile(newEvent);
    await file.save(resultsData, {
      contentType: 'text/plain; charset=utf-8',
    });
    log(`createEventWithResults: Successfully saved results to ${filePath}`);

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
  const validApiKey = process.env.UPLOAD_API_KEY;
  return apiKey === validApiKey;
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
