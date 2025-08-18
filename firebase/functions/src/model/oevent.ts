import { Timestamp } from 'firebase-admin/firestore';

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
    date: Timestamp;
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

/** Helper function to create a complete OEvent object for tests. */
export function createEvent(partialEvent: Partial<OEvent>): OEvent {
    const now = new Date();
    const defaults: OEvent = {
        key: 'test-key',
        name: 'Test Event',
        club: 'TESTCLUB',
        nationality: 'GBR',
        date: now,
        discipline: 'Long',
        type: 'Foot',
        userId: 'test-user-id',
        grade: 'Regional',
        webpage: 'http://example.com',
        email: 'test@example.com',
        controlCardType: 'SI',
        yearIndex: now.getFullYear(),
        gradeIndex: EventGrades.indexObject('Regional'),
    };
    return { ...defaults, ...partialEvent };
}