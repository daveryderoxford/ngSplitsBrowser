// @ts-nocheck

import { range as d3_range } from "d3-array";
import { Competitor } from "./competitor";
import { Course } from "./course";
import { InvalidData } from "./exception";
import { sbTime } from "./time";
import { isNotNullNorNaN } from "./util";

export interface FastestSplitInfo {
    name: string;
    split: sbTime;
}

export interface FastestTimeInfo {
   name: string;
   time: sbTime;
}

export class CourseClass {
    course: any = null;
    hasDubiousData = false;
    /**
     * Object that represents a collection of competitor data for a class.
     * name - Name of the class.
     * Number of controls.
     * Array of Competitor objects.
     */
    constructor(public name: string,
        public numControls: number,
        public competitors: Array<Competitor>) {

        this.competitors.forEach( (comp) => {
            comp.setClass(this);
        });
    }

    /**
    * Records that this course-class has competitor data that SplitsBrowser has
    * deduced as dubious.
    */
    public recordHasDubiousData(): void {
        this.hasDubiousData = true;
    }

    /**
    * Determines the time losses for the competitors in this course-class.
    */
    public determineTimeLosses(): void {
        const fastestSplitTimes = d3_range(1, this.numControls + 2).map( (controlIdx) => {
            const splitRec = this.getFastestSplitTo(controlIdx);
            return (splitRec === null) ? null : splitRec.split;
        }, this);

        this.competitors.forEach( (comp) => {
            comp.determineTimeLosses(fastestSplitTimes);
        });
    }

    /**
    * Returns whether this course-class is empty, i.e. has no competitors.
    * Returns True if this course-class has no competitors, false if it has at least one competitor.
    */
    public isEmpty(): boolean {
        return (this.competitors.length === 0);
    }

    /**
    * Sets the course that this course-class belongs to.
    * course - The course this class belongs to.
    */
    public setCourse(course: Course) {
        this.course = course;
    }

    /**
    * Returns the fastest split time recorded by competitors in this class.  If
    * no fastest split time is recorded (e.g. because all competitors
    * mispunched that control, or the class is empty), null is returned.
    * controlIdx - The index of the control to return the fastest split to.
    * Returns Object containing the name and fastest split, or
    *      null if no split times for that control were recorded.
    */
    public getFastestSplitTo(controlIdx: number): FastestSplitInfo | null {
        if (typeof controlIdx !== "number" || controlIdx < 1 || controlIdx > this.numControls + 1) {
            throw new InvalidData("Cannot return splits to leg '" + controlIdx + "' in a course with " + this.numControls + " control(s)");
        }

        let fastestSplit = null;
        let fastestCompetitor = null;
        this.competitors.forEach( (comp) => {
            const compSplit = comp.getSplitTimeTo(controlIdx);
            if (isNotNullNorNaN(compSplit)) {
                if (fastestSplit === null || compSplit < fastestSplit) {
                    fastestSplit = compSplit;
                    fastestCompetitor = comp;
                }
            }
        });

        // @ts-ignore  fastestCompetitor must be set of fastest splt was found
        return (fastestSplit === null) ? null : { split: fastestSplit, name: fastestCompetitor.name };
    }

    /**
    * Returns all competitors that visited the control in the given time
    * interval.
    * @sb-param {Number} controlNum - The number of the control, with 0 being the
    *     start, and this.numControls + 1 being the finish.
    * @sb-param {Number} intervalStart - The start time of the interval, as
    *     seconds past midnight.
    * @sb-param {Number} intervalEnd - The end time of the interval, as seconds
    *     past midnight.
    * @sb-return {Array} Array of objects listing the name and start time of each
    *     competitor visiting the control within the given time interval.
    */
    public getCompetitorsAtControlInTimeRange(controlNum: number,
        intervalStart: sbTime,
        intervalEnd: sbTime): Array<FastestTimeInfo> {
        if (typeof controlNum !== "number" || isNaN(controlNum) || controlNum < 0 || controlNum > this.numControls + 1) {
            throw new InvalidData("Control number must be a number between 0 and " + this.numControls + " inclusive");
        }

        const matchingCompetitors = [];
        this.competitors.forEach( (comp) => {
            const cumTime = comp.getCumulativeTimeTo(controlNum);
            if (cumTime !== null && comp.startTime !== null) {
                const actualTimeAtControl = cumTime + comp.startTime;
                if (intervalStart <= actualTimeAtControl && actualTimeAtControl <= intervalEnd) {
                    matchingCompetitors.push({ name: comp.name, time: actualTimeAtControl });
                }
            }
        });

        return matchingCompetitors;
    }

}
