// @ts-nocheck

import { range as d3_range } from "d3-array";
import { map as d3_map, Map as d3_Map, set as d3_set, Set as d3_Set } from "d3-collection";
import { Competitor, Course, CourseClass, InvalidData, Results, sbTime, TimeUtilities, WrongFileFormat } from "../model";
import { FirstnameSurname } from "../model/competitor";
import { isNaNStrict } from "../model/util";
import { normaliseLineEndings, parseCourseClimb, parseCourseLength } from "./util";

export function parseOEEventData(data: string): Results {
    const reader = new OEReader(data);
    return (reader.parseEventData());
}

const parseTime = TimeUtilities.parseTime;

// Indexes of the various columns relative to the column for control-1.
const COLUMN_INDEXES: any = new Object();

[44, 46, 60].forEach((columnOffset) => {
    COLUMN_INDEXES[columnOffset] = {
        course: columnOffset - 7,
        distance: columnOffset - 6,
        climb: columnOffset - 5,
        controlCount: columnOffset - 4,
        placing: columnOffset - 3,
        startPunch: columnOffset - 2,
        finish: columnOffset - 1,
        control1: columnOffset
    };
});

[44, 46].forEach((columnOffset) => {
    COLUMN_INDEXES[columnOffset].nonCompetitive = columnOffset - 38;
    COLUMN_INDEXES[columnOffset].startTime = columnOffset - 37;
    COLUMN_INDEXES[columnOffset].time = columnOffset - 35;
    COLUMN_INDEXES[columnOffset].classifier = columnOffset - 34;
    COLUMN_INDEXES[columnOffset].club = columnOffset - 31;
    COLUMN_INDEXES[columnOffset].className = columnOffset - 28;
});

COLUMN_INDEXES[44].ecard = 1;
COLUMN_INDEXES[44].combinedName = 3;
COLUMN_INDEXES[44].yearOfBirth = 4;

COLUMN_INDEXES[46].ecard = 1;
COLUMN_INDEXES[46].surname = 3;
COLUMN_INDEXES[46].forename = 4;
COLUMN_INDEXES[46].yearOfBirth = 5;
COLUMN_INDEXES[46].gender = 6;

COLUMN_INDEXES[60].ecard = 3;
COLUMN_INDEXES[60].surname = 5;
COLUMN_INDEXES[60].forename = 6;
COLUMN_INDEXES[60].yearOfBirth = 7;
COLUMN_INDEXES[60].gender = 8;
COLUMN_INDEXES[60].combinedName = 3;
COLUMN_INDEXES[60].nonCompetitive = 10;
COLUMN_INDEXES[60].startTime = 11;
COLUMN_INDEXES[60].time = 13;
COLUMN_INDEXES[60].classifier = 14;
COLUMN_INDEXES[60].club = 20;
COLUMN_INDEXES[60].className = 26;
COLUMN_INDEXES[60].classNameFallback = COLUMN_INDEXES[60].course;
COLUMN_INDEXES[60].clubFallback = 18;

// Minimum control offset.
const MIN_CONTROLS_OFFSET = 37;


class OEReader {

    private classes = d3_map<any>();  // Map that associates classes to all of the competitors running on that class.
    private courseDetails = d3_map<any>();  // Map that associates course names to length and climb values.
    private columnIndexes = null; // The indexes of the columns that we read data from.
    private classCoursePairs = [];   // Set of all pairs of classes and course
    // (While it is common that one course may have multiple classes, it
    // seems also that one class can be made up of multiple courses, e.g.
    // M21E at BOC 2013.)
    private warnings = [] as Array<string>;   // Warnings about competitors that cannot be read in.
    private lines = [] as Array<string>;

    /**
    * Constructs an OE-format data reader.
    *
    * NOTE: The reader constructed can only be used to read data in once.
    * @constructor
    * @sb-param {String} data - The OE data to read in.
    */
    constructor(private data: string) {
    }

