
export type EventGrade = "IOF" | "International" | "National" | "Regional"| "Club" | "Local";

export class EventGrades {
    static grades: Array<EventGrade> = ["IOF" , "International" , "National" , "Regional", "Club", "Local"];
}

export type EventDiscipline = "Sprint" | "Urban" | "Middle" | "Long" | "Ultralong"| "Other" ;
export class EventDisciplines {
    static disciplines: Array<EventDiscipline> = ["Sprint", "Urban", "Middle", "Long", "Ultralong", "Other" ];
}

export type EventType = "Foot" | "Bike" | "Ski" | "Trail" | "Other" ;
export class EventTypes {
    static types: Array<EventType> = ["Foot", "Bike" , "Ski" , "Trail" , "Other" ];
}

export type SplitsFileFormat = "auto" | "IOFv3" |  "IOFv2" | "SICSV" | "SBCSV" | "SIHTML" | "ABMHTML" ;


export interface OEvent extends EventInfo {
     key?: string;
     user: string;
     splits?: SplitsFileInfo | null;
     summary?: EventSummary | null;
     legacyPassword?: string;
     date_club_index?: string;
     club_date_index?: string;
}

export interface EventInfo {
     name: string;
     nationality: string;
     eventdate: string;
     club: string;
     grade: number;
     type: string;
     discipline: string;
     webpage: string;
     email: string;
}

export interface SplitsFileInfo {
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

