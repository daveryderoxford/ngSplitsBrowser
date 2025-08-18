/**  Firestore data converters for OEvent and Club

 1. Firebase only supports null while undefined is perferred in project
 2. Firebase stores dates as Timestamps rather than Javascript dates.  
*/
import { FirestoreDataConverter, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';
import { OEvent, SplitsFileInfo } from './oevent.js';
import { Club } from './club.js';


export const eventConverter: FirestoreDataConverter<OEvent> = {
  toFirestore: (event: OEvent) => {
    return {
      ...event,
      splits: undefinedToNull(event.splits),
      summary: undefinedToNull(event.summary),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<any>): OEvent => {
    const data = snapshot.data();
    return {
      ...data,
      date: dateFromFireStore(data.date),
      splits: mapSplits(data.splits),
      summary: nullToUndefined(data.summary),
    } as OEvent;
  }
};

export const clubConverter: FirestoreDataConverter<Club> = {
  toFirestore: (club: Club) => {
    return {
      ...club,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<any>): Club => {
    // Type of raw snapsht cast away above raw data has different typing to club.
    const data = snapshot.data();
    return {
      ...data,
      lastEvent: dateFromFireStore(data.lastEvent)
    } as Club;
  }
};

const undefinedToNull = (value: any) => value === undefined ? null : value;
const nullToUndefined = (value: any) => value === null ? undefined : value;

function dateFromFireStore(raw: string | Timestamp): Date | undefined {
  if (raw === null) return undefined;
  return (raw instanceof Timestamp) ? raw.toDate() : new Date(raw);
}

function mapSplits(raw: any): SplitsFileInfo | undefined {
  if (!raw) return undefined;
  return {
    ...raw,
    uploadDate: dateFromFireStore(raw.uploadDate)
  };
}