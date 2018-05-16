
import * as d3 from "d3";

import { normaliseLineEndings } from "./util";
import { TimeUtilities, sbTime, Competitor, CourseClass, Course, Results, WrongFileFormat, InvalidData } from "../model";

import { isTrue, isNotNull } from "app/results/model/util";

const parseTime = TimeUtilities.parseTime;

/**
* Parse a row of competitor data.
* @sb-param {Number} index - Index of the competitor line.
* @sb-param {string} line - The line of competitor data read from a CSV file.
* @sb-param {Number} controlCount - The number of controls (not including the finish).
* @sb-param {string} className - The name of the class.
* @sb-param {Array} warnings - Array of warnings to add any warnings found to.
* @sb-return {Object} Competitor object representing the competitor data read in.
*/
function parseCompetitors(index: number,
    line: string,
    controlCount: number,
    className: string,
    warnings: Array<string>): Competitor {

    // Expect forename, surname, club, start time then (controlCount + 1) split times in the form MM:SS.
    const parts = line.split(",");

    while (parts.length > controlCount + 5 && parts[3].match(/[^0-9.,:-]/)) {
        // As this line is too long and the 'start time' cell has something
        // that appears not to be a start time, assume that the club name
        // has a comma in it.
        parts[2] += "," + parts[3];
        parts.splice(3, 1);
    }

    const originalPartCount = parts.length;
    const forename = parts.shift() || "";
    const surname = parts.shift() || "";
    const name = (forename + " " + surname).trim() || "<name unknown>";
    if (originalPartCount === controlCount + 5) {
        const club = parts.shift();
        const startTimeStr = parts.shift();
        let startTime = parseTime(startTimeStr);
        if (startTime === 0) {
            startTime = null;
        } else if (!startTimeStr.match(/^\d+:\d\d:\d\d$/)) {
            // Start time given in hours and minutes instead of hours,
            // minutes and seconds.
            startTime *= 60;
        }

        const cumTimes = [0];
        let lastCumTimeRecorded = 0;
        parts.map( (part) => {
            const splitTime = parseTime(part);
            if (splitTime !== null && splitTime > 0) {
                lastCumTimeRecorded += splitTime;
                cumTimes.push(lastCumTimeRecorded);
            } else {
                cumTimes.push(null);
            }
        });

        const competitor = Competitor.fromCumTimes(index + 1, name, club, startTime, cumTimes);
        if (lastCumTimeRecorded === 0) {
            competitor.setNonStarter();
        }
        return competitor;
    } else {
        const difference = originalPartCount - (controlCount + 5);
        const error = (difference < 0) ? (-difference) + " too few" : difference + " too many";
        warnings.push("Competitor '" + name + "' appears to have the wrong number of split times - " + error +
            " (row " + (index + 1) + " of class '" + className + "')");
        return null;
    }
}

/**
* Parse CSV data for a class.
* @sb-param {string} courseClass - The string containing data for that class.
* @sb-param {Array} warnings - Array of warnings to add any warnings found to.
* @sb-return {CourseClass} Parsed class data.
*/
function parseCourseClass(courseClass: string, warnings: Array<string>): CourseClass {
    const lines = courseClass.split(/\r?\n/).filter(isTrue);
    if (lines.length === 0) {
        throw new InvalidData("parseCourseClass got an empty list of lines");
    }

    const firstLineParts = lines.shift().split(",");
    if (firstLineParts.length === 2) {
        const className = firstLineParts.shift();
        const controlCountStr = firstLineParts.shift();
        const controlCount = parseInt(controlCountStr, 10);
        if (isNaN(controlCount)) {
            throw new InvalidData("Could not read control count: '" + controlCountStr + "'");
        } else if (controlCount < 0 && lines.length > 0) {
            // Only complain about a negative control count if there are
            // any competitors.  Event 7632 ends with a line 'NOCLAS,-1' -
            // we may as well ignore this.
            throw new InvalidData("Expected a non-negative control count, got " + controlCount + " instead");
        } else {
            const competitors = lines.map( (line, index) => {
                return parseCompetitors(index, line, controlCount, className, warnings);
            }).filter(isNotNull);

            competitors.sort(Competitor.compareCompetitors);
            return new CourseClass(className, controlCount, competitors);
        }
    } else {
        const err = "Expected first line to have two parts (class name and number of controls), got " +
            firstLineParts.length + " part(s) instead";
        throw new WrongFileFormat(err);
    }
}

/**
* Parse CSV data for an entire event.
* @sb-param {string} eventData - String containing the entire event data.
* @sb-return {Results} All event data read in.
*/
export function parseCSVEventData(data: string): Results {

    if (/<html/i.test(data)) {
        throw new WrongFileFormat("Cannot parse this file as CSV as it appears to be HTML");
    }

    data = normaliseLineEndings(data);

    // Remove trailing commas.
    data = data.replace(/,+\n/g, "\n").replace(/,+$/, "");

    const classSections = data.split(/\n\n/).map( (s) => { return s.trim(); }).filter(isTrue);
    const warnings = [] as Array<string>;

    let classes = classSections.map( (section) => { return parseCourseClass(section, warnings); });

    classes = classes.filter( (courseClass) => { return !courseClass.isEmpty(); });

    if (classes.length === 0) {
        throw new InvalidData("No competitor data was found");
    }

    // Nulls are for the course length, climb and controls, which aren't in
    // the source data files, so we can't do anything about them.
    const courses = classes.map( (cls) => { return new Course(cls.name, [cls], null, null, null); });

    for (let i = 0; i < classes.length; i += 1) {
        classes[i].setCourse(courses[i]);
    }

    return new Results(classes, courses, warnings);
}
