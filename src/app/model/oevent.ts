
export type EventType = 'IOF' | 'International' | 'National' | 'Regional'| 'Local';
export class EventTypes {
    static types: Array<EventType> = ['IOF' , 'International' , 'National' , 'Regional', 'Local'];
}

export type SplitsFileFormat = 'auto' | 'IOFv3' |  'IOFv2' | 'SI-CSV' | 'SB-CSV' | 'HTML';

export interface OEvent extends EventInfo {
     $key?: string;
     user: string;
     splits?: SplitsData | null;
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
     type: string;
     webpage: string;
     email: string;
}

export interface SplitsData {
     splitsFilename: string;
     splitsFileFormat: SplitsFileFormat;
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
    winner: string;
}

