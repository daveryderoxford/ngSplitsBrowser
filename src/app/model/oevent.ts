
export type EventType = 'IOF' | 'International' | 'National' | 'Regional'| 'Local';
export class EventTypes {
    static types: Array<EventType> = ['IOF' , 'International' , 'National' , 'Regional', 'Local'];
}

export interface OEvent extends EventInfo {
     $key?: string;
     user: string;
     splits?: SplitsData;
     summary?: EventSummary;
     legacyPassword?: string;
}

export interface EventInfo {
     name: string;
     nationality: string;
     eventdate: string;
     club: string;
     type: string;
     webpage: string;
     email: string;
}

export interface SplitsData {
     splitsFilename: string;
     splitsFileFormat: string;
}

export interface EventSummary {
    numcompetitors: number;
    courses: Array<CourseSummary>;
}

export interface CourseSummary {
    name: string;
    length: number;
    controls: number;
    climb: number;
    numcompetitors: number;
    classes: Array<string>;
    winner: string;
}

