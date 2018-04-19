
import * as $ from "jquery";
import d3 = require("d3");

import { FirstnameSurname } from "app/results/model/competitor";
import { Competitor, Course, CourseClass, InvalidData, Results, WrongFileFormat } from "../model";
import { Version2Reader } from "./iof-xml-v2-reader";
import { Version3Reader } from "./iof-xml-v3-reader";

/**
* Parses IOF XML data in either the 2.0.3 format or the 3.0 format and
* returns the data.
* @sb-param {String} data - String to parse as XML.
* @sb-return {Event} Parsed event object.
*/
export function parseIOFXMLEventData(data: string): Results {

    const reader = determineReader(data);

    const xml = parseXml(data);

    validateData(xml, reader);

    const classResultElements = $("> ResultList > ClassResult", $(xml)).toArray();

    if (classResultElements.length === 0) {
        throw new InvalidData("No class result elements found");
    }

    const classes: Array<CourseClass> = [];

    // Array of all 'temporary' courses, intermediate objects that contain
    // course data but not yet in a suitable form to return.
    const tempCourses = [];

    // d3 map that maps course IDs plus comma-separated lists of controls
    // to the temporary course with that ID and controls.
    // (We expect that all classes with the same course ID have consistent
    // controls, but we don't assume that.)
    const coursesMap = d3.map<any>();

    const warnings: Array<string> = [];

    classResultElements.forEach((classResultElement) => {
        const parsedClass = parseClassData(classResultElement, reader, warnings);
        if (parsedClass === null) {
            // Class could not be parsed.
            return;
        }

        const courseClass = new CourseClass(parsedClass.name, parsedClass.controls.length, parsedClass.competitors);
        classes.push(courseClass);

        // Add to each temporary course object a list of all classes.
        const tempCourse = parsedClass.course;
        const courseKey = tempCourse.id + "," + parsedClass.controls.join(",");

        if (tempCourse.id !== null && coursesMap.has(courseKey)) {
            // We've come across this course before, so just add a class to
            // it.
            coursesMap.get(courseKey).classes.push(courseClass);
        } else {
            // New course.  Add some further details from the class.
            tempCourse.classes = [courseClass];
            tempCourse.controls = parsedClass.controls;
            tempCourses.push(tempCourse);
            if (tempCourse.id !== null) {
                coursesMap.set(courseKey, tempCourse);
            }
        }
    });

    // Now build up the array of courses.
    const courses = tempCourses.map((tempCourse) => {
        const course = new Course(tempCourse.name, tempCourse.classes, tempCourse.length, tempCourse.climb, tempCourse.controls);
        tempCourse.classes.forEach((courseClass) => { courseClass.setCourse(course); });
        return course;
    });

    return new Results(classes, courses, warnings);
}

// Regexp that matches the year in an ISO-8601 date.
// Both XML formats use ISO-8601 (YYYY-MM-DD) dates, so parsing is
// fortunately straightforward.
const yearRegexp = /^\d{4}/;

/**
* Parses the given XML string and returns the parsed XML.
* @sb-param {String} xmlString - The XML string to parse.
* @sb-return {XMLDocument} The parsed XML document.
*/
function parseXml(xmlString: string): XMLDocument {
    let xml: XMLDocument;
    try {
        xml = $.parseXML(xmlString);
    } catch (e) {
        throw new InvalidData("XML data not well-formed");
    }

    if ($("> *", $(xml)).length === 0) {
        // PhantomJS doesn't always fail parsing invalid XML; we may be
        // left with 'xml' just containing the DOCTYPE and no root element.
        throw new InvalidData("XML data not well-formed: " + xmlString);
    }

    return xml;
}

/**
* Parses and returns a competitor name from the given XML element.
*
* The XML element should have name 'PersonName' for v2.0.3 or 'Name' for
* v3.0.  It should contain 'Given' and 'Family' child elements from which
* the name will be formed.
*
* @sb-param {jQuery.selection} nameElement - jQuery selection containing the
*     PersonName or Name element.
* @sb-return {Name object} Name read from the element.
*/
function readCompetitorName(nameElement): FirstnameSurname {

    const forename = $("> Given", nameElement).text();
    const surname = $("> Family", nameElement).text();

    return ({
        firstname: forename,
        surname: surname
    });
}

const ALL_READERS = [
    new Version2Reader(),
    new Version3Reader()
];

/**
* Check that the XML document passed is in a suitable format for parsing.
*
* If any problems arise, this function will throw an exception.  If the
* data is valid, the function will return normally.
* @sb-param {XMLDocument} xml - The parsed XML document.
* @sb-param {Object} reader - XML reader used to assist with format-specific
*     XML reading.
*/
function validateData(xml, reader) {
    const rootElement = $("> *", xml);
    const rootElementNodeName = rootElement.prop("tagName");

    if (rootElementNodeName !== "ResultList") {
        throw new WrongFileFormat("Root element of XML document does not have expected name 'ResultList', got '" +
            rootElementNodeName + "'");
    }

    reader.checkVersion(rootElement);
}


