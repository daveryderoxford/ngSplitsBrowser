/*
 *  SplitsBrowser - Alternative CSV Reader tests.
 *
 *  Copyright (C) 2000-2017 Dave Ryder, Reinhard Balling, Andris Strazdins,
 *                          Ed Nash, Luke Woodward
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

// tslint:disable:max-line-length
import {} from "jasmine";
import {} from "jasmine-expect";

import { parseTripleColumnEventData } from "./alternative-cvs-reader";
import {TimeUtilities} from "../model";
import {TestSupport} from "app/results/test-support.spec";

const formatTime = TimeUtilities.formatTime;

const TRIPLE_COLUMN_HEADER = "RaceNumber,CardNumbers,MembershipNumbers,Name,AgeClass,Club,Country,CourseClass,StartTime,FinishTime,RaceTime,NonCompetitive,Position,Status,Handicap," +
                            "PenaltyScore,ManualScoreAdjust,FinalScore,HandicapTime,HandicapScore,AwardLevel,SiEntriesIDs,Eligibility,NotUsed3,NotUsed4,NotUsed5,NotUsed6,NotUsed7," +
                            "NotUsed8,NotUsed9,NotUsed10,NumSplits,ControlCode1,Split1,Points1,ControlCode2,Split2,Points2,ControlCode3,Split3,Points3,ControlCode4,Split4,Points4," +
                            "ControlCode5,Split5,Points5,ControlCode6,Split6,Points6";

/**
* Fabricates and returns a data row of the triple-column CSV file.
* @param {String} name - The competitor name.
* @param {String} club - The competitor's club.
* @param {String} courseName - The name of the course.
* @param {Array} controls - Array of string control codes.
* @param {String} startTime - The competitor's start time, or null if none.
* @param {Array} cumTimes - Array of cumulative times, either numbers or
*     null.
* @return {String} Fabricated data row.
*/
function fabricateTripleColumnRow(name: string,
                                 club: string,
                                 courseName: string,
                                 controls,
                                 startTime,
                                 cumTimes) {
    if (controls.length !== cumTimes.length) {
        throw new Error("Controls and cumulative times must have the same length");
    }

    const row = [];

    // Add some empty cells on the end for good measure.
    const rowWidth = 38 + 3 * controls.length + 8;
    for (let index = 0; index < rowWidth; index += 1) {
        row.push("");
    }

    row[3] = name;
    row[5] = club;
    row[7] = courseName;
    row[8] = (startTime === null) ? "" : formatTime(startTime);

    for (let controlIndex = 0; controlIndex < controls.length; controlIndex += 1) {
        row[38 + controlIndex * 3] = controls[controlIndex];
        if (cumTimes[controlIndex] !== null) {
            row[39 + controlIndex * 3] = formatTime(cumTimes[controlIndex]);
        }
    }

    return row.join(",") + "\r\n";
}