    /**
    * Parses the read-in data and returns it.
    * @sb-return {Event} Event-data read.
    */
    public parseEventData(): Results {

        this.data = normaliseLineEndings(this.data);

        this.lines = this.data.split(/\n/);

        const delimiter = this.identifyDelimiter();

        this.identifyFormatVariation(delimiter);

        // Discard the header row.
        this.lines.shift();

        this.lines.forEach((line, lineIndex) => {
            this.readLine(line, lineIndex + 1, delimiter);
        }, this);

        const classes = this.createClasses();
        if (classes.length === 0 && this.warnings.length > 0) {
            // A warning was generated for every single competitor in the file.
            // This file is quite probably not an OE-CSV file.
            throw new WrongFileFormat("This file may have looked vaguely like an OE CSV file but no data could be read out of it");
        }

        const courses = this.determineCourses(classes);
        return new Results(classes, courses, this.warnings);
    }

    /**
    * Remove any leading and trailing double-quotes from the given string.
    * @sb-param {String} value - The value to trim quotes from.
    * @sb-return {String} The string with any leading and trailing quotes removed.
    */
    private dequote(value: string): string {
        // eslint-disable-next-line @typescript-eslint/quotes
        if (value[0] === '"' && value[value.length - 1] === '"') {
            // eslint-disable-next-line @typescript-eslint/quotes
            value = value.substring(1, value.length - 1).replace(/""/g, '"').trim();
        }

        return value;
    }


    /**
    * Identifies the delimiter character that delimits the columns of data.
    * @sb-return {String} The delimiter character identified.
    */
    private identifyDelimiter(): string {

        const DELIMITERS = [";", ",", "\t", "\\"];

        if (this.lines.length <= 1) {
            throw new WrongFileFormat("No data found to read");
        }

        const firstDataLine = this.lines[1];
        for (let i = 0; i < DELIMITERS.length; i += 1) {
            const delimiter = DELIMITERS[i];
            if (firstDataLine.split(delimiter).length > MIN_CONTROLS_OFFSET) {
                return delimiter;
            }
        }

        throw new WrongFileFormat("Data appears not to be in the OE CSV format");
    }

    /**
    * Identifies which variation on the OE CSV format we are parsing.
    *
    * At present, the only variations supported are 44-column, 46-column and
    * 60-column.  In all cases, the numbers count the columns before the
    * controls data.
    *
    * @sb-param {String} delimiter - The character used to delimit the columns of
    *     data.
    */
    private identifyFormatVariation(delimiter: string) {

        const firstLine = this.lines[1].split(delimiter);

        const controlCodeRegexp = /^[A-Za-z0-9]+$/;
        for (const columnOffset in COLUMN_INDEXES) {
            if (COLUMN_INDEXES.hasOwnProperty(columnOffset)) {
                // Convert columnOffset to a number.  It will presently be a
                // string because it is an object property.
                const columnOffsetNum = parseInt(columnOffset, 10);

                // We want there to be a control code at columnOffset, with
                // both preceding columns either blank or containing a valid
                // time.
                if (columnOffsetNum < firstLine.length &&
                    controlCodeRegexp.test(firstLine[columnOffset]) &&
                    (firstLine[columnOffsetNum - 2].trim() === "" || parseTime(firstLine[columnOffsetNum - 2]) !== null) &&
                    (firstLine[columnOffsetNum - 1].trim() === "" || parseTime(firstLine[columnOffsetNum - 1]) !== null)) {

                    // Now check the control count exists.  If not, we've
                    // probably got a triple-column CSV file instead.
                    const controlCountColumnIndex = COLUMN_INDEXES[columnOffset].controlCount;
                    if (firstLine[controlCountColumnIndex].trim() !== "") {
                        this.columnIndexes = COLUMN_INDEXES[columnOffsetNum];
                        return;
                    }
                }
            }
        }

        throw new WrongFileFormat("Did not find control 1 at any of the supported indexes");
    }

