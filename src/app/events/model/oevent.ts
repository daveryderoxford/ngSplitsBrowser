/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { DocumentSnapshot, Timestamp } from '@angular/fire/firestore';

export type EventGrade = "IOF" | "International" | "National" | "Regional" | "Club" | "Local";

export class EventGrades {
   static grades: EventGrade[] = ["IOF", "International", "National", "Regional", "Club", "Local"];

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
   static disciplines: EventDiscipline[] = ["Sprint", "Urban", "Middle", "Long", "Ultralong", "Other", "Unknown"];
}

export type EventType = "Foot" | "Bike" | "Ski" | "Trail" | "Other";
export class EventTypes {
   static types: EventType[] = ["Foot", "Bike", "Ski", "Trail", "Other"];
}

export type ControlCardType = "SI" | "Emit" | "Other";
export class ControlCardTypes {
   static types: ControlCardType[] = ["SI", "Emit", "Other"];
}

export type SplitsFileFormat = "auto" | "IOFv3" | "IOFv2" | "SICSV" | "SBCSV" | "SIHTML" | "ABMHTML";

export interface OEvent extends EventInfo {
   key: string;
   userId: string;
   splits?: SplitsFileInfo;
   summary?: EventSummary;
   legacyPassword?: string;
   yearIndex: number;  // Used for filtering
   gradeIndex: any;  // Used for filtering
}

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
   courses: CourseSummary[];
}

export interface CourseSummary {
   name: string;
   length: number;
   climb: number;
   numcompetitors: number;
   classes: string[];
}