fdescribe("Input.AlternativeCSV.TripleColumn", () => {

    it("Cannot parse an empty string", () => {
        expect( () => parseTripleColumnEventData("")) .toThrowErrorOfType("WrongFileFormat", "Should throw an exception for parsing an empty string");
    });

    it("Cannot parse a string that contains only the headers", () => {
        TestSupport.assertException( "WrongFileFormat", () => {
            parseTripleColumnEventData(TRIPLE_COLUMN_HEADER);
        }, "Should throw an exception for parsing a string containing only the headers");
    });

    it("Cannot parse a string that contains only the headers and blank lines", () => {
        TestSupport.assertException( "WrongFileFormat", () => {
            parseTripleColumnEventData(TRIPLE_COLUMN_HEADER + "\r\n\r\n\r\n");
        }, "Should throw an exception for parsing a string containing only the headers and blank lines");
    });

    it("Cannot parse a string that contains only the headers and blank lines 2", () => {
        TestSupport.assertException( "WrongFileFormat", () => {
            parseTripleColumnEventData(TRIPLE_COLUMN_HEADER + "\r\n1,2,3,4,5");
        }, "Should throw an exception for parsing a string containing only the headers and a too-short line");
    });

    it("Cannot parse a string that contains a line with a non-alphanumeric control code", () => {
        TestSupport.assertException( "WrongFileFormat", () => {
            parseTripleColumnEventData(TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "IN:VA:LID", "188"], null, [null, null, null]));
        }, "Should throw an exception for parsing a string containing a non-alphanumeric control code");
    });

    it("Can parse a string that contains a single valid competitor", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(1);
        const courseClass = eventData.classes[0];
        expect(courseClass.name).toEqual("Course 1");
        expect(courseClass.numControls).toEqual(3);

        expect(courseClass.competitors.length).toEqual(1);
        const competitor = courseClass.competitors[0];
        expect(competitor.name).toEqual("John Smith");
        expect(competitor.club).toEqual("TEST");
        expect(competitor.startTime).toEqual(10 * 3600 + 38 * 60);
        expect(competitor.getAllOriginalCumulativeTimes()).toEqual( [0, 72, 141, 186, 202]);
        expect(competitor.completed()).toBe(true);
        expect(!competitor.isNonCompetitive).toBe(true);
        expect(!competitor.isNonStarter).toBe(true);
        expect(!competitor.isNonFinisher).toBe(true);
        expect(!competitor.isDisqualified).toBe(true);

        expect(eventData.courses.length).toEqual(1);
        const course = eventData.courses[0];
        expect(courseClass.course).toEqual(course);
        expect(course.name).toEqual("Course 1");
        expect(course.length).toEqual(null);
        expect(course.climb).toEqual(null);
        expect(course.controls).toEqual( ["152", "188", "163"]);
    });

    it("Can parse a string that contains a single valid competitor with LF line endings", () => {
        let data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        data = data.replace(/\r/g, "");
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.courses.length).toEqual(1);
    });

    it("Can parse a string that contains a single valid competitor with CR line endings", () => {
        let data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        data = data.replace(/\n/g, "");
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.courses.length).toEqual(1);
    });

    it("Can parse a string that contains a single valid competitor with data delimited by semicolons", () => {
        let data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        data = data.replace(/,/g, ";");
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.courses.length).toEqual(1);
    });

    it("Can parse a string that contains a single valid competitor with alphanumeric but not numeric control code", () => {
        let data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "ABC188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        data = data.replace(/,/g, ";");
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.courses.length).toEqual(1);
        const course = eventData.courses[0];
        expect(course.controls).toEqual( ["152", "ABC188", "163"]);
    });

    it("Can parse a string that contains a single valid competitor with two names", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith, Fred Baker", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);

        const courseClass = eventData.classes[0];
        expect(courseClass.competitors.length).toEqual(1);

        const competitor = courseClass.competitors[0];
        expect(competitor.name).toEqual("John Smith, Fred Baker");
    });

    it("Can parse a string that contains two valid competitors on the same course", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]) +
                                     fabricateTripleColumnRow("Fred Baker", "ABCD", "Course 1", ["152", "188", "163", "F1"], 11 * 3600 + 19 * 60, [84, 139, 199, 217]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(1);
        const courseClass = eventData.classes[0];

        expect(courseClass.competitors.length).toEqual(2);
        const competitor1 = courseClass.competitors[0];
        expect(competitor1.name).toEqual("John Smith");
        expect(competitor1.club).toEqual("TEST");
        expect(competitor1.startTime).toEqual(10 * 3600 + 38 * 60);
        expect(competitor1.getAllOriginalCumulativeTimes()).toEqual( [0, 72, 141, 186, 202]);

        const competitor2 = courseClass.competitors[1];
        expect(competitor2.name).toEqual("Fred Baker");
        expect(competitor2.club).toEqual("ABCD");
        expect(competitor2.startTime).toEqual(11 * 3600 + 19 * 60);
        expect(competitor2.getAllOriginalCumulativeTimes()).toEqual( [0, 84, 139, 199, 217]);

        expect(eventData.courses.length).toEqual(1);
    });

    it("Can parse a string that contains one valid competitor and issue warning for one competitor that contains no times and some other nonsense", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]);
        let secondLine = fabricateTripleColumnRow("Fred Baker", "ABCD", "Course 1", [], null, []);
        const secondLineParts = secondLine.split(",");
        secondLineParts[37] = "10";
        secondLine = secondLineParts.join(",");
        const eventData = parseTripleColumnEventData(data + secondLine);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.warnings.length).toEqual(1);
    });

    it("Can parse a string that contains two valid competitors on the same course but in different classes", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Class 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]) +
                                     fabricateTripleColumnRow("Fred Baker", "ABCD", "Class 2", ["152", "188", "163", "F1"], 11 * 3600 + 19 * 60, [84, 139, 199, 217]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(2);
        expect(eventData.courses.length).toEqual(1);

        expect(eventData.courses[0].classes).toEqual(eventData.classes);
    });

    it("Can parse a string that contains two valid competitors on different courses and in different classes", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Class 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]) +
                                     fabricateTripleColumnRow("Fred Baker", "ABCD", "Class 2", ["152", "174", "119", "F1"], 11 * 3600 + 19 * 60, [84, 139, 199, 217]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(2);
        expect(eventData.courses.length).toEqual(2);
    });

    it("Issues a warning for a string that contains two competitors on the same course with different numbers of controls", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, 202]) +
                                     fabricateTripleColumnRow("Fred Baker", "ABCD", "Course 1", ["152", "188", "163", "186", "F1"], 11 * 3600 + 19 * 60, [84, 139, 199, 257, 282]);
        const eventData = parseTripleColumnEventData(data);
        expect(eventData.classes.length).toEqual(1);
        expect(eventData.courses.length).toEqual(1);
        expect(eventData.classes[0].competitors.length).toEqual(1);
        expect(eventData.warnings.length).toEqual(1);
    });

    it("Can parse a string that contains a single competitor missing an intermediate control", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, null, 186, 202]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(1);
        const courseClass = eventData.classes[0];

        expect(courseClass.competitors.length).toEqual(1);
        const competitor = courseClass.competitors[0];
        expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 72, null, 186, 202]);
        expect(!competitor.completed()).toBe(true);
        expect(!competitor.isNonStarter).toBe(true);
        expect(!competitor.isNonFinisher).toBe(true);
        expect(!competitor.isDisqualified).toBe(true);
    });

    it("Can parse a string that contains a single competitor missing the finish control", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [72, 141, 186, null]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(1);
        const courseClass = eventData.classes[0];

        expect(courseClass.competitors.length).toEqual(1);
        const competitor = courseClass.competitors[0];
        expect(competitor.getAllOriginalCumulativeTimes()).toEqual( [0, 72, 141, 186, null]);
        expect(!competitor.completed()).toBe(true);
        expect(!competitor.isNonStarter).toBe(true);
        expect(!competitor.isNonFinisher).toBe(true);
        expect(!competitor.isDisqualified).toBe(true);
    });

    it("Can parse a string that contains a single competitor missing all controls and mark said competitor as a non-starter", () => {
        const data = TRIPLE_COLUMN_HEADER + "\r\n" + fabricateTripleColumnRow("John Smith", "TEST", "Course 1", ["152", "188", "163", "F1"], 10 * 3600 + 38 * 60, [null, null, null, null]);
        const eventData = parseTripleColumnEventData(data);

        expect(eventData.classes.length).toEqual(1);
        const courseClass = eventData.classes[0];

        expect(courseClass.competitors.length).toEqual(1);
        const competitor = courseClass.competitors[0];
        expect(competitor.getAllOriginalCumulativeTimes()).toEqual( [0, null, null, null, null]);
        expect(!competitor.completed()).toBe(true);
        expect(competitor.isNonStarter).toBe(true);
        expect(!competitor.isNonFinisher).toBe(true);
        expect(!competitor.isDisqualified).toBe(true);
    });
});