    /**
    * Returns the name of the class in the given row.
    * @sb-param {Array} row - Array of row data.
    * @sb-return {String} Class name.
    */
    private getClassName(row: Array<string>): string {
        let className = row[this.columnIndexes.className];
        if (className === "" && this.columnIndexes.hasOwnProperty("classNameFallback")) {
            // 'Nameless' variation: no class names.
            className = row[this.columnIndexes.classNameFallback];
        }
        return className;
    }

    /**
    * Reads the start-time in the given row.  The start punch time will
    * be used if it is available, otherwise the start time.
    * @sb-param {Array} row - Array of row data.
    * @sb-return {?Number} Parsed start time, or null for none.
    */
    private getStartTime(row: Array<string>): sbTime | null {
        let startTimeStr = row[this.columnIndexes.startPunch];
        if (startTimeStr === "") {
            startTimeStr = row[this.columnIndexes.startTime];
        }

        return parseTime(startTimeStr);
    }

    /**
    * Returns the number of controls to expect on the given line.
    * @sb-param {Array} row - Array of row data items.
    * @sb-param {Number} lineNumber - The line number of the line.
    * @sb-return {Number?} The number of controls, or null if the count could not be read.
    */
    private getNumControls(row: Array<string>, lineNumber: number): number | null {
        const className = this.getClassName(row);
        let fullname: string;
        if (className.trim() === "") {
            fullname = this.getFullname(this.getName(row)) || "<name unknown>";
            this.warnings.push("Could not find a class for competitor '" + fullname + "' (line " + lineNumber + ")");
            return null;
        } else if (this.classes.has(className)) {
            return this.classes.get(className).numControls;
        } else {
            const numControls = parseInt(row[this.columnIndexes.controlCount], 10);
            if (isFinite(numControls)) {
                return numControls;
            } else {
                fullname = this.getFullname(this.getName(row)) || "<name unknown>";
                const err = "Could not read the control count '" +
                    row[this.columnIndexes.controlCount] + "' for competitor '" + fullname + "' from line " + lineNumber;
                this.warnings.push(err);
                return null;
            }
        }
    }

    /**
    * Reads the cumulative times out of a row of competitor data.
    * @sb-param {Array} row - Array of row data items.
    * @sb-param {Number} lineNumber - Line number of the row within the source data.
    * @sb-param {Number} numControls - The number of controls to read.
    * @sb-return {Array} Array of cumulative times.
    */
    private readCumulativeTimes(row: Array<string>, lineNumber: number, numControls: number): Array<sbTime> {

        const cumTimes = [0];

        for (let controlIdx = 0; controlIdx < numControls; controlIdx += 1) {
            const cellIndex = this.columnIndexes.control1 + 1 + 2 * controlIdx;
            const cumTimeStr = (cellIndex < row.length) ? row[cellIndex] : null;
            const cumTime = (cumTimeStr === null) ? null : parseTime(cumTimeStr);
            cumTimes.push(cumTime);
        }

        let totalTime = parseTime(row[this.columnIndexes.time]);
        if (totalTime === null) {
            // 'Nameless' variation: total time missing, so calculate from
            // start and finish times.
            const startTime = this.getStartTime(row);
            const finishTime = parseTime(row[this.columnIndexes.finish]);
            if (startTime !== null && finishTime !== null) {
                totalTime = finishTime - startTime;
            }
        }

        cumTimes.push(totalTime);

        return cumTimes;
    }

    /**
    * Checks to see whether the given row contains a new class, and if so,
    * creates it.
    * @sb-param {Array} row - Array of row data items.
    * @sb-param {Number} numControls - The number of controls to read.
    */
    private createClassIfNecessary(row: Array<string>, numControls: number): void {
        const className = this.getClassName(row);
        if (!this.classes.has(className)) {
            this.classes.set(className, { numControls: numControls, competitors: [] });
        }
    }

