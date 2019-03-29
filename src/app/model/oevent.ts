import { ISODateString } from "./date";

export type EventGrade = "IOF" | "International" | "National" | "Regional"| "Club" | "Local";

export class EventGrades {
    static grades: Array<EventGrade> = ["IOF" , "International" , "National" , "Regional", "Club", "Local"];

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

export type EventDiscipline = "Sprint" | "Urban" | "Middle" | "Long" | "Ultralong"| "Other" ;
export class EventDisciplines {
    static disciplines: Array<EventDiscipline> = ["Sprint", "Urban", "Middle", "Long", "Ultralong", "Other" ];
}

export type EventType = "Foot" | "Bike" | "Ski" | "Trail" | "Other" ;
export class EventTypes {
    static types: Array<EventType> = ["Foot", "Bike" , "Ski" , "Trail" , "Other" ];
}

export type ControlCardType = "SI" | "Emit" | "Other";
export class ControlCardTypes {
    static types: Array<ControlCardType> = ["SI", "Emit" , "Other"];
}

export type SplitsFileFormat = "auto" | "IOFv3" |  "IOFv2" | "SICSV" | "SBCSV" | "SIHTML" | "ABMHTML" ;

export interface EventInfo {
    name: string;
    nationality: string;
    date: ISODateString;
    club: string;
    grade: EventGrade;
    type: EventType;
    discipline: EventDiscipline;
    webpage: string;
    email: string;
    controlCardType: ControlCardType;
}

export interface SplitsFileInfo {
    uploadDate: ISODateString;
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
     user: string;
     splits?: SplitsFileInfo | null;
     summary?: EventSummary | null;
     legacyPassword?: string;
     yearIndex: number;     // Used for filtering
     gradeIndex: any;  // Used for filtering
}


