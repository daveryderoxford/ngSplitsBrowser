
import $ from 'jquery';
import { isUndefined } from "./util";
import { CourseClass, InvalidData, sbTime, WrongFileFormat } from "../model";
import { isNaNStrict } from "../model/results_util";

export interface CourseDeatils {
    id: string;
    name: string;
    length: number;
    climb: number;
    numberOfControls: number;
    classes? : CourseClass[];
    controls? : string[];
}

/** interface implemented by IOF XML reader classes */
export interface IOFXMLReader {
    isOfThisVersion(data: string): boolean;
    checkVersion(rootElement: JQuery<HTMLElement>): void;
    readClassName(classResultElement: JQuery<HTMLElement>): string;
    readCourseFromClass(classResultElement: JQuery<HTMLElement>, warnings: string[]): CourseDeatils;
    getCompetitorNameElement(element: JQuery<HTMLElement>): void;
    readClubName(element: JQuery<HTMLElement>): string;
    readDateOfBirth(element: JQuery<HTMLElement>): number | null;
    readStartTime(resultElement: JQuery<HTMLElement>): sbTime | null;
    readTotalTime(resultElement: JQuery<HTMLElement>): sbTime | null;
    readECard(resultElement: JQuery<HTMLElement>): string;
    readRoute(resultElement: JQuery<HTMLElement>): string | null;
    getStatus(resultElement: JQuery<HTMLElement>): string;
    isAdditional(splitTimeElement: JQuery<HTMLElement>): boolean;
    readSplitTime(splitTimeElement: JQuery<HTMLElement>): void;
}


// Object that contains various functions for parsing bits of data from
// IOF v3.0 XML event data.
export class Version3Reader implements IOFXMLReader {

    StatusNonCompetitive = "NotCompeting";
    StatusNonStarter = "DidNotStart";
    StatusNonFinisher = "DidNotFinish";
    StatusDisqualified = "Disqualified";
    StatusOverMaxTime = "OverTime";

    // Regexp that matches the year in an ISO-8601 date.
    // Both XML formats use ISO-8601 (YYYY-MM-DD) dates, so parsing is
    // fortunately straightforward.
    private yearRegexp = /^\d{4}/;

    // Regexp to match ISO-8601 dates.
    // Ignores timezone info - always display times as local time.
    // We don't assume there are separator characters, and we also don't assume
    // that the seconds will be specified.
    private ISO_8601_RE = /^\d\d\d\d-?\d\d-?\d\dT?(\d\d):?(\d\d)(?::?(\d\d))?/;

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
    isOfThisVersion(data: string): boolean {
        return data.indexOf("http://www.orienteering.org/datastandard/3.0") >= 0;
    }

    /**
    * Makes a more thorough check that the parsed XML data is likely to be of
    * the v2.0.3 format.  If not, a WrongFileFormat exception is thrown.
    * @sb-param {jQuery.selection} rootElement - The root element.
    */
    checkVersion(rootElement: JQuery<HTMLElement>): void {
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
    }

    /**
    * Reads the class name from a ClassResult element.
    * @sb-param {jQuery.selection} classResultElement - ClassResult element
    *     containing the course details.
    * @sb-return {String} Class name.
    */
    readClassName(classResultElement: JQuery<HTMLElement>) {
        return $("> Class > Name", classResultElement).text();
    }

    /**
    * Reads the course details from the given ClassResult element.
    * @sb-param {jQuery.selection} classResultElement - ClassResult element containing the course details.
    * @sb-param {Array} warnings - Array that accumulates warning messages.
    * @sb-return {Object} Course details: id, name, length, climb and number of
    *     controls.
    */
    readCourseFromClass(classResultElement: JQuery<HTMLElement>, warnings: string[]): CourseDeatils {
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
    }

    /**
    * Returns the XML element that contains a competitor's name.  This element
    * should contain child elements with names 'Given' and 'Family'.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {jQuery.selection} jQuery selection containing any child 'Name'
    *     element.
    */
    getCompetitorNameElement(element: JQuery<HTMLElement>) {
        return $("> Person > Name", element);
    }