    /**
    * Checks to see whether the given row contains a new course, and if so,
    * creates it.
    * @sb-param {Array} row - Array of row data items.
    * @sb-param {Number} numControls - The number of controls to read.
    */
    private createCourseIfNecessary(row: Array<string>, numControls: number) {
        const courseName = row[this.columnIndexes.course];
        if (!this.courseDetails.has(courseName)) {
            const controlNums = d3_range(0, numControls).map((controlIdx) => {
                return row[this.columnIndexes.control1 + 2 * controlIdx];
            }, this);
            this.courseDetails.set(courseName, {
                length: parseCourseLength(row[this.columnIndexes.distance]),
                climb: parseCourseClimb(row[this.columnIndexes.climb]),
                controls: controlNums
            });
        }
    }

    /**
    * Checks to see whether the given row contains a class-course pairing that
    * we haven't seen so far, and adds one if not.
    * @sb-param {Array} row - Array of row data items.
    */
    private createClassCoursePairIfNecessary(row: Array<string>) {
        const className = this.getClassName(row);
        const courseName = row[this.columnIndexes.course];

        if (!this.classCoursePairs.some((pair) => pair[0] === className && pair[1] === courseName)) {
            this.classCoursePairs.push([className, courseName]);
        }
    }

    /**
    * Reads the name of the competitor from the row.
    * @sb-param {Array} row - Array of row data items.
    * @sb-return {String | FirstnameSurname} The name of the competitor.
    */
    private getName(row: Array<string>): FirstnameSurname {
        // Default name to no name
        let name: FirstnameSurname = { firstname: "", surname: "" };

        if (this.columnIndexes.hasOwnProperty("forename") && this.columnIndexes.hasOwnProperty("surname")) {
            name = {
                firstname: row[this.columnIndexes.forename],
                surname: row[this.columnIndexes.surname]
            };
        }

        if (name.firstname === "" && name.surname === "" && this.columnIndexes.hasOwnProperty("combinedName")) {
            // 'Nameless' or 44-column variation.   Singl;e column for firstname as surname
           //  Treat first name as Firstname traeted as first word in name and surname the rest
           const combined = row[this.columnIndexes.combinedName];
           const index = combined.lastIndexOf(" ");
           if (index === -1) {
               name.firstname = "";
               name.surname = combined;
           } else {
               name.firstname = combined.slice(0, index).trim();
               name.surname = combined.slice(index).trim();
           }

        }

        return name;
    }

    private getEcard(row: Array<string>): string | null {
        return row[this.columnIndexes.ecard];
    }

    private getFullname(name: FirstnameSurname): string {
        return (name.firstname + " " + name.surname).trim();
    }

    /**
    * Reads in the competitor-specific data from the given row and adds it to
    * the event data read so far.
    * @sb-param {Array} row - Row of items read from a line of the input data.
    * @sb-param {Array} cumTimes - Array of cumulative times for the competitor.
    */
    private addCompetitor(row: Array<string>, cumTimes: Array<number>) {

        const className = this.getClassName(row);
        const placing = row[this.columnIndexes.placing];
        let club = row[this.columnIndexes.club];
        if (club === "" && this.columnIndexes.hasOwnProperty("clubFallback")) {
            // Nameless variation: no club name, just number...
            club = row[this.columnIndexes.clubFallback];
        }

        const startTime = this.getStartTime(row);

        const name = this.getName(row);

        // Strip n/c or m/p off surname if it has been appended
        const isPlacingNonNumeric = (placing !== "" && isNaNStrict(parseInt(placing, 10)));
        if (isPlacingNonNumeric && name.surname.substring(name.surname.length - placing.length) === placing) {
            // trim the name to remove the placing from it if it is appended
            name.surname = name.surname.substring(0, name.surname.length - placing.length).trim();
        }

        const order = this.classes.get(className).competitors.length + 1;
        const competitor = Competitor.fromOriginalCumTimes(order, name, club, startTime, cumTimes);
        if ((row[this.columnIndexes.nonCompetitive] === "1" || isPlacingNonNumeric) && competitor.completed()) {
            // Competitor either marked as non-competitive, or has completed
            // the course but has a non-numeric placing.  In the latter case,
            // assume that they are non-competitive.
            competitor.setNonCompetitive();
        }

        const classifier = row[this.columnIndexes.classifier];
        if (classifier !== "" && classifier !== "0") {
            if (classifier === "1") {
                competitor.setNonStarter();
            } else if (classifier === "2") {
                competitor.setNonFinisher();
            } else if (classifier === "4") {
                competitor.disqualify();
            } else if (classifier === "5") {
                competitor.setOverMaxTime();
            }
        } else if (!competitor.hasAnyTimes()) {
            competitor.setNonStarter();
        }

        const yearOfBirthStr = row[this.columnIndexes.yearOfBirth];
        if (yearOfBirthStr !== "") {
            const yearOfBirth = parseInt(yearOfBirthStr, 10);
            if (!isNaNStrict(yearOfBirth)) {
                competitor.setYearOfBirth(yearOfBirth);
            }
        }

        competitor.ecardId = this.getEcard(row);

        if (this.columnIndexes.hasOwnProperty("gender")) {
            const gender = row[this.columnIndexes.gender];
            if (gender === "M" || gender === "F") {
                competitor.setGender(gender);
            }
        }

        this.classes.get(className).competitors.push(competitor);
    }

