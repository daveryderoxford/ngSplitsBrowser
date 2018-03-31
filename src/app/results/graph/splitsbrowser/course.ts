import { CourseClass } from "./course-class";
import { InvalidData } from "./util";
import { sbTime } from "./time";
import d3 = require("d3");

export class Course {

    /** 'Magic' control code that represents the start. */
    static START = "__START__";

    /** 'Magic' control code that represents the finish. */
    static FINISH = "__FINISH__";

    /**
    * A collection of 'classes', all runners within which ran the same physical
    * course.
    *
    * Course length and climb are both optional and can both be null.
    * @constructor
    * @sb-param {String} name - The name of the course.
    * @sb-param {Array} classes - Array of CourseClass objects comprising the course.
    * @sb-param {?Number} length - Length of the course, in kilometres.
    * @sb-param {?Number} climb - The course climb, in metres.
    * @sb-param {?Array} controls - Array of codes of the controls that make
    *     up this course.  This may be null if no such information is provided.
    */
    // tslint:disable-next-line:no-shadowed-variable
    constructor(public name: string,
        public classes: Array<CourseClass>,
        public length?: number,
        public climb?: number,
        public controls?: Array<string>) {

    }

    /**
    * Returns an array of the 'other' classes on this course.
    * @sb-param {CourseClass} courseClass - A course-class
    *    that should be on this course.
    * @sb-return {Array} Array of other course-classes.
    */
    public getOtherClasses(courseClass: CourseClass): Array<CourseClass> {
        const otherClasses = this.classes.filter(function (cls) { return cls !== courseClass; });
        if (otherClasses.length === this.classes.length) {
            // Given class not found.
            throw new InvalidData("Course.getOtherClasses: given class is not in this course");
        } else {
            return otherClasses;
        }
    };

    /**
    * Returns the number of course-classes that use this course.
    * @sb-return {Number} Number of course-classes that use this course.
    */
    public getNumClasses(): number {
        return this.classes.length;
    };

    /**
    * Returns whether this course has control code data.
    * @sb-return {boolean} true if this course has control codes, false if it does
    *     not.
    */
    public hasControls(): boolean {
        return (this.controls !== null);
    };

    /**
    * Returns the code of the control at the given number.
    *
    * The start is control number 0 and the finish has number one more than the
    * number of controls.  Numbers outside this range are invalid and cause an
    * exception to be thrown.
    *
    * The codes for the start and finish are given by the constants
    * Course.START and Course.FINISH.
    *
    * @sb-param {Number} controlNum - The number of the control.
    * @sb-return {?String} The code of the control, or one of the aforementioned
    *     constants for the start or finish.
    */
    public getControlCode(controlNum: number): string | null {
        if (controlNum === 0) {
            // The start.
            return Course.START;
        } else if (1 <= controlNum && controlNum <= this.controls.length) {
            return this.controls[controlNum - 1];
        } else if (controlNum === this.controls.length + 1) {
            // The finish.
            return Course.FINISH;
        } else {
            throw new InvalidData("Cannot get control code of control " + controlNum + " because it is out of range");
        }
    };

    /**
    * Returns whether this course uses the given leg.
    *
    * If this course lacks leg information, it is assumed not to contain any
    * legs and so will return false for every leg.
    *
    * @sb-param {String} startCode - Code for the control at the start of the leg,
    *     or null for the start.
    * @sb-param {String} endCode - Code for the control at the end of the leg, or
    *     null for the finish.
    * @sb-return {boolean} Whether this course uses the given leg.
    */
    public usesLeg(startCode: string, endCode: string): boolean {
        return this.getLegNumber(startCode, endCode) >= 0;
    };

    /**
    * Returns the number of a leg in this course, given the start and end
    * control codes.
    *
    * The number of a leg is the number of the end control (so the leg from
    * control 3 to control 4 is leg number 4.)  The number of the finish
    * control is one more than the number of controls.
    *
    * A negative number is returned if this course does not contain this leg.
    *
    * @sb-param {String} startCode - Code for the control at the start of the leg,
    *     or null for the start.
    * @sb-param {String} endCode - Code for the control at the end of the leg, or
    *     null for the finish.
    * @sb-return {Number} The control number of the leg in this course, or a
    *     negative number if the leg is not part of this course.
    */
    public getLegNumber(startCode: string, endCode: string): number {
        if (this.controls === null) {
            // No controls, so no, it doesn't contain the leg specified.
            return -1;
        }

        if (startCode === Course.START && endCode === Course.FINISH) {
            // No controls - straight from the start to the finish.
            // This leg is only present, and is leg 1, if there are no
            // controls.
            return (this.controls.length === 0) ? 1 : -1;
        } else if (startCode === Course.START) {
            // From the start to control 1.
            return (this.controls.length > 0 && this.controls[0] === endCode) ? 1 : -1;
        } else if (endCode === Course.FINISH) {
            return (this.controls.length > 0 && this.controls[this.controls.length - 1] === startCode) ? (this.controls.length + 1) : -1;
        } else {
            for (let controlIdx = 1; controlIdx < this.controls.length; controlIdx += 1) {
                if (this.controls[controlIdx - 1] === startCode && this.controls[controlIdx] === endCode) {
                    return controlIdx + 1;
                }
            }

            // If we get here, the given leg is not part of this course.
            return -1;
        }
    };

