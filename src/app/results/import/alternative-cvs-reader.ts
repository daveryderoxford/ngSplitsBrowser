// @ts-nocheck

import { Competitor, Course, CourseClass, Results, TimeUtilities, WrongFileFormat } from "../model";
import { normaliseLineEndings, parseCourseClimb, parseCourseLength } from "./util";

interface ColumnFormat {
    controlsOffset;
    step;
    name;
    club;
    courseName;
    startTime;
    length;
    climb;
    placing;
    finishTime;
    allowMultipleCompetitorNames;
}

/* eslint-disable max-len */

const parseTime = TimeUtilities.parseTime;

// This reader reads in alternative CSV formats, where each row defines a
// separate competitor, and includes course details such as name, controls
// and possibly distance and climb.

// There is presently one variation supported:
// * one, distinguished by having three columns per control: control code,
//   cumulative time and 'points'.  (Points is never used.)  Generally,
//   these formats are quite sparse; many columns (e.g. club, placing,
//   start time) are blank or are omitted altogether.

const TRIPLE_COLUMN_FORMAT: ColumnFormat = {
    controlsOffset: 38,  // Control data starts in column AM (index 38).
    step: 3,             // Number of columns per control.
    name: 3,             // Column indexes of various data
    club: 5,
    courseName: 7,
    startTime: 8,
    length: null,
    climb: null,
    placing: null,
    finishTime: null,
    allowMultipleCompetitorNames: true
};

export function parseTripleColumnEventData(data: string): Results {
    const reader = new TrippleCVSReader(TRIPLE_COLUMN_FORMAT);
    return reader.parseEventData(data);
}

// Supported delimiters.
const DELIMITERS = [",", ";"];

class TrippleCVSReader {
    classes = new Map();
    delimiter = null;
    warnings = [];

    controlsTerminationOffset: number;

    /**
    * Object used to read data from an alternative CSV file.
    * @constructor
    * @sb-param {Object} format - Object that describes the data format to read.
    */
    constructor( private format: ColumnFormat ) {
        this.format = format;

        // Return the offset within the control data that should be used when
        // looking for control codes.  This will be 0 if the format specifies a
        // finish time, and the format step if the format has no finish time.
        // (In this case, the finish time is with the control data, but we
        // don't wish to read any control code specified nor validate it.)
        this.controlsTerminationOffset = (format.finishTime === null) ? format.step : 0;
    }

    /**
    * Determine the delimiter used to delimit data.
    * @sb-param {String} firstDataLine - The first data line of the file.
    * @sb-return {?String} The delimiter separating the data, or null if no
    *    suitable delimiter was found.
    */
    private determineDelimiter = function (firstDataLine: string): string | null {
        for (let index = 0; index < DELIMITERS.length; index += 1) {
            const delimiter = DELIMITERS[index];
            const lineParts = firstDataLine.split(delimiter);
            this.trimTrailingEmptyCells(lineParts);
            if (lineParts.length > this.format.controlsOffset) {
                return delimiter;
            }
        }

        return null;
    };

    /**
    * Trim trailing empty-string entries from the given array.
    * The given array is mutated.
    * @sb-param {Array} array - The array of string values.
    */
    private trimTrailingEmptyCells(array: Array<string>) {
        let index = array.length - 1;
        while (index >= 0 && array[index] === "") {
            index -= 1;
        }

        array.splice(index + 1, array.length - index - 1);
    }

    /**
    * Some lines of some formats can have multiple delimited competitors, which
    * will move the following columns out of their normal place.  Identify any
    * such situations and merge them together.
    * @sb-param {Array} row - The row of data read from the file.
    */
    private adjustLinePartsForMultipleCompetitors = function (row: Array<string>): void {
        if (this.format.allowMultipleCompetitorNames) {
            while (row.length > this.format.name + 1 && row[this.format.name + 1].match(/^\s\S/)) {
                row[this.format.name] += "," + row[this.format.name + 1];
                row.splice(this.format.name + 1, 1);
            }
        }
    };

    /**
    * Check the first line of data read in to verify that all of the control
    * codes specified are alphanumeric.
    * @sb-param {String} firstLine - The first line of data from the file (not
    *     the header line).
    */
    private checkControlCodesAlphaNumeric = function (firstLine: string): void {

        // All control codes except perhaps the finish are alphanumeric.
        const controlCodeRegexp = /^[A-Za-z0-9]+$/;

        const lineParts = firstLine.split(this.delimiter);
        this.trimTrailingEmptyCells(lineParts);
        this.adjustLinePartsForMultipleCompetitors(lineParts, this.format);

        for (let index = this.format.controlsOffset; index + this.controlsTerminationOffset < lineParts.length; index += this.format.step) {
            if (!controlCodeRegexp.test(lineParts[index])) {
                throw new WrongFileFormat("Data appears not to be in an alternative CSV format - data in cell " + index +
                    " of the first row ('" + lineParts[index] + "') is not an number");
            }
        }
    };