    /**
    * Parses the given line and adds it to the event data accumulated so far.
    * @sb-param {String} line - The line to parse.
    * @sb-param {Number} lineNumber - The number of the line (used in error
    *     messages).
    * @sb-param {String} delimiter - The character used to delimit the columns of
    *     data.
    */
    private readLine(line: string, lineNumber: number, delimiter: string) {

        if (line.trim() === "") {
            // Skip this blank line.
            return;
        }

        const row = line.split(delimiter).map((s) => s.trim())
            .map(this.dequote);

        // Check the row is long enough to have all the data besides the
        // controls data.
        if (row.length < MIN_CONTROLS_OFFSET) {
            // eslint-disable-next-line max-len
            throw new InvalidData("Too few items on line " + lineNumber + " of the input file: expected at least " + MIN_CONTROLS_OFFSET + ", got " + row.length);
        }

        const numControls = this.getNumControls(row, lineNumber);
        if (numControls !== null) {
            const cumTimes = this.readCumulativeTimes(row, lineNumber, numControls);

            this.createClassIfNecessary(row, numControls);
            this.createCourseIfNecessary(row, numControls);
            this.createClassCoursePairIfNecessary(row);

            this.addCompetitor(row, cumTimes);
        }
    }

    /**
    * Creates maps that describe the many-to-many join between the class names
    * and course names.
    * @sb-return {Object} Object that contains two maps describing the
    *     many-to-many join.
    */
    private getMapsBetweenClassesAndCourses() {

        const classesToCourses = d3_map<any>();
        const coursesToClasses = d3_map<any>();

        this.classCoursePairs.forEach((pair) => {
            const className = pair[0];
            const courseName = pair[1];

            if (classesToCourses.has(className)) {
                classesToCourses.get(className).push(courseName);
            } else {
                classesToCourses.set(className, [courseName]);
            }

            if (coursesToClasses.has(courseName)) {
                coursesToClasses.get(courseName).push(className);
            } else {
                coursesToClasses.set(courseName, [className]);
            }
        });

        return { classesToCourses: classesToCourses, coursesToClasses: coursesToClasses };
    }

    /**
    * Creates and return a list of CourseClass objects from all of the data read.
    * @sb-return {Array} Array of CourseClass objects.
    */
    private createClasses(): Array<CourseClass> {
        const classNames = this.classes.keys();
        classNames.sort();
        return classNames.map((className) => {
            const courseClass = this.classes.get(className);
            return new CourseClass(className, courseClass.numControls, courseClass.competitors);
        }, this);
    }