    /**
    * Returns the fastest splits recorded for a given leg of the course.
    *
    * Note that this method should only be called if the course is known to use
    * the given leg.
    *
    * @sb-param {String} startCode - Code for the control at the start of the leg,
    *     or Course.START for the start.
    * @sb-param {String} endCode - Code for the control at the end of the leg, or
    *     Course.FINISH for the finish.
    * @sb-return {Array} Array of fastest splits for each course-class using this
    *      course.
    */
    public getFastestSplitsForLeg(startCode: string, endCode: string): Array<sbTime> {

        const legNumber = this.getLegNumber(startCode, endCode);
        if (legNumber < 0) {
            const legStr = ((startCode === Course.START) ? "start" : startCode) + " to " + ((endCode === Course.FINISH) ? "end" : endCode);
            throw new InvalidData("Leg from " + legStr + " not found in course " + this.name);
        }

        const controlNum = legNumber;
        const fastestSplits = [];
        this.classes.forEach(function (courseClass) {
            const classFastest = courseClass.getFastestSplitTo(controlNum);
            if (classFastest !== null) {
                fastestSplits.push({ name: classFastest.name, className: courseClass.name, split: classFastest.split });
            }
        });

        return fastestSplits;
    };

    /**
    * Returns a list of all competitors on this course that visit the control
    * with the given code in the time interval given.
    *
    * Specify Course.START for the start and
    * Course.FINISH for the finish.
    *
    * If the given control is not on this course, an empty list is returned.
    *
    * @sb-param {String} controlCode - Control code of the required control.
    * @sb-param {Number} intervalStart - The start of the interval, as seconds
    *     past midnight.
    * @sb-param {Number} intervalEnd - The end of the interval, as seconds past
    *     midnight.
    * @sb-return  {Array} Array of all competitors visiting the given control
    *     within the given time interval.
    */
    public getCompetitorsAtControlInTimeRange(controlCode: string, intervalStart: sbTime, intervalEnd: sbTime) {
        if (this.controls === null) {
            // No controls means don't return any competitors.
            return [];
        } else if (controlCode === Course.START) {
            return this.getCompetitorsAtControlNumInTimeRange(0, intervalStart, intervalEnd);
        } else if (controlCode === Course.FINISH) {
            return this.getCompetitorsAtControlNumInTimeRange(this.controls.length + 1, intervalStart, intervalEnd);
        } else {
            const controlIdx = this.controls.indexOf(controlCode);
            if (controlIdx >= 0) {
                return this.getCompetitorsAtControlNumInTimeRange(controlIdx + 1, intervalStart, intervalEnd);
            } else {
                // Control not in this course.
                return [];
            }
        }
    };

    /**
    * Returns a list of all competitors on this course that visit the control
    * with the given number in the time interval given.
    *
    * @sb-param {Number} controlNum - The number of the control (0 = start).
    * @sb-param {Number} intervalStart - The start of the interval, as seconds
    *     past midnight.
    * @sb-param {Number} intervalEnd - The end of the interval, as seconds past
    *     midnight.
    * @sb-return  {Array} Array of all competitors visiting the given control
    *     within the given time interval.
    */
    public getCompetitorsAtControlNumInTimeRange(controlNum: number, intervalStart: sbTime, intervalEnd: sbTime) {
        const matchingCompetitors = [];
        this.classes.forEach(function (courseClass) {
            courseClass.getCompetitorsAtControlInTimeRange(controlNum, intervalStart, intervalEnd).forEach(function (comp) {
                matchingCompetitors.push({ name: comp.name, time: comp.time, className: courseClass.name });
            });
        });

        return matchingCompetitors;
    };

    /**
    * Returns whether the course has the given control.
    * @sb-param {String} controlCode - The code of the control.
    * @sb-return {boolean} True if the course has the control, false if the
    *     course doesn't, or doesn't have any controls at all.
    */
    public hasControl(controlCode: string): boolean {
        return this.controls !== null && this.controls.indexOf(controlCode) > -1;
    };

    /**
    * Returns the control code(s) of the control(s) after the one with the
    * given code.
    *
    * Controls can appear multiple times in a course.  If a control appears
    * multiple times, there will be multiple next controls.  As a result
    * @sb-param {String} controlCode - The code of the control.
    * @sb-return {Array} The code of the next control
    */
    public getNextControls(controlCode: string): Array<string> {
        if (this.controls === null) {
            throw new InvalidData("Course has no controls");
        } else if (controlCode === Course.FINISH) {
            throw new InvalidData("Cannot fetch next control after the finish");
        } else if (controlCode === Course.START) {
            return [(this.controls.length === 0) ? Course.FINISH : this.controls[0]];
        } else {
            let lastControlIdx = -1;
            const nextControls = [];
            do {
                const controlIdx = this.controls.indexOf(controlCode, lastControlIdx + 1);
                if (controlIdx === -1) {
                    break;
                } else if (controlIdx === this.controls.length - 1) {
                    nextControls.push(Course.FINISH);
                } else {
                    nextControls.push(this.controls[controlIdx + 1]);
                }

                lastControlIdx = controlIdx;
            } while (true); // Loop exits when broken.

            if (nextControls.length === 0) {
                throw new InvalidData("Control '" + controlCode + "' not found on course " + this.name);
            } else {
                return nextControls;
            }
        }
    };

}

