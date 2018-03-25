import { CourseClass } from 'app/model/courseclass';
import { sbTime, Competitor } from 'app/model/competitor';

export interface FastestSplits {
    name: string;
    className: string;
    split: sbTime;
}

/**
    * A collection of 'classes', all runners within which ran the same physical
    * course.
    * Course length and climb are both optional and can both be null.
    */
declare function Course(
    name: string,
    classes: Array<CourseClass>,
    length?: number,
    climb?: number,
    controls?: Array<string> | null);

export interface Course {
    name: string;
    classes: Array<CourseClass>;
    length?: number;
    climb?: number;
    controls?: Array<string>;

    /**
    * Returns an array of the 'other' classes on this course.
    */
    getOtherClasses(courseClass: CourseClass): Array<CourseClass>;

    /**
    * Returns the number of course-classes that use this course.
    */
    getNumClasses(): number;

    /**
    * Returns whether this course has control code data.
    */
    hasControls(): boolean;

    /**
    * Returns the code of the control at the given number.
    *
    * The start is control number 0 and the finish has number one more than the
    * number of controls.  Numbers outside this range are invalid and cause an exception to be thrown.
    *
    * The codes for the start and finish are given by the constants SplitsBrowser.Model.Course.START and SplitsBrowser.Model.Course.FINISH.
    *
    * Retuns The code of the control, or one of the aforementioned
    */
    getControlCode(controlNum: number): string | null;

    /**
    * Returns whether this course uses the given leg.
    *
    * If this course lacks leg information, it is assumed not to contain any legs and so will return false for every leg.
    */
    usesLeg(startCode: string, endCode: string): boolean;

    /**
    * Returns the number of a leg in this course, given the start and end control codes.
    *
    * The number of a leg is the number of the end control (so the leg from
    * control 3 to control 4 is leg number 4.)  The number of the finish
    * control is one more than the number of controls.
    *
    * A negative number is returned if this course does not contain this leg.
    *
    */
    getLegNumber(startCode: string, endCode: string): number;

    /**
    * Returns the fastest splits recorded for a given leg of the course.
    * Note that this method should only be called if the course is known to use the given leg.
    */
    getFastestSplitsForLeg(startCode: string, endCode: string): Array<FastestSplits>;

    /**
    * Returns a list of all competitors on this course that visit the control with the given code in the time interval given.
    *
    * Specify SplitsBrowser.Model.Course.START for the start and SplitsBrowser.Model.Course.FINISH for the finish.
    * If the given control is not on this course, an empty list is returned.
    *
    * Returns Array of all competitors visiting the given control within the given time interval.
    */
    getCompetitorsAtControlInTimeRange(controlCode: string, intervalStart: sbTime, intervalEnd: sbTime): Array<Competitor>;

    /**
    * Returns a list of all competitors on this course that visit the control
    * with the given number in the time interval given.
    *
    * Returns an array of all competitors visiting the given control within the given time interval.
    */
    getCompetitorsAtControlNumInTimeRange(controlNum: number, intervalStart: sbTime, intervalEnd: sbTime): Array<Competitor>;

    /**
    * Returns whether the course has the given control.
    * Returns True if the course has the control, false if the
    *     course doesn't, or doesn't have any controls at all.
    */
    hasControl(controlCode: string): boolean;

    /**
    * Returns the control code(s) of the control(s) after the one with the
    * given code.
    *
    * Controls can appear multiple times in a course.  If a control appears
    * multiple times, there will be multiple next controls.  As a result
    */
    getNextControls(controlCode: string): Array<string>;
}
