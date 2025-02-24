import { DocumentSnapshot, Timestamp } from '@angular/fire/firestore';

type ISODateString = string;

export type EventGrade = "IOF" | "International" | "National" | "Regional" | "Club" | "Local";

export class EventGrades {
   static grades: Array<EventGrade> = ["IOF", "International", "National", "Regional", "Club", "Local"];

   static indexObject(grade: EventGrade): any {
      const grades = EventGrades.grades.reverse();
      const gradeIndex = grades.indexOf(grade);

      const ret: any = {};
      for (let i = gradeIndex; i < grades.length; i++) {
         ret[grades[i]] = true;
      }
      return ret;
   }
}

export type EventDiscipline = "Sprint" | "Urban" | "Middle" | "Long" | "Ultralong" | "Other" | "Unknown";
export class EventDisciplines {
   static disciplines: Array<EventDiscipline> = ["Sprint", "Urban", "Middle", "Long", "Ultralong", "Other", "Unknown"];
}

export type EventType = "Foot" | "Bike" | "Ski" | "Trail" | "Other";
export class EventTypes {
   static types: Array<EventType> = ["Foot", "Bike", "Ski", "Trail", "Other"];
}

export type ControlCardType = "SI" | "Emit" | "Other";
export class ControlCardTypes {
   static types: Array<ControlCardType> = ["SI", "Emit", "Other"];
}

export type SplitsFileFormat = "auto" | "IOFv3" | "IOFv2" | "SICSV" | "SBCSV" | "SIHTML" | "ABMHTML";

export interface EventInfo {
   name: string;
   nationality: string;
   date: Date;
   club: string;
   grade: EventGrade;
   type: EventType;
   discipline: EventDiscipline;
   webpage: string;
   email: string;
   controlCardType: ControlCardType;
}

export interface SplitsFileInfo {
   uploadDate: Date;
   splitsFilename: string;
   splitsFileFormat: SplitsFileFormat;
   valid: boolean;
   failurereason?: string;
}

export interface EventSummary {
   numcompetitors: number;
   courses: Array<CourseSummary>;
}

export interface CourseSummary {
   name: string;
   length: number;
   climb: number;
   numcompetitors: number;
   classes: Array<string>;
}

export interface OEvent extends EventInfo {
   key: string;
   userId: string;
   splits?: SplitsFileInfo;
   summary?: EventSummary;
   legacyPassword?: string;
   yearIndex: number;  // Used for filtering
   gradeIndex: any;  // Used for filtering
}

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
   }
}

// Firestore data converters
// 1. Firebase only supports null while undefined is perferred in project
// 2. Firebase stores dates as Timestamps rather than Javascript dates.  
export const eventConverter = {
   toFirestore: (event: OEvent) => {
      return {
         ...event,
         splits: undefinedToNull(event.splits),
         summary: undefinedToNull(event.summary),
      };
   },
   fromFirestore: (snapshot: DocumentSnapshot<any>): OEvent => {
      const data = snapshot.data()!;
      return {
         ...data,
         date: dateFromFireStore(data.date),
         splits: mapSplits(data.splitss),
         summary: nullToUndefined(data.summary),
      } as OEvent;
   }
};