/**
* Parses data for a single competitor.
* @sb-param {XMLElement} element - XML PersonResult element.
* @sb-param {Number} number - The competitor number (1 for first in the array
*     of those read so far, 2 for the second, ...)
* @sb-param {Object} reader - XML reader used to assist with format-specific
*     XML reading.
* @sb-param {Array} warnings - Array that accumulates warning messages.
* @sb-return {Object?} Object containing the competitor data, or null if no
*     competitor could be read.
*/
function parseCompetitor(element, number: number, reader, warnings: Array<string>) {
    const jqElement = $(element);

    const nameElement = reader.getCompetitorNameElement(jqElement);
    const name = readCompetitorName(nameElement);

    if ((name.surname === "") && (name.firstname === "")) {
        warnings.push("Could not find a name for a competitor");
        return null;
    }

    const club = reader.readClubName(jqElement);

    const dateOfBirth = reader.readDateOfBirth(jqElement);
    const regexResult = yearRegexp.exec(dateOfBirth);
    const yearOfBirth = (regexResult === null) ? null : parseInt(regexResult[0], 10);

    const gender = $("> Person", jqElement).attr("sex");

    const resultElement = $("Result", jqElement);
    if (resultElement.length === 0) {
        warnings.push("Could not find any result information for competitor '" + name + "'");
        return null;
    }

    const startTime = reader.readStartTime(resultElement);
    const totalTime = reader.readTotalTime(resultElement);
    const ecard = reader.readECard(resultElement);
    const route = reader.readRoute(resultElement);

    const splitTimes = $("> SplitTime", resultElement).toArray();
    const splitData = splitTimes.filter((splitTime) => { return !reader.isAdditional($(splitTime)); })
        .map((splitTime) => { return reader.readSplitTime($(splitTime)); });

    const controls = splitData.map((datum) => { return datum.code; });
    const cumTimes = splitData.map((datum) => { return datum.time; });

    cumTimes.unshift(0); // Prepend a zero time for the start.
    cumTimes.push(totalTime);

    const competitor = Competitor.fromOriginalCumTimes(number, name, club, startTime, cumTimes, );

    competitor.ecard = ecard;
    competitor.route = route;

    if (yearOfBirth !== null) {
        competitor.setYearOfBirth(yearOfBirth);
    }

    if (gender === "M" || gender === "F") {
        competitor.setGender(gender);
    }

    const status = reader.getStatus(resultElement);
    if (status === reader.StatusNonCompetitive) {
        competitor.setNonCompetitive();
    } else if (status === reader.StatusNonStarter) {
        competitor.setNonStarter();
    } else if (status === reader.StatusNonFinisher) {
        competitor.setNonFinisher();
    } else if (status === reader.StatusDisqualified) {
        competitor.disqualify();
    } else if (status === reader.StatusOverMaxTime) {
        competitor.setOverMaxTime();
    }

    return {
        competitor: competitor,
        controls: controls
    };
}

/**
* Parses data for a single class.
* @sb-param {XMLElement} element - XML ClassResult element
* @sb-param {Object} reader - XML reader used to assist with format-specific
*     XML reading.
* @sb-param {Array} warnings - Array to accumulate any warning messages within.
* @sb-return {Object} Object containing parsed data.
*/
function parseClassData(element, reader, warnings) {
    const jqElement = $(element);
    const cls = { name: null, competitors: [], controls: [], course: null };

    cls.course = reader.readCourseFromClass(jqElement, warnings);

    let className = reader.readClassName(jqElement);

    if (className === "") {
        className = "<unnamed class>";
    }

    cls.name = className;

    const personResults = $("> PersonResult", jqElement);
    if (personResults.length === 0) {
        warnings.push("Class '" + className + "' has no competitors");
        return null;
    }

    for (let index = 0; index < personResults.length; index += 1) {
        const competitorAndControls = parseCompetitor(personResults[index], index + 1, reader, warnings);
        if (competitorAndControls !== null) {
            const competitor = competitorAndControls.competitor;
            const controls = competitorAndControls.controls;
            if (cls.competitors.length === 0) {
                // First competitor.  Record the list of controls.
                cls.controls = controls;

                // Set the number of controls on the course if we didn't read
                // it from the XML.  Assume the first competitor's number of
                // controls is correct.
                if (cls.course.numberOfControls === null) {
                    cls.course.numberOfControls = cls.controls.length;
                }
            }

            // Subtract 2 for the start and finish cumulative times.
            const actualControlCount = competitor.getAllOriginalCumulativeTimes().length - 2;
            let warning = null;
            if (actualControlCount !== cls.course.numberOfControls) {
                // tslint:disable-next-line:max-line-length
                warning = "Competitor '" + competitor.name + "' in class '" + className + "' has an unexpected number of controls: expected "
                    + cls.course.numberOfControls + ", actual " + actualControlCount;
            } else {
                for (let controlIndex = 0; controlIndex < actualControlCount; controlIndex += 1) {
                    if (cls.controls[controlIndex] !== controls[controlIndex]) {
                        warning = "Competitor '" + competitor.name + "' has an unexpected control code at control " +
                            (controlIndex + 1) + ": expected '" + cls.controls[controlIndex] + "', actual '" + controls[controlIndex] + "'";
                        break;
                    }
                }
            }

            if (warning === null) {
                cls.competitors.push(competitor);
            } else {
                warnings.push(warning);
            }
        }
    }

    if (cls.course.id === null && cls.controls.length > 0) {
        // No course ID given, so join the controls together with commas
        // and use that instead.  Course IDs are only used internally by
        // this reader in order to merge classes, and the comma-separated
        // list of controls ought to work as a substitute identifier in
        // lieu of an 'official' course ID.
        //
        // This is intended mainly for IOF XML v2.0.3 files in particular
        // as they tend not to have course IDs.  However, this can also be
        // used with IOF XML v3.0 files that happen not to have course IDs.
        //
        // Idea thanks to 'dfgeorge' (David George?)
        cls.course.id = cls.controls.join(",");
    }

    return cls;
}

/**
* Determine which XML reader to use to parse the given event data.
* @sb-param {String} data - The event data.
* @sb-return {Object} XML reader used to read version-specific information.
*/
function determineReader(data: string) {
    for (let index = 0; index < ALL_READERS.length; index += 1) {
        const reader = ALL_READERS[index];
        if (reader.isOfThisVersion(data)) {
            return reader;
        }
    }

    throw new WrongFileFormat("Data apparently not of any recognised IOF XML format");
}