    /**
    * Find all of the courses and classes that are related to the given course.
    *
    * It's not always as simple as one course having multiple classes, as there
    * can be multiple courses for one single class, and even multiple courses
    * among multiple classes (e.g. M20E, M18E on courses 3, 3B at BOC 2013.)
    * Essentially, we have a many-to-many join, and we want to pull out of that
    * all of the classes and courses linked to the one course with the given
    * name.
    *
    * (For the graph theorists among you, imagine the bipartite graph with
    * classes on one side and courses on the other.  We want to find the
    * connected subgraph that this course belongs to.)
    *
    * @sb-param {String} initCourseName - The name of the initial course.
    * @sb-param {Object} manyToManyMaps - Object that contains the two maps that
    *     map between class names and course names.
    * @sb-param {d3 set} doneCourseNames - Set of all course names that have been
    *     'done', i.e. included in a Course object that has been returned from
    *     a call to this method.
    * @sb-param {d3_map} classesMap - Map that maps class names to CourseClass
    *     objects.
    * @sb-return {SplitsBrowser.Model.Course} - The created Course object.
    */
    private createCourseFromLinkedClassesAndCourses(initCourseName: string,
        manyToManyMaps: any,
        doneCourseNames: d3_Set,
        classesMap: d3_Map<any>): Course {

        const courseNamesToDo = [initCourseName];
        const classNamesToDo = [];
        const relatedCourseNames = [];
        const relatedClassNames = [];

        let courseName;
        let className;

        while (courseNamesToDo.length > 0 || classNamesToDo.length > 0) {
            while (courseNamesToDo.length > 0) {
                courseName = courseNamesToDo.shift();
                const classNames = manyToManyMaps.coursesToClasses.get(courseName);
                for (let clsIdx = 0; clsIdx < classNames.length; clsIdx += 1) {
                    className = classNames[clsIdx];
                    if (classNamesToDo.indexOf(className) < 0 && relatedClassNames.indexOf(className) < 0) {
                        classNamesToDo.push(className);
                    }
                }

                relatedCourseNames.push(courseName);
            }

            while (classNamesToDo.length > 0) {
                className = classNamesToDo.shift();
                const courseNames = manyToManyMaps.classesToCourses.get(className);
                for (let crsIdx = 0; crsIdx < courseNames.length; crsIdx += 1) {
                    courseName = courseNames[crsIdx];
                    if (courseNamesToDo.indexOf(courseName) < 0 && relatedCourseNames.indexOf(courseName) < 0) {
                        courseNamesToDo.push(courseName);
                    }
                }

                relatedClassNames.push(className);
            }
        }

        // Mark all of the courses that we handled here as done.
        relatedCourseNames.forEach((courseName1) => {
            doneCourseNames.add(courseName1);
        });

        const classesForThisCourse = relatedClassNames.map((className1) => {
            return classesMap.get(className1);
        });
        const details = this.courseDetails.get(initCourseName);
        const course = new Course(initCourseName, classesForThisCourse, details.length, details.climb, details.controls);

        classesForThisCourse.forEach((courseClass) => {
            courseClass.setCourse(course);
        });

        return course;
    }

    /**
    * Sort through the data read in and create Course objects representing each
    * course in the event.
    * @sb-param {Array} classes - Array of CourseClass objects read.
    * @sb-return {Array} Array of course objects.
    */
    private determineCourses(classes: Array<CourseClass>): Array<Course> {

        const manyToManyMaps = this.getMapsBetweenClassesAndCourses();

        // As we work our way through the courses and classes, we may find one
        // class made up from multiple courses (e.g. in BOC2013, class M21E
        // uses course 1A and 1B).  In this set we collect up all of the
        // courses that we have now processed, so that if we later come across
        // one we've already dealt with, we can ignore it.
        const doneCourseNames = d3_set();

        const classesMap = d3_map();
        classes.forEach((courseClass) => {
            classesMap.set(courseClass.name, courseClass);
        });

        // List of all Course objects created so far.
        const courses: Course[] = [];
        manyToManyMaps.coursesToClasses.keys().forEach((courseName) => {
            if (!doneCourseNames.has(courseName)) {
                const course = this.createCourseFromLinkedClassesAndCourses(courseName, manyToManyMaps, doneCourseNames, classesMap);
                courses.push(course);
            }
        }, this);

        return courses;
    }
}
