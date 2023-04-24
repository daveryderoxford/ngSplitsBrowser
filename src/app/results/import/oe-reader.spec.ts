/*
 *  SplitsBrowser - OE CSV reader tests.
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
/* eslint-disable max-len */
import { } from "jasmine";
import { Course, CourseClass, Results, TimeUtilities } from "../model";
import { parseOEEventData } from "./oe-reader";

const parseTime = TimeUtilities.parseTime;
const parseEventData = parseOEEventData;

// Header line when control 1 is in column 46.
const HEADER_46 = "Stno;SI card;Database Id;Surname;First name;YB;S;Block;nc;Start;Finish;Time;Classifier;Club no.;Cl.name;City;Nat;Cl. no.;Short;Long;Num1;Num2;Num3;Text1;Text2;Text3;Adr. name;Street;Line2;Zip;City;Phone;Fax;Email;Id/Club;Rented;Start fee;Paid;Course no.;Course;Km;m;Course controls;Pl;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;Control4;Punch4;\r\n";

// Template for the row data that precedes the controls.
const ROW_TEMPLATE_46 = "0;ecard;2;surname;forename;yearOfBirth;gender;7;nonComp;startTime;10;time;classifier;13;14;club;16;17;className;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;37;38;course;distance;climb;numControls;placing;startPunch;finish";

// Header line when control 1 is in column 44.
// Compared to the variant above, this line has no 'S' column and has the
// 'First name' and 'Surname' columns merged into one.
const HEADER_44 = "Stno;SI card;Database Id;Name;YB;Block;nc;Start;Finish;Time;Classifier;Club no.;Cl.name;City;Nat;Cl. no.;Short;Long;Num1;Num2;Num3;Text1;Text2;Text3;Adr. name;Street;Line2;Zip;City;Phone;Fax;Email;Id/Club;Rented;Start fee;Paid;Course no.;Course;Km;m;Course controls;Pl;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;Control4;Punch4;\r\n";

// Template for the row data that precedes the controls.
const ROW_TEMPLATE_44 = "0;ecard;2;name;yearOfBirth;5;nonComp;startTime;8;time;classifier;11;12;club;14;15;className;17;18;19;20;21;22;23;24;25;26;27;28;29;30;31;32;33;34;35;36;course;distance;climb;numControls;placing;startPunch;finish";

// Header line when control 1 is in column 60.
// This has various new columns.  It also doesn't always have competitor
// names and total times.
const HEADER_60 = "OE0014;Stno;XStno;Chipno;Database Id;Surname;First name;YB;S;Block;nc;Start;Finish;Time;Classifier;Credit -;Penalty +;Comment;Club no.;Cl.name;City;Nat;Location;Region;Cl. no.;Short;Long;Entry cl. No;Entry class (short);Entry class (long);Rank;Ranking points;Num1;Num2;Num3;Text1;Text2;Text3;Addr. surname;Addr. first name;Street;Line2;Zip;Addr. city;Phone;Mobile;Fax;EMail;Rented;Start fee;Paid;Team;Course no.;Course;km;m;Course controls;Place;Start punch;Finish punch;Control1;Punch1;Control2;Punch2;Control3;Punch3;Control4;Punch4;\r\n";

// Template for the row data that precedes the controls of the 60-column variation.
const ROW_TEMPLATE_60 = "0;1;2;ecard;4;surname;forename;yearOfBirth;gender;9;nonComp;startTime;12;time;classifier;15;16;17;noOfClub;19;club;21;22;23;24;25;className;27;28;29;30;31;32;33;34;35;36;37;38;39;40;41;42;43;44;45;46;47;48;49;50;51;52;course;distance;climb;numControls;placing;startPunch;finish";

interface OEFormat {
    name: string;
    header: string;
    template: string;
    combineName: boolean;
    hasGender: boolean;
}

const ROW_FORMAT_46 =  { name: "46-column", header: HEADER_46, template: ROW_TEMPLATE_46, combineName: false, hasGender: true };
const ROW_FORMAT_44 = { name: "44-column", header: HEADER_44, template: ROW_TEMPLATE_44, combineName: true, hasGender: false };
const ROW_FORMAT_60 = { name: "60-column", header: HEADER_60, template: ROW_TEMPLATE_60, combineName: false, hasGender: true };

const ALL_FORMATS: OEFormat[] = [ ROW_FORMAT_46 , ROW_FORMAT_44, ROW_FORMAT_60];


/**
* Generates a row of data for an OE-format file.
* @param {Object} data - Object that maps key names to the data for those
*     keys.
* @param {Array} controls - Array of objects, each of which contains a code
*     and a time.
* @param {String} template - String template that describes how to generate
*     the row.
* @return {String} Row of data.
*/
function generateRow(data: OECompetitorData, controls: Control[], template: string): string {
    if (typeof template === "undefined") {
        throw new Error("No template given");
    }

    let row = template;
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            row = row.replace(key, data[key]);
        }
    }

    controls.forEach(function (control) {
        row += ";" + control.code + ";" + control.time;
    });

    return row + "\r\n";
}

