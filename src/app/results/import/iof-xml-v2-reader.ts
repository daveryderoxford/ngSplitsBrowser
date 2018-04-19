
import * as $ from "jquery";
import d3 = require("d3");

import { isUndefined } from "util";
import { InvalidData, TimeUtilities, WrongFileFormat } from "../model";
import { CourseDeatils, IOFXMLReader } from "./iof-xml-v3-reader";


// Object that contains various functions for parsing bits of data from
// IOF v2.0.3 XML event data.
export class Version2Reader implements IOFXMLReader {

    private StatusNonCompetitive = "NotCompeting";
    private StatusNonStarter = "DidNotStart";
    private StatusNonFinisher = "DidNotFinish";
    private StatusDisqualified = "Disqualified";
    private StatusOverMaxTime = "OverTime";

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
    isOfThisVersion(data: string): boolean {
        return data.indexOf("IOFdata.dtd") >= 0;
    }

    /**
    * Makes a more thorough check that the parsed XML data is likely to be of
    * the v2.0.3 format.  If not, a WrongFileFormat exception is thrown.
    * @sb-param {jQuery.selection} rootElement - The root element.
    */
    checkVersion(rootElement) {
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
    }

    /**
    * Reads the class name from a ClassResult element.
    * @sb-param {jQuery.selection} classResultElement - ClassResult element
    *     containing the course details.
    * @sb-return {String} Class name.
    */
    readClassName(classResultElement): string {
        return $("> ClassShortName", classResultElement).text();
    }

    /**
    * Reads the course details from the given ClassResult element.
    * @sb-param {jQuery.selection} classResultElement - ClassResult element
    *     containing the course details.
    * @sb-param {Array} warnings - Array that accumulates warning messages.
    * @sb-return {Object} Course details: id, name, length, climb and numberOfControls
    */
    readCourseFromClass(classResultElement, warnings: Array<string>): CourseDeatils {
        // Although the IOF v2 format appears to support courses, they
        // haven't been specified in any of the files I've seen.
        // So instead grab course details from the class and the first
        // competitor.
        const FEET_PER_KILOMETRE = 3280;

        const courseName = $("> ClassShortName", classResultElement).text();

        const firstResult = $("> PersonResult > Result", classResultElement).first();
        let length = null;

        if (firstResult.length > 0) {
            const lengthElement = $("> CourseLength", firstResult);
            const lengthStr = lengthElement.text();

            // Course lengths in IOF v2 are a pain, as you have to handle three units.
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
    }

    /**
    * Returns the XML element that contains a competitor's name.  This element
    * should contain child elements with names 'Given' and 'Family'.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {jQuery.selection} jQuery selection containing any child
    *     'PersonName' element.
    */
    getCompetitorNameElement(element) {
        return $("> Person > PersonName", element);
    }

    /**
    * Returns the name of the competitor's club.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {String} Competitor's club name.
    */
    readClubName(element) {
        return $("> Club > ShortName", element).text();
    };

    /**
    * Returns the competitor's date of birth, as a string.
    * @sb-param {jQuery.selection} element - jQuery selection containing a
    *     PersonResult element.
    * @sb-return {String} The competitors date of birth, as a string.
    */
    readDateOfBirth(element) {
        return Number.parseInt($("> Person > BirthDate > Date", element).text());
    }

    /**
    * Reads a competitor's start time from the given Result element.
    * @sb-param {jQuery.selection} resultElement - jQuery selection containing a
    *     Result element.
    * @sb-return {?Number} Competitor's start time in seconds since midnight, or
    *     null if not found.
    */
    readStartTime(resultElement) {
        const startTimeStr = $("> StartTime > Clock", resultElement).text();
        const startTime = (startTimeStr === "") ? null : TimeUtilities.parseTime(startTimeStr);
        return startTime;
    };

    /**
    * Reads a competitor's total time from the given Result element.
    * @sb-param {jQuery.selection} resultElement - jQuery selection containing a
    *     Result element.
    * @sb-return {?Number} - The competitor's total time in seconds, or
    *     null if a valid time was not found.
    */
    readTotalTime(resultElement) {
        const totalTimeStr = $("> Time", resultElement).text();
        const totalTime = (totalTimeStr === "") ? null : TimeUtilities.parseTime(totalTimeStr);
        return totalTime;
    };

    /**
    * Read a competitor's route or null if not avalaible
    * @sb-param {jQuery.selection} element - jQuery selection containing a Result element.
    * @sb-return {string | null} Base64-encoded binary route data
    */
    /* TODO needs looking at we just ruteun null correntky */
    readRoute(resultElement): string | null {
        return null;
    }

    /**
    * Returns the status of the competitor with the given result.
    * @sb-param {jQuery.selection} resultElement - jQuery selection containing a
    *     Result element.
    * @sb-return {String} Status of the competitor.
    */
    getStatus(resultElement) {
        const statusElement = $("> CompetitorStatus", resultElement);
        return (statusElement.length === 1) ? statusElement.attr("value") : "";
    }

    /**
    * Unconditionally returns false - IOF XML version 2.0.3 appears not to
    * support additional controls.
    * @sb-return {boolean} false.
    */
    isAdditional() {
        return false;
    }

    /**
    * Reads a control code and split time from a SplitTime element.
    * @sb-param {jQuery.selection} splitTimeElement - jQuery selection containing
    *     a SplitTime element.
    * @sb-return {Object} Object containing code and time.
    */
    readSplitTime(splitTimeElement) {
        // IOF v2 allows ControlCode or Control elements.
        let code = $("> ControlCode", splitTimeElement).text();
        if (code === "") {
            code = $("> Control > ControlCode", splitTimeElement).text();
        }

        if (code === "") {
            throw new InvalidData("Control code missing for control");
        }

        const timeStr = $("> Time", splitTimeElement).text();
        const time = (timeStr === "") ? null : TimeUtilities.parseTime(timeStr);
        return { code: code, time: time };
    }

    /**
    * Read a competitor's ecard number
    * @sb-param {jQuery.selection} element - jQuery selection containing a Result element.
    * @sb-return {string} ECard
    */
   readECard(resultElement): string {
       const card = $("> CCard > CCardId", resultElement).text();
       return card;
   }
}