    /**
    * Adds the competitor to the course with the given name.
    * @sb-param {Competitor} competitor - The competitor object read from the row.
    * @sb-param {String} courseName - The name of the course.
    * @sb-param {Array} row - Array of string parts making up the row of data read.
    */
    private addCompetitorToCourse = function (competitor, courseName, row: Array<string>): void {
        if (this.classes.has(courseName)) {
            const cls = this.classes.get(courseName);
            const cumTimes = competitor.getAllOriginalCumulativeTimes();
            // Subtract one from the list of cumulative times for the
            // cumulative time at the start (always 0), and add one on to
            // the count of controls in the class to cater for the finish.
            if (cumTimes.length - 1 !== (cls.controls.length + 1)) {
                this.warnings.push("Competitor '" + competitor.name + "' has the wrong number of splits for course '" + courseName + "': " +
                    "expected " + (cls.controls.length + 1) + ", actual " + (cumTimes.length - 1));
            } else {
                cls.competitors.push(competitor);
            }
        } else {
            // New course/class.

            // Determine the list of controls, ignoring the finish.
            const controls = [];
            for (let controlIndex = this.format.controlsOffset; controlIndex + this.controlsTerminationOffset < row.length; controlIndex += this.format.step) {
                controls.push(row[controlIndex]);
            }

            const courseLength = (this.format.length === null) ? null : parseCourseLength(row[this.format.length]);
            const courseClimb = (this.format.climb === null) ? null : parseCourseClimb(row[this.format.climb]);

            this.classes.set(courseName, { length: courseLength, climb: courseClimb, controls: controls, competitors: [competitor] });
        }
    };

    /**
    * Read a row of data from a line of the file.
    * @sb-param {String} line - The line of data read from the file.
    */
    private readDataRow = function (line: string): void {
        const row = line.split(this.delimiter);
        this.trimTrailingEmptyCells(row);
        this.adjustLinePartsForMultipleCompetitors(row);

        if (row.length < this.format.controlsOffset) {
            // Probably a blank line.  Ignore it.
            return;
        }

        while ((row.length - this.format.controlsOffset) % this.format.step !== 0) {
            // Competitor might be missing cumulative time to last control.
            row.push("");
        }

        const competitorName = row[this.format.name];
        const club = row[this.format.club];
        const courseName = row[this.format.courseName];
        const startTime = parseTime(row[this.format.startTime]);

        const cumTimes = [0];
        for (let cumTimeIndex = this.format.controlsOffset + 1; cumTimeIndex < row.length; cumTimeIndex += this.format.step) {
            cumTimes.push(parseTime(row[cumTimeIndex]));
        }

        if (this.format.finishTime !== null) {
            const finishTime = parseTime(row[this.format.finishTime]);
            const totalTime = (startTime === null || finishTime === null) ? null : (finishTime - startTime);
            cumTimes.push(totalTime);
        }

        if (cumTimes.length === 1) {
            // Only cumulative time is the zero.
            if (competitorName !== "") {
                this.warnings.push(
                    "Competitor '" + competitorName + "' on course '" + (courseName === "" ? "(unnamed)" : courseName) + "' has no times recorded");
            }

            return;
        }

        const order = (this.classes.has(courseName)) ? this.classes.get(courseName).competitors.length + 1 : 1;

        const competitor = Competitor.fromOriginalCumTimes(order, competitorName, club, startTime, cumTimes);
        if (this.format.placing !== null && competitor.completed()) {
            const placing = row[this.format.placing];
            if (!placing.match(/^\d*$/)) {
                competitor.setNonCompetitive();
            }
        }

        if (!competitor.hasAnyTimes()) {
            competitor.setNonStarter();
        }

        this.addCompetitorToCourse(competitor, courseName, row);
    };

    /**
    * Given an array of objects containing information about each of the
    * course-classes in the data, create CourseClass and Course objects,
    * grouping classes by the list of controls
    * @sb-return {Object} Object that contains the courses and classes.
    */
    private createClassesAndCourses = function () {
        const courseClasses = [];

        // Group the classes by the list of controls.  Two classes using the
        // same list of controls can be assumed to be using the same course.
        const coursesByControlsLists = new Map();

        this.classes.entries().forEach((keyValuePair) => {
            const className = keyValuePair.key;
            const cls = keyValuePair.value;
            const courseClass = new CourseClass(className, cls.controls.length, cls.competitors);
            courseClasses.push(courseClass);

            const controlsList = cls.controls.join(",");
            if (coursesByControlsLists.has(controlsList)) {
                coursesByControlsLists.get(controlsList).classes.push(courseClass);
            } else {
                coursesByControlsLists.set(
                    controlsList, {
                        name: className,
                        classes: [courseClass],
                        length: cls.length,
                        climb: cls.climb,
                        controls:
                        cls.controls
                    });
            }
        });

        const courses = [];
        coursesByControlsLists.forEach((courseObject) => {
            const course = new Course(courseObject.name, courseObject.classes, courseObject.length, courseObject.climb, courseObject.controls);
            courseObject.classes.forEach((courseClass) => { courseClass.setCourse(course); });
            courses.push(course);
        });

        return { classes: courseClasses, courses: courses };
    };

    /**
    * Parse alternative CSV data for an entire event.
    * @sb-param {String} eventData - String containing the entire event data.
    * @sb-return {SplitsBrowser.Model.Event} All event data read in.
    */
    public parseEventData = function (eventData: string) {
        this.warnings = [];
        eventData = normaliseLineEndings(eventData);

        const lines = eventData.split(/\n/);

        if (lines.length < 2) {
            throw new WrongFileFormat("Data appears not to be in an alternative CSV format - too few lines");
        }

        const firstDataLine = lines[1];

        this.delimiter = this.determineDelimiter(firstDataLine);
        if (this.delimiter === null) {
            throw new WrongFileFormat("Data appears not to be in an alternative CSV format - first data line has fewer than " + this.format.controlsOffset + " parts when separated by any recognised delimiter");
        }

        this.checkControlCodesAlphaNumeric(firstDataLine);

        for (let rowIndex = 1; rowIndex < lines.length; rowIndex += 1) {
            this.readDataRow(lines[rowIndex]);
        }

        const classesAndCourses = this.createClassesAndCourses();
        return new Results(classesAndCourses.classes, classesAndCourses.courses, this.warnings);
    };
}