interface OECompetitorData {
    forename: string;
    surname: string;
    compno: string;
    ecard: string;
    club: string;
    noOfClub: string;
    startPunch: string;
    startTime: string;
    time: string;
    finish: string;
    className: string;
    course: string;
    distance: string;
    climb: string;
    numControls: string;
    placing: string | number;
    nonComp: string;
    classifier: string;
    gender: string;
    yearOfBirth: string;
}

/**
* Returns data for a test competitor.
* @return {Object} Test competitor data.
*/
function getCompetitor1(): OECompetitorData {
    return {
        forename: "John",
        surname: "Smith",
        compno: "123456",
        ecard: "9876",
        club: "ABC",
        noOfClub: "2",
        startPunch: "11:27:45",
        startTime: "",
        time: "06:33",
        finish: "11:34:18",
        className: "Test class",
        course: "Test course",
        distance: "4.1",
        climb: "140",
        numControls: "3",
        placing: 1 as string | number,
        nonComp: "",
        classifier: "",
        gender: "M",
        yearOfBirth: "1984"
    };
}

/**
* Returns data for a second test competitor.
* @return {Object} Test competitor data.
*/
function getCompetitor2(): OECompetitorData {
    return {
        forename: "Fred",
        surname: "Baker",
        compno: "654321",
        ecard: "5432",
        club: "DEF",
        noOfClub: "6",
        startPunch: "10:30:00",
        startTime: "",
        time: "07:11",
        finish: "10:37:11",
        className: "Test class",
        course: "Test course",
        distance: "4.1",
        climb: "140",
        numControls: "3",
        placing: "2",
        nonComp: "",
        classifier: "",
        gender: "M",
        yearOfBirth: "1981"
    };
}

/**
* Returns data for a second test competitor, on a longer course.
* @return {Object} Test competitor data.
*/
function getCompetitor2OnLongerCourse() {
    const comp2 = getCompetitor2();
    comp2.numControls = "4";
    comp2.distance = "5.3";
    comp2.climb = "155";
    comp2.time = "10:19";
    return comp2;
}

/**
* Returns data for a third test competitor.
* @return {Object} Test competitor data.
*/
function getCompetitor3(): OECompetitorData {
    return {
        forename: "Bill",
        surname: "Jones",
        compno: "345678",
        ecard: "22222",
        club: "GHI",
        noOfClub: "8",
        startPunch: "11:00:00",
        startTime: "",
        time: "06:58",
        finish: "11:06:58",
        className: "Test class",
        course: "Test course",
        distance: "4.1",
        climb: "140",
        numControls: "3",
        placing: "3",
        nonComp: "",
        classifier: "",
        gender: "M",
        yearOfBirth: "1977"
    };
}

interface Control {
    code: string;
    time: string;
}

/**
* Returns an array of test controls for competitor 1.
* @return {Array} Test controls data.
*/
function getControls1(): Control[] {
    return [{ code: "208", time: "01:50" }, { code: "227", time: "03:38" }, { code: "212", time: "06:02" }];
}

/**
* Returns an array of test controls for competitor 1, with one blank time.
* @return {Array} Test controls data.
*/
function getControls1WithBlankTimeForLast(): Control[] {
    return [{ code: "208", time: "01:50" }, { code: "227", time: "03:38" }, { code: "212", time: "" }];
}

/**
* Returns an array of test controls for competitor 1, with a non-numeric control code.
* @return {Array} Test controls data.
*/
function getControls1WithNonNumericControlCode(): Control[] {
    return [{ code: "208", time: "01:50" }, { code: "ST2", time: "03:38" }, { code: "212", time: "06:02" }];
}

/**
* Returns an array of test controls for competitor 1, with all times
* missing.
* @return {Array} Test controls data.
*/
function getControls1AllMissed(): Control[] {
    return [{ code: "208", time: "-----" }, { code: "227", time: "-----" }, { code: "212", time: "-----" }];
}

/**
* Returns an array of test controls for competitor 1, with an extra control
* with blank code and missing time.
* @return {Array} Test controls data.
*/
function getControls1WithBlankCodeAndMissingTimeAtTheEnd(): Control[] {
    return [{ code: "208", time: "01:50" }, { code: "227", time: "03:38" }, { code: "212", time: "06:02" }, { code: "", time: "-----" }];
}

/**
* Returns an array of test controls for competitor 1, with an extra control
* with blank code and missing time, followed by an additional control.
* @return {Array} Test controls data.
*/
function getControls1WithBlankCodeAndMissingTimeAtTheEndFollowedByAdditionalControl(): Control[] {
    return [{ code: "208", time: "01:50" }, { code: "227", time: "03:38" }, { code: "212", time: "06:02" }, { code: "", time: "-----" }, { code: "223", time: "04:11" }];
}

/**
* Returns an array of test controls for competitor 2.
* @return {Array} Test controls data.
*/
function getControls2(): Control[] {
    return [{ code: "208", time: "02:01" }, { code: "227", time: "04:06" }, { code: "212", time: "06:37" }];
}

/**
* Returns a longer list of test controls for competitor 2.
* @return {Array} Test controls data.
*/
function getLongerControls2(): Control[] {
    return [{ code: "208", time: "02:01" }, { code: "222", time: "04:06" }, { code: "219", time: "06:37" }, { code: "213", time: "09:10" }];
}

