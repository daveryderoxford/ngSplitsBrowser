import { Course, CourseClassSet, Results, TimeUtilities } from "../../model";
import { Lang } from "./lang";

export interface FastestSplitsPopupData {
    title: string;
    data: Array<{ time: number, name: string, highlight: boolean }>;
    placeholder: string;
}

const getMessage = Lang.getMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;

export interface NextControlsDataArr {
    course: Course;
    nextControls: string[];
}

export interface NextControlsDataStr {
    course: Course;
    nextControls: string;
}

export interface NextControlData {
    thisControl: string;
    nextControls: NextControlsDataStr[];
}

export class SplitsPopupData {

    constructor(public maxFastestSplits: number, public raceGraphWindow: number) { }

    /**
    * Returns the fastest splits to a control.
    * @sb-param {CourseClassSet} courseClassSet - The course-class set containing the splits data.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-return {Object} Fastest-split data.
    */
    public getFastestSplitsPopupData(courseClassSet: CourseClassSet, controlIndex: number): FastestSplitsPopupData {

        Lang.setLanguage("en_gb");

        const data = courseClassSet.getFastestSplitsTo(this.maxFastestSplits, controlIndex);

        const ret = data.map((comp) => {
            return { time: comp.split, name: comp.name, highlight: false };
        });

        return {
            title: Lang.getMessage("SelectedClassesPopupHeader"),
            data: ret,
            placeholder: Lang.getMessage("SelectedClassesPopupPlaceholder")
        };
    }

    /**
    * Returns the fastest splits for the currently-shown leg.  The list
    * returned contains the fastest splits for the current leg for each class.
    * @sb-param {CourseClassSet} courseClassSet - The course-class set
    *     containing the splits data.
    * @sb-param {EventData} eventData - Data for the entire
    *     event.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-return {Object} Object that contains the title for the popup and the
    *     array of data to show within it.
    */
    public getFastestSplitsForLegPopupData(courseClassSet, eventData, controlIndex): FastestSplitsPopupData {

        const course = courseClassSet.getCourse();
        const startCode = course.getControlCode(controlIndex - 1);
        const endCode = course.getControlCode(controlIndex);

        const startControl = (startCode === Course.START) ? getMessage("StartName") : startCode;
        const endControl = (endCode === Course.FINISH) ? getMessage("FinishName") : endCode;

        const title = getMessageWithFormatting("FastestLegTimePopupHeader", { "$$START$$": startControl, "$$END$$": endControl });

        const primaryClass = courseClassSet.getPrimaryClassName();
        const data = eventData.getFastestSplitsForLeg(startCode, endCode).map((row) => {
            return {
                name: row.name,
                className: row.className,
                time: row.split,
                highlight: (row.className === primaryClass)
            };
        });
        return { title: title, data: data, placeholder: null };
    }

    /**
    * Returns an object containing an array of the competitors visiting a
    * control at a given time.
    * @sb-param {.CourseClassSet} courseClassSet - The course-class set
    *     containing the splits data.
    * @sb-param {EventData} eventData - Data for the entire
    *     event.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-param {Number} time - The current time, in units of seconds past midnight.
    * @sb-return {Object} Object containing competitor data.
    */
    public getCompetitorsVisitingCurrentControlPopupData(courseClassSet: CourseClassSet,
        resutsData: Results,
        controlIndex: number,
        time: number): FastestSplitsPopupData {

        const formatTime = TimeUtilities.formatTime;

        const controlCode = courseClassSet.getCourse().getControlCode(controlIndex);
        const intervalStart = Math.round(time) - this.raceGraphWindow / 2;
        const intervalEnd = Math.round(time) + this.raceGraphWindow / 2;
        const competitors = resutsData.getCompetitorsAtControlInTimeRange(controlCode, intervalStart, intervalEnd);

        const primaryClass = courseClassSet.getPrimaryClassName();
        const competitorData = competitors.map((row) => {
            return {
                name: row.name,
                className: row.className,
                time: row.time,
                highlight: (row.className === primaryClass)
            };
        });

        let controlName;
        if (controlCode === Course.START) {
            controlName = getMessage("StartName");
        } else if (controlCode === Course.FINISH) {
            controlName = getMessage("FinishName");
        } else {
            controlName = getMessageWithFormatting("ControlName", { "$$CODE$$": controlCode });
        }

        const title = getMessageWithFormatting("NearbyCompetitorsPopupHeader",
            { "$$START$$": formatTime(intervalStart), "$$END$$": formatTime(intervalEnd), "$$CONTROL$$": controlName });

        return { title: title, data: competitorData, placeholder: getMessage("NoNearbyCompetitors") };
    }

    /**
    * Compares two course names.
    * @sb-param {String} name1 - One course name to compare.
    * @sb-param {String} name2 - The other course name to compare.
    * @sb-return {Number} Comparison result: -1 if name1 < name2, 1 if
    *     name1 > name2 and 0 if name1 === name2.
    */
    private compareCourseNames(name1: string, name2: string): number {
        if (name1 === name2) {
            return 0;
        } else if (name1 === "" || name2 === "" || name1[0] !== name2[0]) {
            return (name1 < name2) ? -1 : 1;
        } else {
            // Both courses begin with the same letter.
            const regexResult = /^[^0-9]+/.exec(name1);
            if (regexResult !== null && regexResult.length > 0) {
                // regexResult should be a 1-element array.
                const result = regexResult[0];
                if (0 < result.length && result.length < name1.length && name2.substring(0, result.length) === result) {
                    const num1 = parseInt(name1.substring(result.length), 10);
                    const num2 = parseInt(name2.substring(result.length), 10);
                    if (!isNaN(num1) && !isNaN(num2)) {
                        return num1 - num2;
                    }
                }
            }

            return (name1 < name2) ? -1 : 1;
        }
    }

    /**
    * Tidy next-control data, by joining up multiple controls into one string,
    * and substituting the display-name of the finish if necessary.
    * @sb-param {Array} nextControls - Array of next-control information objects.
    * @sb-return {String} Next-control information containing joined-up control names.
    */
    private tidyNextControlsList(nextControls: Array<any>): NextControlsDataStr[] {
        return nextControls.map((nextControlRec) => {
            const codes = nextControlRec.nextControls.slice(0);
            if (codes[codes.length - 1] === Course.FINISH) {
                codes[codes.length - 1] = getMessage("FinishName");
            }

            return { course: nextControlRec.course, nextControls: codes.join(", ") };
        });
    }

    /**
    * Returns next-control data to show on the chart popup.
    * @sb-param {Course} course - The course containing the
    *     controls data.
    * @sb-param {EventData} eventData - Data for the entire
    *     event.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-return {Object} Next-control data.
    */
    // eslint-disable-next-line max-len
    public getNextControlData(course: Course, eventData: Results, controlIndex: number): NextControlData {

        const controlIdx = Math.min(controlIndex, course.controls.length);
        const controlCode = course.getControlCode(controlIdx);
        const nextControls = eventData.getNextControlsAfter(controlCode);

        // TODO - Should just order course names based on the order they are in the default list (eg distance or file order)
        nextControls.sort((c1, c2) => this.compareCourseNames(c1.course.name, c2.course.name));

        let thisControlName: string;
        if (controlCode === Course.START) {
            thisControlName = getMessage("StartName");
        } else {
            thisControlName = getMessageWithFormatting("ControlName", { "$$CODE$$": controlCode });
        }

        return {
            thisControl: thisControlName,
            nextControls: this.tidyNextControlsList(nextControls)
        };
    }
}
