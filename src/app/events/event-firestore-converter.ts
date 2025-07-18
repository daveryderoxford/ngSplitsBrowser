/**  Firestore data converters for OEvent and Club

 1. Firebase only supports null while undefined is perferred in project
 2. Firebase stores dates as Timestamps rather than Javascript dates.  
*/
import { FirestoreDataConverter, QueryDocumentSnapshot, SnapshotOptions, Timestamp } from '@angular/fire/firestore';
import { Club } from './model/club';
import { OEvent, SplitsFileInfo } from './model/oevent';

interface OEventFirestore extends Omit<OEvent, 'date' | 'splits'>  {
  date: Timestamp;
  splits: SplitsInfoFirestore;
}

interface SplitsInfoFirestore extends Omit<SplitsFileInfo, 'uploadDate'> {
  uploadDate: Timestamp;
}

interface ClubFirestore extends Omit<Club, 'lastEvent'> {
  lastEvent: Timestamp;
}

export const eventConverter: FirestoreDataConverter<OEvent, OEventFirestore> = {
  toFirestore: (event: OEvent): OEventFirestore => {
    console.log('To Firestore called. ' + JSON.stringify(event));
    return {
      ...event,
      date: Timestamp.fromDate(event.date),
      splits: undefinedToNull(event.splits),
      summary: undefinedToNull(event.summary),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<OEventFirestore>, options?: SnapshotOptions): OEvent => {
    const data = snapshot.data(options);
    return {
      ...data,
      date: dateFromFireStore(data.date),
      splits: mapSplits(data.splits),
      summary: nullToUndefined(data.summary),
    } as OEvent;
  }
};

export const clubConverter: FirestoreDataConverter<Club, ClubFirestore> = {
  toFirestore: (club: Club): ClubFirestore => {
    return {
      ...club,
      lastEvent: Timestamp.fromDate(club.lastEvent)
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