    /**
    * Returns the name of the competitor's club.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {String} Competitor's club name.
    */
    readClubName(element: JQuery<HTMLElement>): string {
        return $("> Organisation > ShortName", element).text();
    }

    /**
    * Returns the competitor's date of birth, as a string.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {String} The competitor's date of birth
    */
    readDateOfBirth(element: JQuery<HTMLElement>): number | null {
        const birthDate = $("> Person > BirthDate", element).text();
        const regexResult = this.yearRegexp.exec(birthDate);
        return (regexResult === null) ? null : parseInt(regexResult[0], 10);
    }

    /**
    * Reads a competitor's start time from the given Result element.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     Result element.
    * @sb-return {?Number} Competitor's start time, in seconds since midnight,
    *     or null if not known.
    */
    readStartTime(resultElement: JQuery<HTMLElement>): sbTime | null {
        const startTimeStr = $("> StartTime", resultElement).text();
        const result = this.ISO_8601_RE.exec(startTimeStr);
        if (result === null) {
            return null;
        } else {
            const hours = parseInt(result[1], 10);
            const minutes = parseInt(result[2], 10);
            const seconds = (isUndefined(result[3])) ? 0 : parseInt(result[3], 10);
            return hours * 60 * 60 + minutes * 60 + seconds;
        }
    }

    /**
    * Reads a time, in seconds, from a string.  If the time was not valid,
    * null is returned.
    * @sb-param {String} timeStr - The time string to read.
    * @sb-return {?Number} The parsed time, in seconds, or null if it could not
    *     be read.
    */
    readTime(timeStr: string): number | null {
        // IOF v3 allows fractional seconds, so we use parseFloat instead of parseInt.
        const time = parseFloat(timeStr);
        return (isFinite(time)) ? time : null;
    }

    /**
    * Read a competitor's total time from the given Time element.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     Result element.
    * @sb-return {?Number} Competitor's total time, in seconds, or null if a time
    *     was not found or was invalid.
    */
    readTotalTime(resultElement: JQuery<HTMLElement>): sbTime | null {
        const totalTimeStr = $("> Time", resultElement).text();
        return this.readTime(totalTimeStr);
    }

    /**
    * Read a competitor's ecard number
    * @sb-param {jQuery.selection} element - jQuery selection containing a Result element.
    * @sb-return {string} ECard
    */
    readECard(resultElement: JQuery<HTMLElement>): string {
        return $("> ControlCard", resultElement).text();
    }

    /**
    * Read a competitor's route or null if not avalaible
    * @sb-param {jQuery.selection} element - jQuery selection containing a Result element.
    * @sb-return {string | null} Base64-encoded binary route data
    */
    readRoute(resultElement: JQuery<HTMLElement>): string | null {
        return $("> Route", resultElement).text();
    }

    /**
    * Returns the status of the competitor with the given result.
    * @sb-param {jQuery.selection} resultElement - jQuery selection containing a
    *     Result element.
    * @sb-return {String} Status of the competitor.
    */
    getStatus(resultElement: JQuery<HTMLElement>): string {
        return $("> Status", resultElement).text();
    }

    /**
    * Returns whether the given split-time element is for an additional
    * control, and hence should be ignored.
    * @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
    *     a SplitTime element.
    * @sb-return {boolean} True if the control is additional, false if not.
    */
    isAdditional(splitTimeElement: JQuery<HTMLElement>): boolean {
        return (splitTimeElement.attr("status") === "Additional");
    }

    /**
    * Reads a control code and split time from a SplitTime element.
    * @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
    *     a SplitTime element.
    * @sb-return {Object} Object containing code and time.
    */
    readSplitTime(splitTimeElement: JQuery<HTMLElement>) {
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
            time = (timeStr === "") ? null : this.readTime(timeStr);
        }

        return { code: code, time: time };
    }
}
