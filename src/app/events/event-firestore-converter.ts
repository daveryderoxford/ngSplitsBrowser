/**  Firestore data converters for OEvent and Club

 1. Firebase only supports null while undefined is perferred in project
 2. Firebase stores dates as Timestamps rather than Javascript dates.  
*/
import { DocumentData, FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';
import { Club } from './model/club';
import { OEvent, SplitsFileInfo } from './model/oevent';

export const eventConverter: FirestoreDataConverter<OEvent> = {
  toFirestore: (event: OEvent): DocumentData => {
    return {
      ...event,
      splits: undefinedToNull(event.splits),
      summary: undefinedToNull(event.summary),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<any>, options?: SnapshotOptions): OEvent => {
    const data = snapshot.data(options);
    return {
      ...data,
      date: dateFromFireStore(data.date),
      splits: mapSplits(data.splits),
      summary: nullToUndefined(data.summary),
    } as OEvent;
  }
};

export const clubConverter: FirestoreDataConverter<Club> = {
  toFirestore: (club: Club): DocumentData => {
    return {
      ...club,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<any>, options?: SnapshotOptions): Club => {
    // Type of raw snapsht cast away above raw data has different typing to club.
    const data = snapshot.data(options);
    return {
      ...data,
      lastEvent: dateFromFireStore(data.lastEvent)
    };
  }
};

const undefinedToNull = (value: any) => value === undefined ? null : value;
const nullToUndefined = (value: any) => value === null ? undefined : value;

function dateFromFireStore(raw: string | Timestamp): Date {
  if (raw === null) return undefined;
  return (raw instanceof Timestamp) ? raw.toDate() : new Date(raw);
}

function mapSplits(raw: any): SplitsFileInfo {
  if (!raw) return undefined;
  return {
    ...raw,
    uploadDate: dateFromFireStore(raw.uploadDate)
  };
}