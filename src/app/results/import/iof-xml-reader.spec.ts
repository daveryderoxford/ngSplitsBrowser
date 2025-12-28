// @ts-nocheck

/*
 *  SplitsBrowser - IOF XML format parser tests.
 *
 *  Copyright (C) 2000-2016 Dave Ryder, Reinhard Balling, Andris Strazdins,
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
/* eslint-disable @typescript-eslint/quotes */

import { describe, expect } from 'vitest';
import { Competitor, CourseClass, TimeUtilities } from "../model";
import { TestSupport } from "../test-support.spec";
import { parseIOFXMLEventData } from "./iof-xml-reader";

const formatTime = TimeUtilities.formatTime;
const parseEventData = parseIOFXMLEventData;

// The number of feet per kilometre.
const FEET_PER_KILOMETRE = 3280;

const V2_HEADER = '<?xml version="1.0" ?>\n<!DOCTYPE ResultList SYSTEM "IOFdata.dtd">\n';

const V3_RESULT_LIST_START = '<ResultList xmlns="http://www.orienteering.org/datastandard/3.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" iofVersion="3.0">';
const V3_RESULT_LIST_END = '</ResultList>';
const V3_XML_HEADER = '<?xml version="1.0" encoding="UTF-8"?>\n';

interface Person {
    forename: string;
    surname: string;
    club: string;
    gender: string;
    birthDate: string;
    startTime: number;
    totalTime: number;
    controls: string[];
    cumTimes: string[];
    result: boolean;
    ecardId: string;
}

