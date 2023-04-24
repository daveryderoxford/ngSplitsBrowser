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

export type EventDiscipline = "Sprint" | "Urban" | "Middle" | "Long" | "Ultralong"| "Other" | "Unknown" ;
export class EventDisciplines {
    static disciplines: Array<EventDiscipline> = [ "Sprint", "Urban", "Middle", "Long", "Ultralong", "Other", "Unknown" ];
}

export type EventType = "Foot" | "Bike" | "Ski" | "Trail" | "Other" ;
export class EventTypes {
    static types: Array<EventType> = ["Foot", "Bike" , "Ski" , "Trail" , "Other" ];
}

export type ControlCardType = "SI" | "Emit" | "Other";
export class ControlCardTypes {
    static types: Array<ControlCardType> = ["SI", "Emit" , "Other"];
}