/**
* Returns an array of test controls for competitor 3.
* @return {Array} Test controls data.
*/
function getControls3(): Control[] {
    return [{ code: "208", time: "01:48" }, { code: "227", time: "03:46" }, { code: "212", time: "05:59" }];
}

describe("Input.OE", () => {

    /**
    * Runs a test for parsing invalid data that should fail.
    * @param {String} invalidData - The invalid string to parse.
    * @param {String} what - Description of the invalid data.
    * @param {String} exceptionName - Optional name of the exception (defaults
    *     to InvalidData.
    */
    function runInvalidDataTest(invalidData: string, what: string, exceptionName: string) {
        try {
            parseEventData(invalidData);
            expect(false).toBe(true, "Should throw an exception for parsing " + what);
        } catch (e) {
            expect(e.name).toEqual(exceptionName || "InvalidData", "Exception should have been InvalidData; message is " + e.message);
        }
    }

    it("Cannot parse an empty string", () => {
        runInvalidDataTest("", "an empty string", "WrongFileFormat");
    });

    it("Cannot parse a string that contains only the headers", () => {
        runInvalidDataTest(HEADER_46, "data with a header row only", "WrongFileFormat");
    });

    it("Cannot parse a string that contains only the headers and blank lines", () => {
        runInvalidDataTest(HEADER_46 + "\r\n\r\n\r\n", "data with a header row and blank lines only", "WrongFileFormat");
    });

    it("Cannot parse a string that contains only the headers and a junk line that happens to contain a semicolon", () => {
        runInvalidDataTest(HEADER_46 + "\r\nrubbish;more rubbish\r\n", "data with a junk second line", "WrongFileFormat");
    });

    it("Cannot parse a string that is not semicolon-delimited data", () => {
        runInvalidDataTest("This is not a valid data format", "invalid data", "WrongFileFormat");
    });

    /**
    * Formats some competitor data into a string that can be read by the reader.
    * @param {Object} format - The format used to generate the data string.
    * @param {Array} competitors - Array of 2-element arrays containing
    *     competitor and control data.
    * @param {Function} preprocessor - Function called on the event data string
    *     immediately before it is passed to the parser.  If not specified,
    *     no preprocessing is done.
    */
    function generateData(format: OEFormat, competitors, preprocessor?) {
        let text = format.header;
        competitors.forEach(function (comp) {
            let row = generateRow(comp[0], comp[1], format.template);
            if (format.combineName) {
                row = row.replace("name", comp[0].forename + " " + comp[0].surname);
            }

            text += row + "\r\n";
        });

        if (preprocessor) {
            text = preprocessor(text);
        }

        return text;
    }

    interface TestFunc {
        (eventData: Results, format: OEFormat);
    }
    /**
    * Calls a test function for the result of formatting the given competitor
    * data using all formats.  The data is expected to be parsed successfully.
    * @param {Array} competitors - Array of 2-element arrays containing
    *     competitor and control data.
    * @param {Function} testFunc - Function called with the parsed event data
    *     and the format used to generate it.
    * @param {Function} preprocessor - Function called on the event data string
    *     immediately before it is passed to the parser.  If not specified,
    *     no preprocessing is done. Optional
    */
    function runTestOverAllFormats(competitors: any, testFunc: TestFunc, preprocessor?: any) {
        ALL_FORMATS.forEach(function (format: OEFormat) {
            const text = generateData(format, competitors, preprocessor);
            const eventData = parseEventData(text);
            testFunc(eventData, format);
        });
    }

    it("Can parse a string that contains a single competitor's data in all formats", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results, format: OEFormat) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");

            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "Class element should be a CourseClass object");
            expect(eventData.classes[0].numControls).toEqual(3, "Class should have three controls");
            expect(eventData.classes[0].name).toEqual("Test class", "Class should have correct name");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            expect(eventData.courses.length).toEqual(1, "There should be one course");
            const course = eventData.courses[0];
            expect(course.name).toEqual("Test course", "Course name should be correct");
            expect(course.length).toEqual(4.1, "Course length should be correct");
            expect(course.climb).toEqual(140, "Course climb should be correct");
            expect(course.classes).toEqual([eventData.classes[0]], "The one class in the course should be the one course");
            expect(course.controls).toEqual(["208", "227", "212"]);

            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.name).toEqual("John Smith", "Should read correct name");
            expect(competitor.ecardId).toEqual("9876", "Should read correct ecard");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(competitor.startTime).toEqual(11 * 3600 + 27 * 60 + 45, "Should read correct start time");
            expect(competitor.yearOfBirth).toEqual(1984, "Should read correct year of birth");
            if (format.hasGender) {
                expect(competitor.gender).toEqual("M", "Should read correct gender");
            }
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393], "Should read correct cumulative times");
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");

            expect(eventData.classes[0].course).toEqual(course, "Class should refer to its course");
        });
    });

    it("Can parse a string that contains a single competitor's data with timed start", () => {
        const competitor1 = getCompetitor1();
        competitor1.startTime = competitor1.startPunch;
        competitor1.startPunch = "";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            expect(eventData.classes[0].competitors[0].startTime).toEqual(11 * 3600 + 27 * 60 + 45, "Should read correct start time");
        });
    });

    it("Can parse a string that contains a single competitor's data with no start nor finish", () => {
        const competitor1 = getCompetitor1();
        competitor1.startTime = "";
        competitor1.startPunch = "";
        competitor1.finish = "";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            expect(eventData.classes[0].competitors[0].startTime).toEqual(null, "Should read correct start time");
        });
    });

    it("Can parse a string that contains a single competitor's data with the course distance having a comma as the decimal separator", () => {
        const competitor = getCompetitor1();
        competitor.distance = "4,1";
        runTestOverAllFormats([[competitor, getControls1()]], function (eventData) {
            expect(eventData.courses.length).toEqual(1, "There should be one course");
            const course = eventData.courses[0];
            expect(course.length).toEqual(4.1, "Course length should be correct");
        });
    });

    it("Can parse a string that contains a single competitor's data with the course having zero distance and climb", () => {
        const competitor = getCompetitor1();
        competitor.distance = "0.0";
        competitor.climb = "0";
        runTestOverAllFormats([[competitor, getControls1()]], function (eventData) {
            expect(eventData.courses.length).toEqual(1, "There should be one course");
            const course = eventData.courses[0];
            expect(course.length).toEqual(0, "Course length should be zero");
            expect(course.climb).toEqual(0, "Course climb should be zero");
        });
    });

    it("Can parse a string that contains a single competitor's data with the course distance in metres", () => {
        const competitor = getCompetitor1();
        competitor.distance = "4100";
        runTestOverAllFormats([[competitor, getControls1()]], function (eventData) {
            expect(eventData.courses.length).toEqual(1, "There should be one course");
            const course = eventData.courses[0];
            expect(course.length).toEqual(4.1, "Course length should be correct");
        });
    });

    it("Can parse a string that contains a single valid competitor's data with the placing empty", () => {
        const competitor = getCompetitor1();
        competitor.placing = "";
        runTestOverAllFormats([[competitor, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            expect(!eventData.classes[0].competitors[0].isNonCompetitive).toBe(true);
        });
    });

    it("Can parse a string that contains a single competitor's data with the last two controls missing", () => {
        const competitor1 = getCompetitor1();
        competitor1.placing = "";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.completed()).toBe(true);
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, null, null, 393]);
        }, function (eventDataStr) {
            for (let i = 0; i < 4; i += 1) {
                eventDataStr = eventDataStr.substring(0, eventDataStr.lastIndexOf(";"));
            }
            return eventDataStr;
        });
    });

    it("Can parse a string that contains a single competitor's data with a blank time for the last control", () => {
        const competitor1 = getCompetitor1();
        competitor1.placing = "";
        runTestOverAllFormats([[competitor1, getControls1WithBlankTimeForLast()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.completed()).toBe(true);
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, null, 393]);
        });
    });

    it("Can parse a string that contains a single competitor's data with control code with letters in it", () => {
        const competitor1 = getCompetitor1();
        competitor1.placing = "";
        runTestOverAllFormats([[competitor1, getControls1WithNonNumericControlCode()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393]);
        });
    });

    it("Can parse a string that contains a single competitor's data with blank code and missing time", () => {
        const competitor1 = getCompetitor1();
        competitor1.placing = "";
        runTestOverAllFormats([[competitor1, getControls1WithBlankCodeAndMissingTimeAtTheEnd()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393]);
        });
    });

    it("Can parse a string that contains a single competitor's data with blank code and missing time followed by an additional control", () => {
        const competitor1 = getCompetitor1();
        competitor1.placing = "";
        runTestOverAllFormats([[competitor1, getControls1WithBlankCodeAndMissingTimeAtTheEndFollowedByAdditionalControl()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393]);
        });
    });

    it("Can parse a string ignoring a blank year of birth", () => {
        const competitor1 = getCompetitor1();
        competitor1.yearOfBirth = "";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData: Results) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            expect(eventData.classes[0].competitors[0].yearOfBirth).toEqual(null, "No year of birth should have been read");
        });
    });

    it("Can parse a string ignoring an invalid year of birth", () => {
        const competitor1 = getCompetitor1();
        competitor1.yearOfBirth = "This is not a valid year";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData: Results) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            expect(eventData.classes[0].competitors[0].yearOfBirth).toEqual(null, "No year of birth should have been read");
        });
    });

    it("Can parse a string that contains a single female competitor's data", () => {
        const competitor1 = getCompetitor1();
        competitor1.forename = "Freda";
        competitor1.gender = "F";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData: Results, format: OEFormat) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            if (format.hasGender) {
                expect(eventData.classes[0].competitors[0].gender).toEqual("F", "Should read correct gender");
            }
        });
    });

    it("Can parse a string that contains a single competitor's data ignoring a blank gender", () => {
        const competitor1 = getCompetitor1();
        competitor1.gender = "";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData: Results, format: OEFormat) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            if (format.hasGender) {
                expect(eventData.classes[0].competitors[0].gender).toEqual(null, "No gender should have been read");
            }
        });
    });

    it("Can parse a string that contains a single competitor's data ignoring an invalid gender", () => {
        const competitor1 = getCompetitor1();
        competitor1.gender = "This is not a valid gender";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData: Results, format: OEFormat) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            if (format.hasGender) {
                expect(eventData.classes[0].competitors[0].gender).toEqual(null, "No gender should have been read");
            }
        });
    });

    it("Can parse a string that contains a single competitor's data with LF line-endings", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "There should be one competitor");
            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393]);
            expect(eventData.courses.length).toEqual(1, "There should be one course");
        }, function (eventDataStr) {
            return eventDataStr.replace(/\r\n/g, "\n");
        });
    });

    it("Can parse a string that contains a single competitor's data with CR line-endings", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results) {
            expect(eventData.courses.length).toEqual(1, "There should be one course");
        }, function (eventDataStr) {
            return eventDataStr.replace(/\r\n/g, "\r");
        });
    });

    it("Can parse a string that contains a single competitor's data in 'nameless' column-60 variation", () => {
        const OEComp1 = getCompetitor1();
        OEComp1.forename = "";
        OEComp1.surname = "";
        OEComp1.club = "";
        OEComp1.ecard = "";
        OEComp1.time = "";
        OEComp1.className = "";
        OEComp1.startTime = OEComp1.startPunch;
        OEComp1.startPunch = "";

        const text = generateData(ROW_FORMAT_60, [[[OEComp1], getControls1()]] );
        const eventData = parseEventData(text);

        expect(eventData.classes.length).toEqual(1, "There should be one class");
        expect(eventData.classes[0].name).toEqual("Test course", "Class should have same name as course");
        expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");

        expect(eventData.courses.length).toEqual(1, "There should be one course");
        expect(eventData.courses[0].name).toEqual("Test course", "Course name should be correct");

        const competitor = eventData.classes[0].competitors[0];
        expect(competitor.name).toEqual(OEComp1.compno, "Should read competitor name as ID");
        expect(competitor.club).toEqual(OEComp1.noOfClub, "Should read club name as ID");
        expect(competitor.startTime).toEqual(parseTime(OEComp1.startTime), "Should read correct start time");
        expect(competitor.totalTime).toEqual(393, "Should read correct total time");
    });

    it("Can parse a string that contains a single competitor's data with commas as column separators", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
        }, function (eventDataStr) {
            return eventDataStr.replace(/;/g, ",");
        });
    });

    it("Can parse a string that contains a single competitor's data with tabs as column separators", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
        }, function (eventDataStr) {
            return eventDataStr.replace(/;/g, "\t");
        });
    });

    it("Can parse a string that contains a single competitor's data with backslash characters as column separators", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
        }, function (eventDataStr) {
            return eventDataStr.replace(/;/g, "\\");
        });
    });

    it("Cannot parse a string that contains a single competitor's data with closing braces as column separators", () => {
        ALL_FORMATS.forEach(function (format) {
            let eventDataStr = format.header + generateRow(getCompetitor1(), getControls1(), format.template);
            eventDataStr = eventDataStr.replace(/;/g, "}");
            runInvalidDataTest(eventDataStr, "data with an unrecognised delimiter", "WrongFileFormat");
        });
    });

    it("Cannot parse a string that contains competitor data where all competitors have warnings", () => {
        const comp1 = getCompetitor1();
        const comp2 = getCompetitor2();
        comp1.numControls = "Not a valid number";
        comp2.numControls = "Not a valid number";

        ALL_FORMATS.forEach(function (format) {
            const eventDataStr = format.header + generateRow(comp1, getControls1(), format.template) + generateRow(comp2, getControls1(), format.template);
            runInvalidDataTest(eventDataStr, "data where all competitors have warnings", "WrongFileFormat");
        });
    });

    it("Cannot parse a string that contains a single competitor's data followed by a junk line", () => {
        ALL_FORMATS.forEach(function (format) {
            let eventDataStr = format.header + generateRow(getCompetitor1(), getControls1(), format.template);
            eventDataStr = eventDataStr + "\r\nrubbish;more rubbish;\r\n";
            runInvalidDataTest(eventDataStr, "data with an unrecognised delimiter", "");
        });
    });

    it("Cannot parse file that contains comma-separated numbers", () => {
        let line1 = "";
        let line2 = "";
        for (let i = 0; i < 50; i += 1) {
            line1 += "X,";
            line2 += Math.round((1 + Math.sin(i * i)) * 232) + ",";
        }

        const eventDataStr = line1 + "X\n" + line2 + "0\n";
        runInvalidDataTest(eventDataStr, "an empty string", "WrongFileFormat");
    });

    it("Can parse a string that contains a single competitor's data with a missed control", () => {
        const comp = getCompetitor1();
        comp.placing = "mp";
        const controls = getControls1();
        controls[1].time = "-----";
        runTestOverAllFormats([[comp, controls]], function (eventData) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");

            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, null, 362, 393], "Should read correct cumulative times");
        });
    });

    it("Can parse with warnings a string that contains a competitor with a non-numeric control count", () => {
        const comp1 = getCompetitor1();
        comp1.numControls = "This is not a valid number";
        runTestOverAllFormats([[comp1, getControls1()], [getCompetitor2(), getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
        });
    });

    it("Can parse with warnings a string that contains a single competitor's data with a missing class name", () => {
        const comp1 = getCompetitor1();
        comp1.className = "";
        comp1.course = "";
        runTestOverAllFormats([[comp1, getControls1()], [getCompetitor2(), getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
        });
    });

    it("Can parse a string that contains a single competitor's data with a missed control and remove the trailing 'mp' from the name", () => {
        const comp = getCompetitor1();
        comp.surname = "Smith mp";
        comp.placing = "mp";
        const controls = getControls1();
        controls[1].time = "-----";
        runTestOverAllFormats([[comp, controls]], function (eventData: Results) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");

            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.name).toEqual("John Smith", "Should read correct name without 'mp' suffix");
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, null, 362, 393], "Should read correct cumulative times");
        });
    });

    it("Can parse a string that contains a single non-competitive competitor's data and remove the trailing 'n/c' from the name", () => {
        const comp = getCompetitor1();
        comp.surname = "Smith n/c";
        comp.placing = "n/c";
        runTestOverAllFormats([[comp, getControls1()]], function (eventData: Results) {
            expect(eventData instanceof Results).toBe(true, "Result of parsing should be an Event object");
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");

            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.name).toEqual("John Smith", "Should read correct name without 'n/c' suffix");
            expect(competitor.getAllOriginalCumulativeTimes()).toEqual([0, 110, 218, 362, 393], "Should read correct cumulative times");
            expect(competitor.isNonCompetitive).toBe(true, "Competitor should be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single non-competitive competitor's data", () => {
        const comp = getCompetitor1();
        comp.nonComp = "1";
        runTestOverAllFormats([[comp, getControls1()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(competitor.isNonCompetitive).toBe(true, "Competitor should be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single non-starting competitor's data", () => {
        const competitor1 = getCompetitor1();
        competitor1.time = "";
        competitor1.finish = "";
        runTestOverAllFormats([[competitor1, getControls1AllMissed()]], function (eventData: Results) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(competitor.isNonStarter).toBe(true, "Competitor should be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single non-starting competitor's data when flagged as non-starter", () => {
        const competitor1 = getCompetitor1();
        competitor1.time = "";
        competitor1.finish = "";
        competitor1.classifier = "1";
        runTestOverAllFormats([[competitor1, getControls1AllMissed()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(competitor.isNonStarter).toBe(true, "Competitor should be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single non-finishing competitor's data when flagged as non-finisher", () => {
        const competitor1 = getCompetitor1();
        competitor1.classifier = "2";
        const controls = getControls1();
        controls[1].time = "-----";
        runTestOverAllFormats([[competitor1, controls]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(competitor.isNonFinisher).toBe(true, "Competitor should be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single disqualified competitor's data when flagged as disqualified", () => {
        const competitor1 = getCompetitor1();
        competitor1.classifier = "4";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(competitor.isDisqualified).toBe(true, "Competitor should be marked as disqualified");
            expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be marked as over max time");
        });
    });

    it("Can parse a string that contains a single over-max-time competitor's data when flagged as over max time", () => {
        const competitor1 = getCompetitor1();
        competitor1.classifier = "5";
        runTestOverAllFormats([[competitor1, getControls1()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read");
            const competitor = eventData.classes[0].competitors[0];
            expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
            expect(!competitor.isNonStarter).toBe(true, "Competitor should not be marked as a non-starter");
            expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be marked as a non-finisher");
            expect(!competitor.isDisqualified).toBe(true, "Competitor should not be marked as disqualified");
            expect(competitor.isOverMaxTime).toBe(true, "Competitor should be marked as over max time");
        });
    });

    it("Can parse a string that contains two competitors in the same class and course", () => {
        runTestOverAllFormats([[getCompetitor1(), getControls1()], [getCompetitor2(), getControls2()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "Array element should be a CourseClass object");
            expect(eventData.classes[0].numControls).toEqual(3, "Class should have three controls");
            expect(eventData.classes[0].competitors.length).toEqual(2, "Two competitors should have been read");

            expect(eventData.classes[0].competitors[0].name).toEqual("John Smith", "Should read correct name for first competitor");
            expect(eventData.classes[0].course).toEqual(eventData.courses[0], "Course should be set on the class");
            expect(eventData.courses[0].controls).toEqual(["208", "227", "212"]);
        });
    });

    it("Can parse a string that contains two competitors in the same class but different course", () => {
        const comp1 = getCompetitor1();
        comp1.course = "Test course 1";
        const comp2 = getCompetitor2();
        comp2.course = "Test course 2";
        runTestOverAllFormats([[comp1, getControls1()], [comp2, getControls2()]], function (eventData) {
            expect(eventData.classes.length).toEqual(1, "There should be one class");
            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "Array element should be a CourseClass object");
            expect(eventData.classes[0].numControls).toEqual(3, "Class should have three controls");
            expect(eventData.classes[0].competitors.length).toEqual(2, "Two competitors should have been read");

            expect(eventData.classes[0].competitors[0].name).toEqual("John Smith", "Should read correct name for first competitor");
            expect(eventData.classes[0].competitors[1].name).toEqual("Fred Baker", "Should read correct name for second competitor");

            expect(eventData.courses.length).toEqual(1, "There should be one element in the courses array");
            expect(eventData.courses[0].name).toEqual("Test course 1", "The course name should be the first course");

            expect(eventData.classes[0].course).toEqual(eventData.courses[0], "Course should be set on the class");
            expect(eventData.courses[0].controls).toEqual(["208", "227", "212"]);
        });
    });

    it("Can parse a string that contains two competitors in the same course but different class", () => {
        const comp1 = getCompetitor1();
        comp1.className = "Test class 1";
        const comp2 = getCompetitor2();
        comp2.className = "Test class 2";
        runTestOverAllFormats([[comp1, getControls1()], [comp2, getControls2()]], function (eventData) {
            expect(eventData.classes.length).toEqual(2, "There should be two classes");
            expect(eventData.classes[0].competitors.length).toEqual(1, "First class should have two competitors");
            expect(eventData.classes[1].competitors.length).toEqual(1, "Second class should have two competitors");

            expect(eventData.classes[0].competitors[0].name).toEqual("John Smith", "Should read correct name for first competitor");
            expect(eventData.classes[1].competitors[0].name).toEqual("Fred Baker", "Should read correct name for second competitor");

            expect(eventData.courses.length).toEqual(1, "There should be one element in the courses array");
            expect(eventData.courses[0].name).toEqual("Test course", "The course name should be correct");
            expect(eventData.courses[0].classes).toEqual(eventData.classes, "The course should have the two classes");

            expect(eventData.classes[0].course).toEqual(eventData.courses[0], "Course should be set on the first class");
            expect(eventData.classes[1].course).toEqual(eventData.courses[0], "Course should be set on the second class");
        });
    });

    it("Can parse a string that contains a course with two classes where one class is used in another course into an event with a single course", () => {
        const comp1 = getCompetitor1();
        comp1.className = "Test class 1";
        comp1.course = "Test course 1";
        const comp2 = getCompetitor2();
        comp2.className = "Test class 2";
        comp2.course = "Test course 1";
        const comp3 = getCompetitor3();
        comp3.className = "Test class 2";
        comp3.course = "Test course 2";

        runTestOverAllFormats([[comp1, getControls1()], [comp2, getControls2()], [comp3, getControls3()]], function (eventData) {
            expect(eventData.classes.length).toEqual(2, "There should be two classes");
            expect(eventData.classes[0].competitors.length).toEqual(1, "First class should have two competitors");
            expect(eventData.classes[1].competitors.length).toEqual(2, "Second class should have two competitors");

            expect(eventData.classes[0].competitors[0].name).toEqual("John Smith", "Should read correct name for competitor in first class");
            expect(eventData.classes[1].competitors[0].name).toEqual("Fred Baker", "Should read correct name for first competitor in second class");

            expect(eventData.courses.length).toEqual(1, "There should be one element in the courses array");
            expect(eventData.courses[0].name).toEqual("Test course 1", "The course name should be correct");
            expect(eventData.courses[0].classes).toEqual(eventData.classes, "The course should have the two classes");

            expect(eventData.classes[0].course).toEqual(eventData.courses[0], "Course should be set on the first class");
            expect(eventData.classes[1].course).toEqual(eventData.courses[0], "Course should be set on the second class");
            expect(eventData.courses[0].controls).toEqual(["208", "227", "212"]);
        });
    });

    it("Can parse a string that contains two competitors on different classes and courses", () => {
        const comp1 = getCompetitor1();
        comp1.className = "Test class 1";
        comp1.course = "Test course 1";
        const comp2 = getCompetitor2();
        comp2.className = "Test class 2";
        comp2.course = "Test course 2";
        comp2.numControls = "4";
        comp2.distance = "5.3";
        comp2.climb = "155";
        comp2.time = "10:19";

        runTestOverAllFormats([[comp1, getControls1()], [comp2, getLongerControls2()]], function (eventData) {
            expect(eventData.classes.length).toEqual(2, "There should be two classes");
            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "First array element should be a CourseClass object");
            expect(eventData.classes[1] instanceof CourseClass).toBe(true, "Second array element should be a CourseClass object");
            expect(eventData.classes[0].numControls).toEqual(3, "First class should have three controls");
            expect(eventData.classes[1].numControls).toEqual(4, "Second class should have four controls");
            expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read for the first class");
            expect(eventData.classes[1].competitors.length).toEqual(1, "One competitor should have been read for the second class");
            expect(eventData.classes[0].competitors[0].name).toEqual("John Smith", "Should read correct name for competitor on first class");
            expect(eventData.classes[1].competitors[0].name).toEqual("Fred Baker", "Should read correct name for competitor on second class");

            expect(eventData.courses.length).toEqual(2, "There should be two elements in the courses array");
            expect(eventData.courses[0] instanceof Course).toBe(true, "First array element should be a Course object");
            expect(eventData.courses[1] instanceof Course).toBe(true, "Second array element should be a Course object");
            expect(eventData.courses[0].name).toEqual("Test course 1", "First course should have correct name");
            expect(eventData.courses[1].name).toEqual("Test course 2", "Second course should have correct name");
            expect(eventData.courses[0].classes).toEqual([eventData.classes[0]], "First course should use the first class only");
            expect(eventData.courses[1].classes).toEqual([eventData.classes[1]], "Second course should use the second class only");
            expect(eventData.courses[0].length).toEqual(4.1, "First course length should be correct");
            expect(eventData.courses[0].climb).toEqual(140, "First course climb should be correct");
            expect(eventData.courses[1].length).toEqual(5.3, "Second course length should be correct");
            expect(eventData.courses[1].climb).toEqual(155, "Second course climb should be correct");

            expect(eventData.classes[0].course).toEqual(eventData.courses[0], "First course should be set on the first class");
            expect(eventData.classes[1].course).toEqual(eventData.courses[1], "Second course should be set on the second class");
            expect(eventData.courses[0].controls).toEqual(["208", "227", "212"]);
            expect(eventData.courses[1].controls).toEqual(["208", "222", "219", "213"]);
        });
    });

    it("Can parse a string that contains two competitors on different classes, sorting the classes into order", () => {
        const comp1 = getCompetitor1();
        comp1.className = "Test class 2";
        comp1.course = "Test course 1";
        const comp2 = getCompetitor2OnLongerCourse();
        comp2.className = "Test class 1";
        comp2.course = "Test course 2";
        const controls2 = [{ code: "208", time: "02:01" }, { code: "222", time: "04:06" }, { code: "219", time: "06:37" }, { code: "213", time: "09:10" }];
        runTestOverAllFormats([[comp1, getControls1()], [comp2, controls2]], function (eventData) {
            expect(eventData.classes.length).toEqual(2, "There should be two elements in the classes array");
            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "First array element should be a CourseClass object");
            expect(eventData.classes[1] instanceof CourseClass).toBe(true, "Second array element should be a CourseClass object");
            expect(eventData.classes[0].name).toEqual("Test class 1", "First class should be first class alphabetically");
            expect(eventData.classes[1].name).toEqual("Test class 2", "Second class should be second class alphabetically");
            expect(eventData.classes[0].competitors[0].name).toEqual("Fred Baker", "Should read correct name for competitor on first class");
            expect(eventData.classes[1].competitors[0].name).toEqual("John Smith", "Should read correct name for competitor on second class");

            expect(eventData.courses.length).toEqual(2, "There should be two elements in the courses array");
            expect(eventData.courses[0] instanceof Course).toBe(true, "First array element should be a Course object");
            expect(eventData.courses[1] instanceof Course).toBe(true, "Second array element should be a Course object");
            expect(eventData.courses[0].name).toEqual("Test course 1", "First course should have correct name");
            expect(eventData.courses[1].name).toEqual("Test course 2", "Second course should have correct name");
            expect(eventData.courses[0].classes).toEqual([eventData.classes[1]], "First course should use the second class only");
            expect(eventData.courses[1].classes).toEqual([eventData.classes[0]], "Second course should use the first class only");

            expect(eventData.classes[0].course).toEqual(eventData.courses[1], "Second course should be set on the first class");
            expect(eventData.classes[1].course).toEqual(eventData.courses[0], "First course should be set on the second class");
        });
    });

    it("Can parse a string that contains two competitors on different classes, sorting the classes into order", () => {
        const comp1 = getCompetitor1();
        comp1.className = "Test class 2";
        comp1.course = "Test course 1";
        const comp2 = getCompetitor2OnLongerCourse();
        comp2.className = "Test class 1";
        comp2.course = "Test course 2";
        const controls2 = [{ code: "208", time: "02:01" }, { code: "222", time: "04:06" }, { code: "219", time: "06:37" }, { code: "213", time: "09:10" }];
        runTestOverAllFormats([[comp1, getControls1()], [comp2, controls2]], function (eventData) {
            expect(eventData.classes.length).toEqual(2, "There should be two elements in the classes array");
            expect(eventData.classes[0] instanceof CourseClass).toBe(true, "First array element should be a CourseClass object");
            expect(eventData.classes[1] instanceof CourseClass).toBe(true, "Second array element should be a CourseClass object");
            expect(eventData.classes[0].name).toEqual("Test class 1", "First class should be first class alphabetically");
            expect(eventData.classes[1].name).toEqual("Test class 2", "Second class should be second class alphabetically");
            expect(eventData.classes[0].competitors[0].name).toEqual("Fred Baker", "Should read correct name for competitor on first class");
            expect(eventData.classes[1].competitors[0].name).toEqual("John Smith", "Should read correct name for competitor on second class");

            expect(eventData.courses.length).toEqual(2, "There should be two elements in the courses array");
            expect(eventData.courses[0] instanceof Course).toBe(true, "First array element should be a Course object");
            expect(eventData.courses[1] instanceof Course).toBe(true, "Second array element should be a Course object");
            expect(eventData.courses[0].name).toEqual("Test course 1", "First course should have correct name");
            expect(eventData.courses[1].name).toEqual("Test course 2", "Second course should have correct name");
            expect(eventData.courses[0].classes).toEqual([eventData.classes[1]], "First course should use the second class only");
            expect(eventData.courses[1].classes).toEqual([eventData.classes[0]], "Second course should use the first class only");

            expect(eventData.classes[0].course).toEqual(eventData.courses[1], "Second course should be set on the first class");
            expect(eventData.classes[1].course).toEqual(eventData.courses[0], "First course should be set on the second class");
        });
    });
});

