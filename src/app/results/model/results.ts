import d3 = require("d3");

import { CourseClass } from "./course-class";
import { Course } from "./course";
import { Competitor } from "./competitor";
import { sbTime } from "./time";

export class Results {

    allCompetitors: Array<Competitor> = null;

    warnings: Array<string> = [];

    /**
    * Contains all of the data for an event.
    * @sb-param {Array} classes - Array of CourseClass objects representing all of
    *     the classes of competitors.
    * @sb-param {Array} courses - Array of Course objects representing all of the
    *     courses of the event.
    * @sb-param {Array} warnings - Array of strings containing warning messages
    *     encountered when reading in the event data.
    */
    constructor(public classes: Array<CourseClass>,
                public courses: Array<Course>,
        warnings?: Array<string>) {
        if (warnings) {
            this.warnings = warnings;
        }
    }

    /**
    * Determines time losses for each competitor in each class.
    *
    * This method should be called after reading in the event data but before
    * attempting to plot it.
    */
    public determineTimeLosses(): void {
        this.classes.forEach((courseClass) => {
            courseClass.determineTimeLosses();
        });
    }

    /**
    * Returns whether the event data needs any repairing.
    *
    * The event data needs repairing if any competitors are missing their
    * 'repaired' cumulative times.
    *
    * @sb-return {boolean} True if the event data needs repairing, false
    *     otherwise.
    */
    public needsRepair(): boolean {
        return this.classes.some((courseClass) => {
            return courseClass.competitors.some((competitor) => {
                return (competitor.getAllCumulativeTimes() === null);
            });
        });
    }

    /**
    * Returns the fastest splits for each class on a given leg.
    *
    * The fastest splits are returned as an array of objects, where each object
    * lists the competitors name, the class, and the split time in seconds.
    *
    * @sb-param {String} startCode - Code for the control at the start of the leg,
    *     or null for the start.
    * @sb-param {String} endCode - Code for the control at the end of the leg, or
    *     null for the finish.
    * @sb-return {Array} Array of objects containing fastest splits for that leg.
    */
    public getFastestSplitsForLeg(startCode: string, endCode: string): Array<any> {
        let fastestSplits = [];
        this.courses.forEach((course) => {
            if (course.usesLeg(startCode, endCode)) {
                fastestSplits = fastestSplits.concat(course.getFastestSplitsForLeg(startCode, endCode));
            }
        });

        fastestSplits.sort((a, b) => { return d3.ascending(a.split, b.split); });

        return fastestSplits;
    }

    /**
    * Returns a list of competitors that visit the control with the given code
    * within the given time interval.
    *
    * The fastest splits are returned as an array of objects, where each object
    * lists the competitors name, the class, and the split time in seconds.
    *
    * @sb-param {String} controlCode - Code for the control.
    * @sb-param {Number} intervalStart - Start of the time interval, in seconds
    *     since midnight.
    * @sb-param {?Number} intervalEnd - End of the time interval, in seconds, or
    *     null for the finish.
    * @sb-return {Array} Array of objects containing fastest splits for that leg.
    */
    public getCompetitorsAtControlInTimeRange(controlCode: string, intervalStart: sbTime, intervalEnd: sbTime): Array<any> {
        const competitors = [];
        this.courses.forEach((course) => {
            course.getCompetitorsAtControlInTimeRange(controlCode, intervalStart, intervalEnd).forEach((comp) => {
                competitors.push(comp);
            });
        });

        competitors.sort((a, b) => { return d3.ascending(a.time, b.time); });

        return competitors;
    }

    /**
    * Returns the list of controls that follow after a given control.
    * @sb-param {String} controlCode - The code for the control.
    * @sb-return {Array} Array of objects for each course using that control,
    *    with each object listing course name and next control.
    */
    public getNextControlsAfter(controlCode: string) {
        let courses = this.courses;
        if (controlCode !== Course.START) {
            courses = courses.filter((course) => { return course.hasControl(controlCode); });
        }

        return courses.map((course) => { return { course: course, nextControls: course.getNextControls(controlCode) }; });
    }

    /** Search for a competior in the results .
     *  Matches on firstname, surname or club (case independent)
     *  Requires exact match if search string is 2 characters or less or match on start if >2 characters
     */
    public findCompetitors(searchstring: string): Array<Competitor> {
        const twochars = searchstring.length > 2;

        if (this.allCompetitors === null) {
            this.populateAllCompetitors();
        }

        const ss = searchstring.toLocaleLowerCase();

        let found = this.allCompetitors.filter((comp) => {
            const surname = comp.surname.toLowerCase();
            const firstname = comp.firstname.toLowerCase();
            const club = comp.club.toLowerCase();

            return ((surname === ss) || (twochars && surname.startsWith(ss)) ||
                    (firstname === ss) || (twochars && firstname.startsWith(ss)) ||
                    (club === ss) || (twochars && club.startsWith(ss)));
        });

        // Sort into name order
        found = found.sort((a, b) => {
            const x = a.name.toLowerCase();
            const y = b.name.toLowerCase();
            return x < y ? -1 : x > y ? 1 : 0;
        });
        return (found);
    }

    private populateAllCompetitors() {
        this.allCompetitors = [];
        this.classes.forEach((courseClass) => {
            this.allCompetitors = this.allCompetitors.concat(courseClass.competitors);
        });
    }

    /** Search for a course class matching on name.
     *  Requires exact match if search string is 2 characters or less or match on start if >2 characters
     */
    findCourseClasss(searchstring: string): Array<CourseClass> {
        const twochars = searchstring.length > 2;
        const ss = searchstring.toLowerCase();

        const found = this.classes.filter((cc) => {
            const name = cc.name.toLowerCase();
            return ((name === ss) || (twochars && name.startsWith(ss)));
        });

        return (found);
    }

    /** Search for a course matching on name.
     *  Requires exact match if search string is 2 characters or less or match on start if >2 characters
     */
    findCourses(searchstring: string): Array<Course> {
        const twochars = searchstring.length > 2;
        const ss = searchstring.toLowerCase();

        const found = this.courses.filter((course) => {
            const name = course.name.toLowerCase();
            return ((name === ss) || (twochars && name.startsWith(ss)));
        });
        return (found);
    }
}

