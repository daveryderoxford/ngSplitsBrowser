import { Competitor, sbTime } from 'app/model/competitor';
import { Course } from 'app/model/course';

declare function CourseClass(name: string,
    numControls: number,
    competitors: Array<Competitor>,
    course: Course,
    hasDubiousData: boolean): CourseClass;

export interface CourseClass {
    name: string;
    numControls: number;
    competitors: Array<Competitor>;
    course: Course;
    hasDubiousData: boolean;

    /**
    * Records that this course-class has competitor data that SplitsBrowser has
    * deduced as dubious.
    */
    recordHasDubiousData();

    /**
    * Determines the time losses for the competitors in this course-class.
    */
    determineTimeLosses(): Array<sbTime>;
    /**
    * Returns whether this course-class is empty, i.e. has no competitors.
    * @sb-return {boolean} True if this course-class has no competitors, false if it
    *     has at least one competitor.
    */
    isEmpty(): boolean;

    /**
    * Sets the course that this course-class belongs to.
    * @sb-param {SplitsBrowser.Model.Course} course - The course this class belongs to.
    */
    setCourse(course: Course);

    /**
    * Returns the fastest split time recorded by competitors in this class.  If
    * no fastest split time is recorded (e.g. because all competitors
    * mispunched that control, or the class is empty), null is returned.
    * @sb-param {Number} controlIdx - The index of the control to return the
    *      fastest split to.
    * @sb-return {?Object} Object containing the name and fastest split, or
    *      null if no split times for that control were recorded.
    */
    getFastestSplitTo(controlIdx: number): any;

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
    getCompetitorsAtControlInTimeRange(controlNum, intervalStart, intervalEnd): Array<any>;
}
