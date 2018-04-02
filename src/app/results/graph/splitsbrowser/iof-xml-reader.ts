

import * as $ from "jquery";

import { InvalidData, WrongFileFormat, isNaNStrict } from "./util";
import { TimeUtilities } from "./time";
import { Competitor } from "./competitor";
import d3 = require("d3");
import { CourseClass } from "./course-class";
import { Course } from "./course";
import { Results } from "./results";

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

    const classes = [];

    // Array of all 'temporary' courses, intermediate objects that contain
    // course data but not yet in a suitable form to return.
    const tempCourses = [];

    // d3 map that maps course IDs plus comma-separated lists of controls
    // to the temporary course with that ID and controls.
    // (We expect that all classes with the same course ID have consistent
    // controls, but we don't assume that.)
    const coursesMap = <any>d3.map();

    const warnings = [];

    classResultElements.forEach( (classResultElement) => {
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
    const courses = tempCourses.map( (tempCourse) => {
        const course = new Course(tempCourse.name, tempCourse.classes, tempCourse.length, tempCourse.climb, tempCourse.controls);
        tempCourse.classes.forEach( (courseClass) => { courseClass.setCourse(course); });
        return course;
    });

    return new Results(classes, courses, warnings);
}


/**
* Parses the given XML string and returns the parsed XML.
* @sb-param {String} xmlString - The XML string to parse.
* @sb-return {XMLDocument} The parsed XML document.
*/
function parseXml(xmlString: string) {
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

const parseTime = TimeUtilities.parseTime;

// Number of feet in a kilometre.
const FEET_PER_KILOMETRE = 3280;


/**
* Returns whether the given value is undefined.
* @sb-param {any} value - The value to check.
* @sb-return {boolean} True if the value is undefined, false otherwise.
*/
function isUndefined(value: any): boolean {
    return typeof value === "undefined";
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
* @sb-return {String} Name read from the element.
*/
function readCompetitorName(nameElement) {

    const forename = $("> Given", nameElement).text();
    const surname = $("> Family", nameElement).text();

    if (forename === "") {
        return surname;
    } else if (surname === "") {
        return forename;
    } else {
        return forename + " " + surname;
    }
}

// Regexp that matches the year in an ISO-8601 date.
// Both XML formats use ISO-8601 (YYYY-MM-DD) dates, so parsing is
// fortunately straightforward.
const yearRegexp = /^\d{4}/;

// Object that contains various functions for parsing bits of data from
// IOF v2.0.3 XML event data.
const Version2Reader = {} as any;

/**
* Returns whether the given event data is likely to be results data of the
* version 2.0.3 format.
*
* This function is called before the XML is parsed and so can provide a
* quick way to discount files that are not of the v2.0.3 format.  Further
* functions of this reader are only called if this method returns true.
*
* @sb-param {String} data - The event data.
* @sb-return {boolean} True if the data is likely to be v2.0.3-format data,
*     false if not.
*/
Version2Reader.isOfThisVersion = function (data) {
    return data.indexOf("IOFdata.dtd") >= 0;
};

/**
* Makes a more thorough check that the parsed XML data is likely to be of
* the v2.0.3 format.  If not, a WrongFileFormat exception is thrown.
* @sb-param {jQuery.selection} rootElement - The root element.
*/
Version2Reader.checkVersion = function (rootElement) {
    const iofVersionElement = $("> IOFVersion", rootElement);
    if (iofVersionElement.length === 0) {
        throw new WrongFileFormat("Could not find IOFVersion element");
    } else {
        const version = iofVersionElement.attr("version");
        if (isUndefined(version)) {
            throw new WrongFileFormat("Version attribute missing from IOFVersion element");
        } else if (version !== "2.0.3") {
            throw new WrongFileFormat("Found unrecognised IOF XML data format '" + version + "'");
        }
    }

    const status = rootElement.attr("status");
    if (!isUndefined(status) && status.toLowerCase() !== "complete") {
        throw new InvalidData("Only complete IOF data supported; snapshot and delta are not supported");
    }
};

/**
* Reads the class name from a ClassResult element.
* @sb-param {jQuery.selection} classResultElement - ClassResult element
*     containing the course details.
* @sb-return {String} Class name.
*/
Version2Reader.readClassName = function (classResultElement): string {
    return $("> ClassShortName", classResultElement).text();
};

/**
* Reads the course details from the given ClassResult element.
* @sb-param {jQuery.selection} classResultElement - ClassResult element
*     containing the course details.
* @sb-param {Array} warnings - Array that accumulates warning messages.
* @sb-return {Object} Course details: id, name, length, climb and numberOfControls
*/
Version2Reader.readCourseFromClass = function (classResultElement, warnings) {
    // Although the IOF v2 format appears to support courses, they
    // haven't been specified in any of the files I've seen.
    // So instead grab course details from the class and the first
    // competitor.
    const courseName = $("> ClassShortName", classResultElement).text();

    const firstResult = $("> PersonResult > Result", classResultElement).first();
    let length = null;

    if (firstResult.length > 0) {
        const lengthElement = $("> CourseLength", firstResult);
        const lengthStr = lengthElement.text();

        // Course lengths in IOF v2 are a pain, as you have to handle three
        // units.
        if (lengthStr.length > 0) {
            length = parseFloat(lengthStr);
            if (isFinite(length)) {
                const unit = lengthElement.attr("unit");
                if (isUndefined(unit) || unit === "m") {
                    length /= 1000;
                } else if (unit === "km") {
                    // Length already in kilometres, do nothing further.
                } else if (unit === "ft") {
                    length /= FEET_PER_KILOMETRE;
                } else {
                    warnings.push("Course '" + courseName + "' gives its length in a unit '" + unit +
                        "', but this unit was not recognised");
                    length = null;
                }
            } else {
                warnings.push("Course '" + courseName + "' specifies a course length that was not understood: '" +
                    lengthStr + "'");
                length = null;
            }
        }
    }

    // Climb does not appear in the per-competitor results, and there is
    // no NumberOfControls.
    return { id: null, name: courseName, length: length, climb: null, numberOfControls: null };
};

/**
* Returns the XML element that contains a competitor's name.  This element
* should contain child elements with names 'Given' and 'Family'.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {jQuery.selection} jQuery selection containing any child
*     'PersonName' element.
*/
Version2Reader.getCompetitorNameElement = function (element) {
    return $("> Person > PersonName", element);
};

/**
* Returns the name of the competitor's club.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {String} Competitor's club name.
*/
Version2Reader.readClubName = function (element) {
    return $("> Club > ShortName", element).text();
};

/**
* Returns the competitor's date of birth, as a string.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {String} The competitors date of birth, as a string.
*/
Version2Reader.readDateOfBirth = function (element) {
    return $("> Person > BirthDate > Date", element).text();
};

/**
* Reads a competitor's start time from the given Result element.
* @sb-param {jQuery.selection} resultElement - jQuery selection containing a
*     Result element.
* @sb-return {?Number} Competitor's start time in seconds since midnight, or
*     null if not found.
*/
Version2Reader.readStartTime = function (resultElement) {
    const startTimeStr = $("> StartTime > Clock", resultElement).text();
    const startTime = (startTimeStr === "") ? null : parseTime(startTimeStr);
    return startTime;
};

/**
* Reads a competitor's total time from the given Result element.
* @sb-param {jQuery.selection} resultElement - jQuery selection containing a
*     Result element.
* @sb-return {?Number} - The competitor's total time in seconds, or
*     null if a valid time was not found.
*/
Version2Reader.readTotalTime = function (resultElement) {
    const totalTimeStr = $("> Time", resultElement).text();
    const totalTime = (totalTimeStr === "") ? null : parseTime(totalTimeStr);
    return totalTime;
};

/**
* Returns the status of the competitor with the given result.
* @sb-param {jQuery.selection} resultElement - jQuery selection containing a
*     Result element.
* @sb-return {String} Status of the competitor.
*/
Version2Reader.getStatus = function (resultElement) {
    const statusElement = $("> CompetitorStatus", resultElement);
    return (statusElement.length === 1) ? statusElement.attr("value") : "";
};

Version2Reader.StatusNonCompetitive = "NotCompeting";
Version2Reader.StatusNonStarter = "DidNotStart";
Version2Reader.StatusNonFinisher = "DidNotFinish";
Version2Reader.StatusDisqualified = "Disqualified";
Version2Reader.StatusOverMaxTime = "OverTime";

/**
* Unconditionally returns false - IOF XML version 2.0.3 appears not to
* support additional controls.
* @sb-return {boolean} false.
*/
Version2Reader.isAdditional = function () {
    return false;
};

/**
* Reads a control code and split time from a SplitTime element.
* @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
*     a SplitTime element.
* @sb-return {Object} Object containing code and time.
*/
Version2Reader.readSplitTime = function (splitTimeElement) {
    // IOF v2 allows ControlCode or Control elements.
    let code = $("> ControlCode", splitTimeElement).text();
    if (code === "") {
        code = $("> Control > ControlCode", splitTimeElement).text();
    }

    if (code === "") {
        throw new InvalidData("Control code missing for control");
    }

    const timeStr = $("> Time", splitTimeElement).text();
    const time = (timeStr === "") ? null : parseTime(timeStr);
    return { code: code, time: time };
};

// Regexp to match ISO-8601 dates.
// Ignores timezone info - always display times as local time.
// We don't assume there are separator characters, and we also don't assume
// that the seconds will be specified.
const ISO_8601_RE = /^\d\d\d\d-?\d\d-?\d\dT?(\d\d):?(\d\d)(?::?(\d\d))?/;

// Object that contains various functions for parsing bits of data from
// IOF v3.0 XML event data.
const Version3Reader = {} as any;

/**
* Returns whether the given event data is likely to be results data of the
* version 3.0 format.
*
* This function is called before the XML is parsed and so can provide a
* quick way to discount files that are not of the v3.0 format.  Further
* functions of this reader are only called if this method returns true.
*
* @sb-param {String} data - The event data.
* @sb-return {boolean} True if the data is likely to be v3.0-format data,
*     false if not.
*/
Version3Reader.isOfThisVersion = function (data) {
    return data.indexOf("http://www.orienteering.org/datastandard/3.0") >= 0;
};

/**
* Makes a more thorough check that the parsed XML data is likely to be of
* the v2.0.3 format.  If not, a WrongFileFormat exception is thrown.
* @sb-param {jQuery.selection} rootElement - The root element.
*/
Version3Reader.checkVersion = function (rootElement) {
    const iofVersion = rootElement.attr("iofVersion");
    if (isUndefined(iofVersion)) {
        throw new WrongFileFormat("Could not find IOF version number");
    } else if (iofVersion !== "3.0") {
        throw new WrongFileFormat("Found unrecognised IOF XML data format '" + iofVersion + "'");
    }

    const status = rootElement.attr("status");
    if (!isUndefined(status) && status.toLowerCase() !== "complete") {
        throw new InvalidData("Only complete IOF data supported; snapshot and delta are not supported");
    }
};

/**
* Reads the class name from a ClassResult element.
* @sb-param {jQuery.selection} classResultElement - ClassResult element
*     containing the course details.
* @sb-return {String} Class name.
*/
Version3Reader.readClassName = function (classResultElement) {
    return $("> Class > Name", classResultElement).text();
};

/**
* Reads the course details from the given ClassResult element.
* @sb-param {jQuery.selection} classResultElement - ClassResult element
*     containing the course details.
* @sb-param {Array} warnings - Array that accumulates warning messages.
* @sb-return {Object} Course details: id, name, length, climb and number of
*     controls.
*/
Version3Reader.readCourseFromClass = function (classResultElement, warnings) {
    const courseElement = $("> Course", classResultElement);
    const id = $("> Id", courseElement).text() || null;
    const name = $("> Name", courseElement).text();
    const lengthStr = $("> Length", courseElement).text();
    let length;
    if (lengthStr === "") {
        length = null;
    } else {
        length = parseInt(lengthStr, 10);
        if (isNaNStrict(length)) {
            warnings.push("Course '" + name + "' specifies a course length that was not understood: '" + lengthStr + "'");
            length = null;
        } else {
            // Convert from metres to kilometres.
            length /= 1000;
        }
    }

    const numberOfControlsStr = $("> NumberOfControls", courseElement).text();
    let numberOfControls = parseInt(numberOfControlsStr, 10);
    if (isNaNStrict(numberOfControls)) {
        numberOfControls = null;
    }

    const climbStr = $("> Climb", courseElement).text();
    let climb = parseInt(climbStr, 10);
    if (isNaNStrict(climb)) {
        climb = null;
    }

    return { id: id, name: name, length: length, climb: climb, numberOfControls: numberOfControls };
};

/**
* Returns the XML element that contains a competitor's name.  This element
* should contain child elements with names 'Given' and 'Family'.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {jQuery.selection} jQuery selection containing any child 'Name'
*     element.
*/
Version3Reader.getCompetitorNameElement = function (element) {
    return $("> Person > Name", element);
};

/**
* Returns the name of the competitor's club.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {String} Competitor's club name.
*/
Version3Reader.readClubName = function (element) {
    return $("> Organisation > ShortName", element).text();
};

/**
* Returns the competitor's date of birth, as a string.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     PersonResult element.
* @sb-return {String} The competitor's date of birth, as a string.
*/
Version3Reader.readDateOfBirth = function (element) {
    const birthDate = $("> Person > BirthDate", element).text();
    const regexResult = yearRegexp.exec(birthDate);
    return (regexResult === null) ? null : parseInt(regexResult[0], 10);
};

/**
* Reads a competitor's start time from the given Result element.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     Result element.
* @sb-return {?Number} Competitor's start time, in seconds since midnight,
*     or null if not known.
*/
Version3Reader.readStartTime = function (resultElement) {
    const startTimeStr = $("> StartTime", resultElement).text();
    const result = ISO_8601_RE.exec(startTimeStr);
    if (result === null) {
        return null;
    } else {
        const hours = parseInt(result[1], 10);
        const minutes = parseInt(result[2], 10);
        const seconds = (isUndefined(result[3])) ? 0 : parseInt(result[3], 10);
        return hours * 60 * 60 + minutes * 60 + seconds;
    }
};

/**
* Reads a time, in seconds, from a string.  If the time was not valid,
* null is returned.
* @sb-param {String} timeStr - The time string to read.
* @sb-return {?Number} The parsed time, in seconds, or null if it could not
*     be read.
*/
Version3Reader.readTime = function (timeStr) {
    // IOF v3 allows fractional seconds, so we use parseFloat instead
    // of parseInt.
    const time = parseFloat(timeStr);
    return (isFinite(time)) ? time : null;
};

/**
* Read a competitor's total time from the given Time element.
* @sb-param {jQuery.selection} element - jQuery selection containing a
*     Result element.
* @sb-return {?Number} Competitor's total time, in seconds, or null if a time
*     was not found or was invalid.
*/
Version3Reader.readTotalTime = function (resultElement) {
    const totalTimeStr = $("> Time", resultElement).text();
    return Version3Reader.readTime(totalTimeStr);
};

/**
* Returns the status of the competitor with the given result.
* @sb-param {jQuery.selection} resultElement - jQuery selection containing a
*     Result element.
* @sb-return {String} Status of the competitor.
*/
Version3Reader.getStatus = function (resultElement) {
    return $("> Status", resultElement).text();
};

Version3Reader.StatusNonCompetitive = "NotCompeting";
Version3Reader.StatusNonStarter = "DidNotStart";
Version3Reader.StatusNonFinisher = "DidNotFinish";
Version3Reader.StatusDisqualified = "Disqualified";
Version3Reader.StatusOverMaxTime = "OverTime";

/**
* Returns whether the given split-time element is for an additional
* control, and hence should be ignored.
* @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
*     a SplitTime element.
* @sb-return {boolean} True if the control is additional, false if not.
*/
Version3Reader.isAdditional = function (splitTimeElement) {
    return (splitTimeElement.attr("status") === "Additional");
};

/**
* Reads a control code and split time from a SplitTime element.
* @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
*     a SplitTime element.
* @sb-return {Object} Object containing code and time.
*/
Version3Reader.readSplitTime = function (splitTimeElement) {
    const code = $("> ControlCode", splitTimeElement).text();
    if (code === "") {
        throw new InvalidData("Control code missing for control");
    }

    let time;
    if (splitTimeElement.attr("status") === "Missing") {
        // Missed controls have their time omitted.
        time = null;
    } else {
        const timeStr = $("> Time", splitTimeElement).text();
        time = (timeStr === "") ? null : Version3Reader.readTime(timeStr);
    }

    return { code: code, time: time };
};

const ALL_READERS = [Version2Reader, Version3Reader];

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
function parseCompetitor(element, number, reader, warnings) {
    const jqElement = $(element);

    const nameElement = reader.getCompetitorNameElement(jqElement);
    const name = readCompetitorName(nameElement);

    if (name === "") {
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

    const splitTimes = $("> SplitTime", resultElement).toArray();
    const splitData = splitTimes.filter( (splitTime) => { return !reader.isAdditional($(splitTime)); })
        .map( (splitTime) => { return reader.readSplitTime($(splitTime)); });

    const controls = splitData.map( (datum) => { return datum.code; });
    const cumTimes = splitData.map( (datum) => { return datum.time; });

    cumTimes.unshift(0); // Prepend a zero time for the start.
    cumTimes.push(totalTime);

    const competitor = Competitor.fromOriginalCumTimes(number, name, club, startTime, cumTimes);

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
                warning = "Competitor '" + competitor.name + "' in class '" + className + "' has an unexpected number of controls: expected " + cls.course.numberOfControls + ", actual " + actualControlCount;
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
function determineReader(data) {
    for (let index = 0; index < ALL_READERS.length; index += 1) {
        const reader = ALL_READERS[index];
        if (reader.isOfThisVersion(data)) {
            return reader;
        }
    }

    throw new WrongFileFormat("Data apparently not of any recognised IOF XML format");
}