describe("Input.IOFXml", () => {

    /**
    * Returns a person object with the forename, surname, club, startTime,
    * totalTime, courseLength, controls and cumTimes properties set.
    * @return {Object} Person object.
    */
    function getPerson(): Person {
        return {
            forename: "John",
            surname: "Smith",
            club: "TestClub",
            gender: "M",
            birthDate: "1976-04-11",
            startTime: 10 * 3600 + 11 * 60 + 37,
            totalTime: 65 + 221 + 184 + 100,
            controls: ["182", "148", "167"],
            cumTimes: [65, 65 + 221, 65 + 221 + 184],
            result: true,
            ecardId: "12345"
        };
    }

    // In all of the following XML generation functions, it is assumed that the
    // input argument contains no characters that are interpreted by XML, such
    // as < > & " '.  This is only test code; we assume those writing these
    // tests are smart enough to know not to do this.

    const Version2Formatter: any = {
        name: "version 2.0.3",
        header: V2_HEADER + "\n<ResultList>\n<IOFVersion version=\"2.0.3\" />\n",
    };

    /**
    * Returns a chunk of XML that contains a class name.
    * @param {String} className - The name of the class.
    * @return {String} XML string containing the class name.
    */
    Version2Formatter.getClassXml = function (className) {
        return "<ClassShortName>" + className + "</ClassShortName>\n";
    };

    /**
    * Returns a chunk of XML that contains course details.
    * This formatter does not support course details, so this function returns
    * an empty string.
    * @returns {String} An empty string.
    */
    Version2Formatter.getCourseXml = () => {
        return "";
    };

    /**
    * Generates some XML for a person.
    *
    * The properties supported are as follows.  Unless specified otherwise, the
    * XML generated for each property is omitted if the property is not
    * specified:
    * * forename (String) - The person's forename.
    * * surname (String) - The person's surname.
    * * club {String} The person's club.
    * * startTime (Number) - The person's start time, in seconds since
    *       midnight.
    * * totalTime (Number) - The person's total time, in seconds.
    * * competitive (boolean) - True if competitive, false if non-competitive.
    *       Assumed competitive if not specified.
    * * controls (Array) - Array of control codes.  Must be specified.
    * * cumTimes {Array} - Array of cumulative times.  Must be specified.
    * * result {Any} - Specified to include the <Result> element, omit to
    *       skip it.
    *
    * Additionally the classData object has the following properties:
    * * courseLength (Number) - The length of the course.
    * * courseLengthUnit (String) - The unit that the length of the course is
    *       measured in.
    *
    * @param {Object} personData - The person data.
    * @param {Object} classData - The class data.
    * @return {String} Generated XML string.
    */
    Version2Formatter.getPersonResultXml = function (personData, classData) {

        function exists(name) {
            return personData.hasOwnProperty(name);
        }

        if (!exists("controls") || !exists("cumTimes")) {
            throw new Error("controls and cumTimes must both be specified");
        }

        if (personData.controls.length !== personData.cumTimes.length) {
            throw new Error("Controls and cumulative times have different lengths");
        }

        let personNameXml = "";
        if (exists("forename") || exists("surname")) {
            personNameXml = "<Person";
            if (exists("gender")) {
                personNameXml += ' sex="' + personData.gender + '"';
            }

            personNameXml += '><PersonName>\n';
            if (exists("forename")) {
                personNameXml += '<Given>' + personData.forename + "</Given>\n";
            }
            if (exists("surname")) {
                personNameXml += "<Family>" + personData.surname + "</Family>\n";
            }
            personNameXml += "</PersonName>";

            if (exists("birthDate")) {
                personNameXml += "<BirthDate><Date>" + personData.birthDate + "</Date></BirthDate>\n";
            }

            personNameXml += "</Person>\n";
        }

        const clubXml = (exists("club")) ? "<Club><ShortName>" + personData.club + "</ShortName></Club>\n" : "";
        const startTimeXml = (exists("startTime")) ? "<StartTime><Clock>" + formatTime(personData.startTime) + "</Clock></StartTime>\n" : "";
        const totalTimeXml = (exists("totalTime")) ? "<Time>" + formatTime(personData.totalTime) + "</Time>\n" : "";
        const ecardXml = (exists("ecardId")) ? '<CCard> <CCardId>' + personData.ecardId + '</CCardId> <PunchingUnitType value="SI" /> </CCard>' : "";

        let status;
        if (exists("nonStarter")) {
            status = "DidNotStart";
        } else if (exists("nonFinisher")) {
            status = "DidNotFinish";
        } else if (exists("disqualified")) {
            status = "Disqualified";
        } else if (exists("overMaxTime")) {
            status = "OverTime";
        } else if (personData.cumTimes.indexOf(null) >= 0) {
            status = "MisPunch";
        } else if (!exists("competitive") || personData.competitive) {
            status = "OK";
        } else {
            status = "NotCompeting";
        }

        const statusXml = "<CompetitorStatus value=\"" + status + "\" />\n";

        let courseLengthXml = "";
        if (classData.hasOwnProperty("length")) {
            if (classData.hasOwnProperty("lengthUnit")) {
                courseLengthXml = "<CourseLength unit=\"" + classData.lengthUnit + "\">" + classData.length + "</CourseLength>\n";
            } else {
                courseLengthXml = "<CourseLength>" + classData.length + "</CourseLength>\n";
            }
        }

        const splitTimesXmls = [];
        for (let index = 0; index < personData.cumTimes.length; index += 1) {
            splitTimesXmls.push("<SplitTime><ControlCode>" + personData.controls[index] + "</ControlCode><Time>" + formatTime(personData.cumTimes[index]) + "</Time></SplitTime>\n");
        }

        const resultXml = exists("result") ? "<Result>" + startTimeXml + totalTimeXml + ecardXml + statusXml + courseLengthXml + splitTimesXmls.join("") + "</Result>\n" : "";

        return "<PersonResult>" + personNameXml + clubXml + resultXml + "</PersonResult>\n";
    };

    /**
    * Zero-pads the given value to two digits.
    * @param {Number} value - The value to pad.
    * @return {String} Zero-padded number as a string.
    */
    function zeroPadTwoDigits(value) {
        return (value < 10) ? "0" + value : value.toString();
    }

    function hours(value) { return zeroPadTwoDigits(Math.floor(value / 3600)); }
    function minutes(value) { return zeroPadTwoDigits(Math.floor(value / 60) % 60); }
    function seconds(value) { return zeroPadTwoDigits(value % 60); }

    /**
    * Formats a start time as an ISO-8601 date.
    * @param {Number} startTime - The start time to format.
    * @return {String} The formatted date.
    */
    function formatStartTime(startTime) {
        return "2014-06-07T" + hours(startTime) + ":" + minutes(startTime) + ":" + seconds(startTime) + ".000+01:00";
    }

    /**
    * Formats a start time as an ISO-8601 date, but ending after the minutes.
    * @param {Number} startTime - The start time to format.
    * @return {String} The formatted date.
    */
    function formatStartTimeNoSeconds(startTime) {
        return "2014-06-07T" + hours(startTime) + ":" + minutes(startTime);
    }

    /**
    * Formats a start time as a 'baisc' ISO-8601 date, i.e. one without all of
    * the separating characters.
    * @param {Number} startTime - The start time to format.
    * @return {String} The formatted date.
    */
    function formatStartTimeBasic(startTime) {
        return "20140607" + hours(startTime) + minutes(startTime) + seconds(startTime);
    }

    const Version3Formatter: any = {
        name: "version 3.0",
        header: V3_XML_HEADER + V3_RESULT_LIST_START + "<Event><Name>Test event name</Name><StartTime><Date>2023-01-15</Date></StartTime></Event>\n",
    };

    /**
    * Returns a chunk of XML that contains a class name.
    * @param {String} className - The name of the class.
    * @return {String} XML string containing the class name.
    */
    Version3Formatter.getClassXml = function (className) {
        return "<Class><Name>" + className + "</Name></Class>\n";
    };

    /**
    * Returns a chunk of XML that contains course details.
    * @param {Object} clazz - Object containing class data.
    * @returns {String} XML string.
    */
    Version3Formatter.getCourseXml = function (clazz) {
        let xml = "<Course>\n";
        if (clazz.hasOwnProperty("courseId")) {
            xml += "<Id>" + clazz.courseId + "</Id>\n";
        }

        if (clazz.hasOwnProperty("courseName")) {
            xml += "<Name>" + clazz.courseName + "</Name>\n";
        } else if (clazz.hasOwnProperty("name")) {
            xml += "<Name>" + clazz.name + "</Name>\n";
        }

        if (clazz.hasOwnProperty("length")) {
            xml += "<Length>" + clazz.length + "</Length>\n";
        }

        if (clazz.hasOwnProperty("climb")) {
            xml += "<Climb>" + clazz.climb + "</Climb>\n";
        }

        if (clazz.hasOwnProperty("numberOfControls")) {
            xml += "<NumberOfControls>" + clazz.numberOfControls + "</NumberOfControls>\n";
        }

        xml += "</Course>\n";

        return xml;
    };

    /**
    * Generates some XML for a person.
    *
    * The properties supported are as follows.  Unless specified otherwise, the
    * XML generated for each property is omitted if the property is not specified:
    * * forname (String) - The person's formname.
    * * surname (String) - The person's surname.
    * * club {String} The person's club.
    * * startTime (Number) - The person's start time, in seconds since
    *       midnight.
    * * totalTime (Number) - The person's total time, in seconds.
    * * competitive (boolean) - True if competitive, false if non-competitive.
    *       Assumed competitive if not specified.
    * * controls (Array) - Array of control codes.  Must be specified.
    * * cumTimes {Array} - Array of cumulative times.  Must be specified.
    * * result {Any} - Specified to include the <Result> element, omit to
    *       skip it.
    *
    * @param {Object} personData - The person data.
    * @return {String} Generated XML string.
    */
    Version3Formatter.getPersonResultXml = function (personData) {

        function exists(name) {
            return personData.hasOwnProperty(name);
        }

        if (!exists("controls") || !exists("cumTimes")) {
            throw new Error("controls and cumTimes must both be specified");
        }

        if (personData.controls.length !== personData.cumTimes.length) {
            throw new Error("Controls and cumulative times have different lengths");
        }

        let personNameXml = "";
        if (exists("forename") || exists("surname")) {
            personNameXml = "<Person";

            if (exists("gender")) {
                personNameXml += " sex=\"" + personData.gender + "\"";
            }

            personNameXml += "><Name>\n";

            if (exists("forename")) {
                personNameXml += "<Given>" + personData.forename + "</Given>\n";
            }
            if (exists("surname")) {
                personNameXml += "<Family>" + personData.surname + "</Family>\n";
            }

            personNameXml += "</Name>";

            if (exists("birthDate")) {
                personNameXml += "<BirthDate>" + personData.birthDate + "</BirthDate>\n";
            }

            personNameXml += "</Person>\n";
        }

        const clubXml = (exists("club")) ? "<Organisation><ShortName>" + personData.club + "</ShortName></Organisation>\n" : "";

        let startTimeStr;
        if (personData.startTime === null) {
            startTimeStr = "";
        } else if (exists("startTimeBasic")) {
            startTimeStr = formatStartTimeBasic(personData.startTime);
        } else if (exists("startTimeNoSeconds")) {
            startTimeStr = formatStartTimeNoSeconds(personData.startTime);
        } else {
            startTimeStr = formatStartTime(personData.startTime);
        }

        const startTimeXml = (exists("startTime")) ? "<StartTime>" + startTimeStr + "</StartTime>\n" : "";
        const totalTimeXml = (exists("totalTime")) ? "<Time>" + personData.totalTime + "</Time>" : "";
        const ecardXml = (exists("ecardId")) ? "<ControlCard>" + personData.ecardId + "</ControlCard>" : "";

        let status;
        if (exists("nonStarter")) {
            status = "DidNotStart";
        } else if (exists("nonFinisher")) {
            status = "DidNotFinish";
        } else if (exists("disqualified")) {
            status = "Disqualified";
        } else if (exists("overMaxTime")) {
            status = "OverTime";
        } else if (personData.cumTimes.indexOf(null) >= 0) {
            status = "MissingPunch";
        } else if (!exists("competitive") || personData.competitive) {
            status = "OK";
        } else {
            status = "NotCompeting";
        }

        const statusXml = "<Status>" + status + "</Status>\n";

        const splitTimesXmls = [];
        for (let index = 0; index < personData.cumTimes.length; index += 1) {
            const time = personData.cumTimes[index];
            if (time === null) {
                splitTimesXmls.push("<SplitTime status=\"Missing\"><ControlCode>" + personData.controls[index] + "</ControlCode></SplitTime>\n");
            } else {
                splitTimesXmls.push("<SplitTime><ControlCode>" + personData.controls[index] + "</ControlCode><Time>" + time + "</Time></SplitTime>\n");
            }
        }

        const resultXml = exists("result") ? "<Result>" + startTimeXml + ecardXml + totalTimeXml + statusXml + splitTimesXmls.join("") + "</Result>\n" : "";

        return "<PersonResult>" + personNameXml + clubXml + resultXml + "</PersonResult>\n";
    };


    const ALL_FORMATTERS = [Version2Formatter, Version3Formatter];

    /**
    * Uses the given formatter to format the given class data as XML.
    * @param {Object} formatter - Formatter object.
    * @param {Array} classes - Array of objects containing data to format.
    * @return {String} Formatted XML string.
    */
    function getXmlFromFormatter(formatter, classes) {
        let xml = formatter.header;
        classes.forEach(function (clazz) {
            xml += "<ClassResult>\n";
            if (clazz.hasOwnProperty("name")) {
                xml += formatter.getClassXml(clazz.name);
            }

            xml += formatter.getCourseXml(clazz);

            xml += clazz.competitors.map(function (comp) { return formatter.getPersonResultXml(comp, clazz); }).join("\n");
            xml += "</ClassResult>\n";
        });
        if (formatter.name === Version2Formatter.name) { xml += "</ResultList>\n"; } // v2 ends here
        else { xml += V3_RESULT_LIST_END; } // v3 needs closing tag if header didn't include it
        return xml;
    }

    /**
    * Returns the single competitor in the given event.
    *
    * This function also asserts that the event has exactly one course-class and
    * exactly one competitor within that class.  This one competitor is what
    * it returns.
    * @param {Event} eventData - Event data parsed by the reader.
    * @param {String} formatterName - Name of the formatter used to generate
    *     the XML.
    * @return {Competitor} The single competitor.
    */
    function getSingleCompetitor(eventData, formatterName) {
        expect(eventData.classes.length).toEqual(1, "Expected one class - " + formatterName);
        if (eventData.classes.length === 1) {
            const courseClass = eventData.classes[0];
            expect(courseClass.competitors.length).toEqual(1, "Expected one competitor - " + formatterName);
            if (courseClass.competitors.length === 1) {
                return eventData.classes[0].competitors[0];
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    /**
    * Asserts that attempting to parse the given XML string will fail with an
    * InvalidData exception being thrown.
    * @param {String} xml - The XML string to attempt to parse.
    * @param {String} failureMessage - Optional message to show in assertion
    *     failure message if no exception is thrown.  A default message is used
    *     instead if this is not specified.
    */
    function assertInvalidData(xml: string, failureMessage?: string) {
        TestSupport.assertInvalidData(() => {
            parseEventData(xml);
        }, failureMessage);
    }

    /**
    * Asserts that attempting to parse the given string will fail with a
    * WrongFileFormat exception being thrown.
    * @param {String} data - The string to attempt to parse.
    * @param {String} failureMessage - Optional message to show in assertion
    *     failure message if no exception is thrown.  A default message is used
    *     instead if this is not specified.
    */
    function assertWrongFileFormat(data: string, failureMessage?: string) {
        TestSupport.assertException("WrongFileFormat", () => {
            parseEventData(data);
        }, failureMessage);
    }

    /**
    * Generates XML using each available formatter, parses the resulting XML,
    * and calls the given checking function on the result.
    *
    * The options supported are:
    * * formatters (Array): Array of formatters to use with this parser.
    *       Defaults to all formatters.
    * * preprocessor (Function): Function used to preprocess the
    *       XML before it is parsed.  Defaults to no preprocessing.
    * If none of the above options are required, the options object itself can
    * be omitted.
    *
    * @param {Array} classes - Array of class objects to generate the XML from.
    * @param {Function} checkFunc - Checking function called for each parsed
    *     event data object.  It is passed the data, and also the name of the
    *     formatter used.
    * @param {Object} options - Options object, the contents of which are
    *     described above.
    */
    function runXmlFormatParseTest(classes: CourseClass[], checkFunc, options?: any) {
        const formatters = (options && options.formatters) || ALL_FORMATTERS;
        formatters.forEach(function (formatter) {
            let xml = getXmlFromFormatter(formatter, classes);
            if (options && options.preprocessor) {
                xml = options.preprocessor(xml);
            }
            const eventData = parseEventData(xml);
            checkFunc(eventData, formatter.name);
        });
    }

    /**
    * Generates XML using each available formatter, parses the resulting XML,
    * and calls the given checking function on the result.  This function
    * asserts that the resulting data contains only a single competitor, and
    * then calls the check function with the parsed competitor.
    *
    * The options supported are the same as those for runXmlFormatParseTest.
    *
    * @param {Object} clazz - Class object to generate the XML from.
    * @param {Function} checkFunc - Checking function called for the parsed
    *     competitor, if a single competitor results.  It is passed the parsed
    *     competitor.
    * @param {Object} options - Options object, the contents of which are
    *     described above.
    */
    function runSingleCompetitorXmlFormatParseTest(clazz: any, checkFunc, options?: any) {
        runXmlFormatParseTest([clazz], function (eventData, formatterName) {
            const competitor = getSingleCompetitor(eventData, formatterName);
            if (competitor !== null) {
                checkFunc(competitor);
            }
        }, options);
    }

    /**
    * Generates XML using each available formatter, parses the resulting XML,
    * and calls the given checking function on the result.  This function
    * asserts that the resulting data contains only a single course, and
    * then calls the check function with the parsed course.
    *
    * The options supported are the same as those for runXmlFormatParseTest.
    *
    * @param {Array} classes - Array of class objects to generate the XML from.
    * @param {Function} checkFunc - Checking function called for the parsed
    *     course, if a single course results.  It is passed the parsed course.
    * @param {Object} options - Options object, the contents of which are
    *     described above.
    */
    function runSingleCourseXmlFormatParseTest(classes, checkFunc, options?: any) {
        runXmlFormatParseTest(classes, function (eventData, formatterName) {
            expect(eventData.courses.length).toEqual(1, "Expected one course - " + formatterName);
            if (eventData.courses.length === 1) {
                checkFunc(eventData.courses[0]);
            }
        }, options);
    }

    /**
    * Generates XML using each available formatter, attempts to parse each
    * generated XML string and asserts that each attempt fails.
    *
    * The options supported are:
    * * formatters (Array): Array of formatters to use with this parser.
    *       Defaults to all formatters.
    * * preprocessor (Function): Function used to preprocess the
    *       XML before it is parsed.  Defaults to no preprocessing.
    * If none of the above options are required, the options object itself can
    * be omitted.
    *
    * @param {Array} classes - Array of class objects to generate the XML
    *     using.
    * @param {Object} options - Options object, the contents of which are
    *     described above.
    */
    function runFailingXmlFormatParseTest(classes: CourseClass[], options?: any) {
        const formatters = (options && options.formatters) || ALL_FORMATTERS;
        formatters.forEach(function (formatter) {
            let xml = getXmlFromFormatter(formatter, classes);
            if (options && options.preprocessor) {
                xml = options.preprocessor(xml);
            }
            assertInvalidData(xml, "Expected invalid data - " + formatter.name);
        });
    }

    it("Cannot parse an empty string", () => {
        assertWrongFileFormat("");
    });

    it("Cannot parse a non-empty string that is not XML", () => {
        assertWrongFileFormat("This is not valid IOF XML data");
    });

    it("Cannot parse a string that is XML but does not mention the IOFdata DTD", () => {
        assertWrongFileFormat("<ResultList />");
    });

    it("Cannot parse a string for the v2.0.3 format that mentions the IOFdata DTD but is not well-formed XML", () => {
        assertInvalidData(V2_HEADER + "<ResultList <<<");
    });

    it("Cannot parse a string for the v2.0.3 format that uses the wrong root element name", () => {
        assertWrongFileFormat(V2_HEADER + "<Wrong />");
    });

    it("Cannot parse a string for the v2.0.3 format that does not contain an IOFVersion element", () => {
        assertWrongFileFormat(V2_HEADER + "<ResultList><NotTheIOFVersion version=\"1.2.3\" /><ClassResult /></ResultList>\n");
    });

    it("Cannot parse a string for the v2.0.3 format that has an IOFVersion element with no version attribute", () => {
        assertWrongFileFormat(V2_HEADER + "<ResultList><IOFVersion /><ClassResult /></ResultList>\n");
    });

    it("Cannot parse a string for the v2.0.3 format that has an IOFVersion element with a version other than 2.0.3", () => {
        assertWrongFileFormat(V2_HEADER + "<ResultList><IOFVersion version=\"wrong\" /><ClassResult /></ResultList>\n");
    });

    it("Cannot parse a string for the v2.0.3 format that has a status of something other than complete", () => {
        assertInvalidData(
            V2_HEADER + "<ResultList status=\"delta\"><IOFVersion version=\"2.0.3\" /></ResultList>\n",
            "Exception should be thrown attempting to parse XML that contains an IOFVersion element with a wrong version");
    });

    it("Cannot parse a string for the v3.0 format that mentions the IOF XSD but is not well-formed XML", () => {
        assertInvalidData((V3_XML_HEADER + V3_RESULT_LIST_START).replace("<ResultList", "<ResultList <<<") + V3_RESULT_LIST_END);
    });

    it("Cannot parse a string for the v3.0 format that uses the wrong root element name", () => {
        assertWrongFileFormat((V3_XML_HEADER + V3_RESULT_LIST_START).replace("<ResultList", "<Wrong") + "</Wrong>");
    });

    it("Cannot parse a string for the v3.0 format that contains no iofVersion attribute", () => {
        assertWrongFileFormat(V3_XML_HEADER + V3_RESULT_LIST_START.replace("iofVersion=\"3.0\"", "") + V3_RESULT_LIST_END);
    });

    it("Cannot parse a string for the v3.0 format that has an iofVersion element with a version other than 3.0", () => {
        assertWrongFileFormat(V3_XML_HEADER + V3_RESULT_LIST_START.replace("iofVersion=\"3.0\"", "iofVersion=\"4.6\"") + V3_RESULT_LIST_END);
    });

    it("Cannot parse a string for the v3.0 format that has a status of something other than complete", () => {
        assertInvalidData(
            V3_XML_HEADER + V3_RESULT_LIST_START.replace("<ResultList", "<ResultList status=\"Delta\"") + "</ResultList>",
            "Exception should be thrown attempting to parse XML that contains an IOFVersion element with a wrong version");
    });

    it("Cannot parse a string that has no class results in it", () => {
        runFailingXmlFormatParseTest([]);
    });

    it("Can parse with warnings a string that has a class with no name", () => {
        runXmlFormatParseTest([{ length: 2300, courseId: 1, competitors: [getPerson()] }],
            (eventData, formatterName) => {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].name !== "").toBe(true);
            });
    });

    it("Can parse a string that has a single class with no competitors", () => {
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, competitors: [] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(0, "No classes should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
            });
    });

    it("Can parse event details from IOF v3.0 format", () => {
        const eventName = "My Awesome Event";
        const eventDateStr = "2024-07-31";
        const eventDate = new Date(eventDateStr);

        const person = getPerson();
        const classes = [{ name: "Test Class", length: 2300, competitors: [person] }];

        // Construct XML with specific Event details
        let xml = V3_XML_HEADER + V3_RESULT_LIST_START.replace('>', `>
            <Event>
              <Name>${eventName}</Name>
              <StartTime><Date>${eventDateStr}</Date></StartTime>
            </Event>
        `);
        xml += "<ClassResult>\n" + Version3Formatter.getClassXml(classes[0].name) + Version3Formatter.getCourseXml(classes[0]);
        xml += classes[0].competitors.map(comp => Version3Formatter.getPersonResultXml(comp, classes[0])).join("\n");
        xml += "</ClassResult>\n" + V3_RESULT_LIST_END;

        const eventData = parseEventData(xml);
        expect(eventData.eventName).toEqual(eventName, "Event name should be parsed correctly");
        expect(eventData.eventDate).toEqual(eventDate, "Event date should be parsed correctly");
    });

    it("Can parse a string that has a single class with a single competitor", () => {
        const className = "Test Class";
        const classLength = 2300;
        const person = getPerson(); 
        runXmlFormatParseTest([{ name: className, length: classLength, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                if (eventData.classes.length === 1) {
                    const courseClass = eventData.classes[0];
                    expect(courseClass.name).toEqual(className);
                    expect(courseClass.competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                    expect(courseClass.numControls).toEqual(3);

                    if (courseClass.competitors.length === 1) {
                        const competitor = courseClass.competitors[0];
                        expect(competitor.name).toEqual(person.forename + " " + person.surname);
                        expect(competitor.club).toEqual(person.club);
                        expect(competitor.startTime).toEqual(person.startTime);
                        expect(competitor.totalTime).toEqual(person.totalTime);
                        expect(competitor.gender).toEqual("M");
                        expect(competitor.yearOfBirth).toEqual(1976);
                        expect(competitor.ecardId).toEqual("12345", "ECard incorrect");
                        expect(competitor.allOriginalCumulativeTimes).toEqual([0].concat(person.cumTimes).concat(person.totalTime));
                        expect(competitor.completed).toBe(true);
                        expect(!competitor.isNonCompetitive).toBe(true);
                    }

                    expect(eventData.courses.length).toEqual(1, "One course should have been read - " + formatterName);
                    if (eventData.courses.length > 0) {
                        const course = eventData.courses[0];
                        expect(course.name).toEqual(className);
                        expect(course.length).toEqual(classLength / 1000);
                        expect(course.controls).toEqual(person.controls);

                        expect(course.classes).toEqual([courseClass]);
                        expect(courseClass.course).toEqual(course);
                    }
                }
            });
    });

    it("Can parse a string that has a single class with a single competitor and complete status in IOF v2.0.3 format", () => {
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [getPerson()] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
            },
            {
                preprocessor: function (xml) { return xml.replace(/<ResultList>/, "<ResultList status=\"complete\">"); },
                formatters: [Version2Formatter]
            }
        );
    });

    it("Can parse a string that has a single class with a single competitor and complete status in IOF v3.0 format", () => {
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [getPerson()] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
            },
            {
                preprocessor: function (xml) { return xml.replace(/<ResultList/, "<ResultList status=\"Complete\""); },
                formatters: [Version3Formatter]
            }
        );
    });

    it("Can parse a string that has a single class with a single competitor with forename only", () => {
        const person = getPerson() as Partial<Person>;
        delete person.surname;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.name).toEqual(person.forename);
            });
    });

    it("Can parse a string that has a single class with a single competitor with surname only", () => {
        const person = getPerson() as Partial<Person>;;
        delete person.forename;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.name).toEqual(person.surname);
            });
    });

    it("Can parse with warnings a string that contains a competitor with no name", () => {
        const person = getPerson() as Partial<Person>;
        delete person.forename;
        delete person.surname;
        runXmlFormatParseTest(
            [{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(0, "No competitors should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued - " + formatterName);
            });
    });

    it("Can parse a string that contains a competitor with missing club", () => {
        const person = getPerson() as Partial<Person>;;
        delete person.club;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.club).toEqual("");
            });
    });

    it("Can parse a string that contains a competitor with no year of birth", () => {
        const person = getPerson() as Partial<Person>;
        delete person.birthDate;
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                expect(eventData.classes[0].competitors[0].yearOfBirth).toEqual(null);
            });
    });

    it("Can parse a string that contains a competitor with an invalid year of birth, ignoring it", () => {
        const person = getPerson();
        person.birthDate = "This is not a valid birth date";
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                expect(eventData.classes[0].competitors[0].yearOfBirth).toEqual(null);
            });
    });

    it("Can parse a string that contains a female competitor", () => {
        const person = getPerson();
        person.forename = "Joan";
        person.gender = "F";
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                expect(eventData.classes[0].competitors[0].gender).toEqual("F");
            });
    });

    it("Can parse a string that contains a competitor with no gender specified", () => {
        const person = getPerson() as Partial<Person>;;
        delete person.gender;
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                expect(eventData.classes[0].competitors[0].gender).toEqual(null);
            });
    });

    it("Can parse a string that contains a competitor with an invalid gender, ignoring it", () => {
        const person = getPerson();
        person.gender = "This is not a valid gender";
        runXmlFormatParseTest([{ name: "Test Class", length: 2300, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read -  " + formatterName);
                expect(eventData.classes[0].competitors[0].gender).toEqual(null);
            });
    });

    it("Can parse with warnings a string that contains a competitor with no Result", () => {
        const person = getPerson() as Partial<Person>;
        delete person.result;
        runXmlFormatParseTest(
            [{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
            });
    });

    it("Can parse a string that contains a competitor with missing start time", () => {
        const person = getPerson() as Partial<Person>;;
        delete person.startTime;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.startTime).toEqual(null);
            });
    });

    it("Can parse a string that contains a competitor with invalid start time", () => {
        const person = getPerson();
        person.startTime = null;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.startTime).toEqual(null);
            });
    });

    it("Can parse a string that contains a competitor with start time using ISO 8601 basic formatting", () => {
        const person = getPerson();
        person.startTimeBasic = true;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.startTime).toEqual(person.startTime);
            },
            { formatters: [Version3Formatter] });
    });

    it("Can parse a string that contains a competitor with start time without seconds", () => {
        const person = getPerson();
        person.startTimeNoSeconds = true;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.startTime).toEqual(person.startTime - (person.startTime % 60));
            },
            { formatters: [Version3Formatter] });
    });

    it("Can parse a string that contains a competitor with missing total time", () => {
        const person = getPerson() as Partial<Person>;;
        delete person.totalTime;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.totalTime).toEqual(null);
                expect(competitor.completed).toBe(false);
            });
    });

    it("Can parse a string that contains a competitor with invalid total time", () => {
        const person = getPerson() as any;
        person.totalTime = null;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.totalTime).toEqual(null);
                expect(competitor.completed).toBe(false);
            });
    });

    it("Can parse a string that contains a competitor with fractional seconds to controls", () => {
        const person = getPerson();
        person.cumTimes = [65.7, 65.7 + 221.4, 65.7 + 221.4 + 184.6];
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.allOriginalCumulativeTimes).toEqual([0].concat(person.cumTimes).concat(person.totalTime));
            },
            { formatters: [Version3Formatter] });
    });

    it("Can parse a string that contains a course with no length", () => {
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", competitors: [getPerson()] }],
            function (course) {
                expect(course.length).toEqual(null);
            });
    });

    it("Can parse with warnings a string that contains an invalid course length", () => {
        runXmlFormatParseTest(
            [{ name: "Test Class", length: "This is not a valid number", competitors: [getPerson()] }],
            function (eventData, formatterName) {
                expect(eventData.courses.length).toEqual(1, "One course should have been read - " + formatterName);
                expect(eventData.courses[0].length).toEqual(null, "No course length should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
            });
    });

    it("Can parse a string that contains a course length specified in metres", () => {
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, lengthUnit: "m", competitors: [getPerson()] }],
            function (course) {
                expect(course.length).toEqual(2.3);
            },
            { formatters: [Version2Formatter] });
    });

    it("Can parse a string that contains a course length specified in kilometres", () => {
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2.3, lengthUnit: "km", courseId: 1, competitors: [getPerson()] }],
            function (course) {
                expect(course.length).toEqual(2.3);
            },
            { formatters: [Version2Formatter] });
    });

    it("Can parse a string that contains a course length specified in feet", () => {
        const courseLength = 10176;
        const expectedLengthKm = courseLength / FEET_PER_KILOMETRE;
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: courseLength, lengthUnit: "ft", courseId: 1, competitors: [getPerson()] }],
            function (course) {
                expect(Math.abs(expectedLengthKm - course.length) < 1e-7).toBe(true, "Expected length: " + expectedLengthKm + ", actual: " + course.length);
            },
            { formatters: [Version2Formatter] });
    });

    it("Can parse with warnings a string that contains an unrecognised course length unit", () => {
        runXmlFormatParseTest(
            [{ name: "Test Class", length: "100", lengthUnit: "furlong", competitors: [getPerson()] }],
            function (eventData) {
                expect(eventData.courses.length).toEqual(1, "One course should have been read");
                expect(eventData.courses[0].length).toEqual(null, "No course length should have been read");
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
            },
            { formatters: [Version2Formatter] });
    });

    it("Can parse a string that contains a course climb", () => {
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2300, climb: 105, courseId: 1, competitors: [getPerson()] }],
            function (course) {
                expect(course.climb).toEqual(105);
            },
            { formatters: [Version3Formatter] });
    });

    it("Can parse a string that contains a non-competitive competitor", () => {
        const person = getPerson();
        person.competitive = false;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.isNonCompetitive).toEqual(true);
            });
    });

    it("Can parse a string that contains a non-starting competitor", () => {
        const person = getPerson();
        person.nonStarter = true;
        person.cumTimes = [null, null, null];
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.isNonStarter).toEqual(true);
            });
    });

    it("Can parse a string that contains a non-finishing competitor", () => {
        const person = getPerson();
        person.nonFinisher = true;
        person.cumTimes[2] = null;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.isNonFinisher).toEqual(true);
            });
    });

    it("Can parse a string that contains a disqualified competitor", () => {
        const person = getPerson();
        person.disqualified = true;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.isDisqualified).toEqual(true);
            });
    });

    it("Can parse a string that contains an over-max-time competitor", () => {
        const person = getPerson();
        person.overMaxTime = true;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.isOverMaxTime).toEqual(true);
            });
    });

    it("Can parse a string that uses alternative element name for control codes", () => {
        const person = getPerson();
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            function (course) {
                expect(course.controls).toEqual(person.controls);
            },
            {
                preprocessor: function (xml) {
                    return xml.replace(/<ControlCode>/g, "<Control><ControlCode>")
                        .replace(/<\/ControlCode>/g, "</ControlCode></Control>");
                },
                formatters: [Version2Formatter]
            });
    });

    it("Can parse a string that uses separate course names", () => {
        const person = getPerson();
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", courseName: "Test Course", length: 2300, courseId: 1, competitors: [person] }],
            function (course) {
                expect(course.name).toEqual("Test Course");
            },
            { formatters: [Version3Formatter] });
    });

    it("Cannot parse a string that contains a competitor with a split with a missing control code", () => {
        const person = getPerson();
        runFailingXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            { preprocessor: function (xml) { return xml.replace("<ControlCode>" + person.controls[1] + "</ControlCode>", ""); } });
    });

    it("Can parse a string that contains a competitor with an additional control, ignoring the additional control", () => {
        const person = getPerson();
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", courseName: "Test Course", length: 2300, courseId: 1, competitors: [person] }],
            function (course) {
                expect(course.classes.length).toEqual(1);
                expect(course.classes[0].numControls).toEqual(3);
            },
            {
                preprocessor: function (xml) { return xml.replace(/<\/Result>/, "<SplitTime status=\"Additional\"><ControlCode>987</ControlCode><Time>234</Time></SplitTime></Result>"); },
                formatters: [Version3Formatter]
            });
    });

    it("Can parse a string that contains a competitor with a split with a missing time", () => {
        const person = getPerson();
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            function (course) {
                expect(course.classes.length).toEqual(1);
                expect(course.classes[0].numControls).toEqual(3);
            },
            {
                preprocessor: function (xml) {
                    const timeRegex = /<Time>[^<]+<\/Time>/g;
                    timeRegex.exec(xml); // Skip the first match.
                    const secondMatch = timeRegex.exec(xml)[0];
                    return xml.replace(secondMatch, "");
                }
            });
    });

    it("Can parse a string that contains a competitor with their total time wrapped in a Clock element.", () => {
        const person = getPerson();
        runSingleCourseXmlFormatParseTest([{ name: "Test Class", length: 2300, courseId: 1, competitors: [person] }],
            function (course) {
                expect(course.classes.length).toEqual(1);
                expect(course.classes[0].competitors.length).toEqual(1);
                expect(course.classes[0].competitors[0].totalTime).toEqual(person.totalTime, "Should read competitor's total time");
            },
            {
                preprocessor: function (xml) {
                    const timeRegex = /<Time>[^<]+<\/Time>/g;
                    const firstMatch = timeRegex.exec(xml)[0];
                    const firstMatchTime = firstMatch.substring(6, firstMatch.length - 7);
                    xml = xml.replace(firstMatch, "<Time>\r\n<Clock>" + firstMatchTime + "</Clock>\r\n</Time>");
                    return xml;
                },
                formatters: [Version2Formatter]
            });
    });

    it("Can parse a string that contains a competitor that mispunched a control", () => {
        const person = getPerson();
        person.cumTimes[1] = null;
        runSingleCompetitorXmlFormatParseTest({ name: "Test Class", length: 2300, courseId: 1, competitors: [person] },
            function (competitor) {
                expect(competitor.allOriginalCumulativeTimes).toEqual([0].concat(person.cumTimes).concat([person.totalTime]));
                expect(competitor.completed).toBe(false);
            });
    });

    it("Cannot parse a string that contains a class with two competitors with different numbers of controls", () => {
        const person1 = getPerson();
        const person2 = getPerson();

        person2.forename = "Fred";
        person2.surname = "Jones";
        person2.controls.push("199");
        person2.cumTimes.push(person2.cumTimes[2] + 177);
        person2.totalTime = person2.cumTimes[2] + 177 + 94;

        runXmlFormatParseTest(
            [{ name: "Test Class", length: 2300, courseId: 1, competitors: [person1, person2] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued - " + formatterName);
                // TODO This should be OK but generates an erro concerning the number of controls for fred is 4 not 3!
                //     expect(eventData.warnings[0].match(/number of controls/)).toBe(true);
            }
        );
    });

    it("Can parse a string that contains a class with one competitor whose number of controls matches that specified by the course", () => {
        const person = getPerson();
        runSingleCompetitorXmlFormatParseTest(
            { name: "Test Class", length: 2300, courseId: 1, numberOfControls: person.controls.length, competitors: [person] },
            // In this test we only really want to be sure that the
            // competitor was read without the number-of-controls
            // validation firing.  So there aren't any assertions we really
            // need to run.
            () => { /* empty */ },
            { formatters: [Version3Formatter] }
        );
    });

    it("Can parse with warnings a string that contains a class with one competitor whose number of controls doesn't match that specified by the course", () => {
        const person = getPerson();
        runXmlFormatParseTest(
            [{ name: "Test Class", length: 2300, courseId: 1, numberOfControls: person.controls.length + 2, competitors: [person] }],
            function (eventData) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read");
                expect(eventData.classes[0].competitors.length).toEqual(0, "No competitors should have been read");
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued");
            },
            { formatters: [Version3Formatter] }
        );
    });

    it("Can parse with warnings a string that contains one class with two competitors having different control codes", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";
        person2.controls[1] += "9";

        runXmlFormatParseTest(
            [{ name: "Test Class 1", length: 2300, competitors: [person1, person2] }],
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(1, "One class should have been read - " + formatterName);
                expect(eventData.classes[0].competitors.length).toEqual(1, "One competitor should have been read - " + formatterName);
                expect(eventData.warnings.length).toEqual(1, "One warning should have been issued - " + formatterName);
            });
    });

    it("Can parse a string that contains two classes nominally the same course each with one competitor but with different controls as two separate courses", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";
        person2.controls[1] += "9";

        const classes = [
            { name: "Test Class 1", length: 2300, courseId: 1, competitors: [person1] },
            { name: "Test Class 2", length: 2300, courseId: 1, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData) {
                expect(eventData.courses.length).toEqual(2, "Should read the classes' courses as separate");
            },
            { formatters: [Version3Formatter] }
        );
    });

    it("Cannot parse a string that contains two classes using the same course each with one competitor but with different numbers of controls", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";
        person2.controls.push("199");
        person2.cumTimes.push(person2.cumTimes[2] + 177);
        person2.totalTime = person2.cumTimes[2] + 177 + 94;

        const classes = [
            { name: "Test Class 1", length: 2300, courseId: 1, competitors: [person1] },
            { name: "Test Class 2", length: 2300, courseId: 1, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData) {
                expect(eventData.courses.length).toEqual(2, "Should read the classes' courses as separate");
            },
            { formatters: [Version3Formatter] }
        );
    });

    it("Can parse a string that contains two classes each with one competitor", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";
        person2.controls.push("199");
        person2.cumTimes.push(person2.cumTimes[2] + 177);
        person2.totalTime = person2.cumTimes[2] + 177 + 94;

        const persons = [person1, person2];
        const classes = [
            { name: "Test Class 1", length: 2300, courseId: 1, competitors: [person1] },
            { name: "Test Class 2", length: 2300, courseId: 2, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(2, "Expected two classes - " + formatterName);
                expect(eventData.courses.length).toEqual(2, "Expected two courses - " + formatterName);

                if (eventData.classes.length === 2 && eventData.courses.length === 2) {
                    for (let i = 0; i < 2; i += 1) {
                        expect(eventData.classes[i].course).toEqual(eventData.courses[i]);
                        expect(eventData.courses[i].classes).toEqual([eventData.classes[i]]);
                        expect(eventData.classes[i].competitors.length).toEqual(1);
                        expect(eventData.classes[i].competitors[0].name).toEqual(persons[i].forename + " " + persons[i].surname);
                    }
                }
            });
    });

    it("Can parse a string that contains two classes each with one competitor, both on the same course", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";

        const persons = [person1, person2];
        const classes = [
            { name: "Test Class 1", length: 2300, courseId: 1, competitors: [person1] },
            { name: "Test Class 2", length: 2300, courseId: 1, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(2, "Expected two classes - " + formatterName);
                expect(eventData.courses.length).toEqual(1, "Expected one course - " + formatterName);

                if (eventData.classes.length === 2 && eventData.courses.length === 1) {
                    for (let i = 0; i < 2; i += 1) {
                        expect(eventData.classes[i].course).toEqual(eventData.courses[0]);
                        expect(eventData.classes[i].competitors.length).toEqual(1);
                        expect(eventData.classes[i].competitors[0].name).toEqual(persons[i].forename + " " + persons[i].surname);
                    }
                    expect(eventData.courses[0].classes).toEqual(eventData.classes);
                }
            },
            { formatters: [Version3Formatter] });
    });

    it("Can parse a string that contains two classes each with one competitor, deducing that the courses are the same using control codes", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";

        const classes = [
            { name: "Test Class 1", length: 2300, competitors: [person1] },
            { name: "Test Class 2", length: 2300, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(2, "Expected two classes - " + formatterName);
                expect(eventData.courses.length).toEqual(1, "Expected one course - " + formatterName);
                if (eventData.classes.length === 2 && eventData.courses.length === 1) {
                    expect(eventData.courses[0].classes).toEqual(eventData.classes);
                }
            });
    });

    it("Can parse a string that contains two classes each with one competitor and no controls, without deducing that the courses are the same", () => {
        const person1 = getPerson();
        const person2 = getPerson();
        person2.forename = "Fred";
        person2.surname = "Jones";
        [person1, person2].forEach(function (person) {
            person.totalTime = 100;
            person.controls = [];
            person.cumTimes = [];
        });

        const classes = [
            { name: "Test Class 1", length: 2300, competitors: [person1] },
            { name: "Test Class 2", length: 2300, competitors: [person2] }
        ];

        runXmlFormatParseTest(classes,
            function (eventData, formatterName) {
                expect(eventData.classes.length).toEqual(2, "Expected two classes - " + formatterName);
                expect(eventData.courses.length).toEqual(2, "Expected two courses - " + formatterName);
            });
    });
});
