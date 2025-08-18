/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
// @ts-nocheck

/*
 *  SplitsBrowser - HTML reader tests.
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

import { } from "jasmine";
import { Competitor, CourseClass } from "../model";
import { parseHTMLEventData } from "./html-reader";

const parseEventData = parseHTMLEventData;

describe("Input.Html", () => {

    /**
    * Runs a test for parsing invalid data that should fail.
    * @param {String} invalidData - The invalid string to parse.
    * @param {String} what - Description of the invalid data.
    * @param {String} exceptionName - Optional name of the exception (defaults
    *     to InvalidData.
    */
    function runInvalidDataTest( invalidData: string, what?: string, exceptionName?: string) {
        try {
            parseEventData(invalidData);
            expect(false).toBe(true, "Should throw an exception for parsing " + what);
        } catch (e) {
            expect(e.name).toEqual(exceptionName || "InvalidData",  "Exception should have been InvalidData; message is " + e.message);
        }
    }

    /**
    * Asserts that a course has been parsed is as expected.
    *
    * The parameter expectedDetails is an object that contains the properties
    * name, length, climb, controls and classCount, with the last two being
    * optional.
    * @param {Course} actualCourse - The parsed course.
    * @param {Object} expectedDetails - The expected details.
    */
    function assertCourse( actualCourse, expectedDetails) {
        if (typeof expectedDetails === "undefined") {
            expect(false).toBe(true, "expectedDetails is not defined - have you forgotten the QUnit assert?");
        }

        expect(actualCourse.name).toEqual(expectedDetails.name);
        expect(actualCourse.length).toEqual(expectedDetails.length);
        expect(actualCourse.climb).toEqual(expectedDetails.climb);
        if (expectedDetails.hasOwnProperty("controls")) {
            expect(actualCourse.controls).toEqual(expectedDetails.controls);
        }
        if (expectedDetails.hasOwnProperty("classCount")) {
            expect(actualCourse.classes.length).toEqual(expectedDetails.classCount);
        }
    }

    /**
    * Asserts that a class has been parsed as expected.
    *
    * The parameter expectedDetails is an object that contains the properties
    * name, numControls, course and competitorCount.
    *
    * @param {CourseClass} actualClass - The parsed class.
    * @param {Object} expectedDetails - The expected details.
    */
    function assertCourseClass( actualClass: CourseClass, expectedDetails: any) {
        expect(actualClass.name).toEqual(expectedDetails.name);
        expect(actualClass.numControls).toEqual(expectedDetails.numControls);
        expect(actualClass.course).toEqual(expectedDetails.course);
        expect(actualClass.competitors.length).toEqual(expectedDetails.competitorCount);
    }

    /**
    * Asserts that a competitor has been parsed as expected.
    *
    * The parameter expectedDetails is an object that contains the properties
    * name, club, totalTime, cumTimes, splitTimes, isNonCompetitive, completed.
    * All seven are optional.
    *
    * @param {Competitor} actualCompetitor - The parsed competitor.
    * @param {Object} expectedDetails - The expected details.
    */
    function assertCompetitor( actualCompetitor: Competitor, expectedDetails: any) {
        const optionalProps = ["name", "club", "totalTime", "originalCumTimes", "originalSplitTimes", "isNonCompetitive", "isNonStarter", "isNonFinisher", "isDisqualified"];
        optionalProps.forEach(function (propName) {
            if (expectedDetails.hasOwnProperty(propName)) {
                expect(actualCompetitor[propName]).toEqual( expectedDetails[propName], "Should have correct value for property '" + propName + "'");
            }
        });

        if (expectedDetails.hasOwnProperty("completed")) {
            expect(actualCompetitor.completed()).toEqual(expectedDetails.completed);
        }
    }

    it("Cannot parse an empty string", () => {
        runInvalidDataTest( "", "an empty string", "WrongFileFormat");
    });

    it("Cannot parse a string that contains no HTML pre nor table tags", () => {
        runInvalidDataTest( "<html><head></head><body>blah blah blah</body></html>", "a string that contains no <pre> nor <table> tags", "WrongFileFormat");
    });

    it("Cannot parse a string that contains an HTML pre tag but no font tag", () => {
        runInvalidDataTest( "<html><head></head><body><pre>blah blah blah</pre></body></html>", "a string that contains a <pre> tag but no <font> tags", "WrongFileFormat");
    });

    // HTML generation.
    // Old-format (preformatted).

    /**
    * Wrap some text in some HTML for an old-format file
    * @param {String} contents - The contents to wrap.
    * @return {String} The contents wrapped up in HTML.
    */
    function cellOld(contents: string): string {
        return '<font size="2"><b>   ' + contents + '</b></font>';
    }

    /**
    * Returns an old-format course header line for a course with the given
    * name, length and climb.
    * @param {String} name - The name of the course.
    * @param {Number} length - The length of the course, in kilometres.
    * @param {Number} climb - The climb of the course, in metres.
    * @return {String} The created header line.
    */
    function getCourseHeaderLineOld(name: string, length: number, climb: number) {
        // The number is the number of competitors, which is ignored.
        let header = cellOld(name + " (2)");

        let secondCellContents = "";
        if (length !== null) {
            secondCellContents += length.toString() + " km";
        }

        secondCellContents += "     ";

        if (climb !== null) {
            secondCellContents += climb.toString() + " m";
        }

        header += cellOld(secondCellContents) + "
";
        return header;
    }

    /**
    * Returns a controls-line for an old-format course.
    * @param {Array} codes - Array of control codes.
    * @param {Number} offset - Control number offset.
    * @param {boolean} includeFinish - Whether to add the finish control.
    *     (The finish will always be specified as "F"; don't add a code to the
    *     codes array for this.)
    * @return {String} The created controls-line.
    */
    function getControlsLineOld(codes, offset, includeFinish) {
        let line = cellOld("") + cellOld("");
        line += line;

        for (let index = 0; index < codes.length; index += 1) {
            line += "   " + (index + 1 + offset) + "(" + codes[index] + ")  ";
        }

        if (includeFinish) {
            line += "  F  ";
        }

        line += "
";

        return line;
    }

    /**
    * Returns a pair of lines for one row competitor data in the old format.
    *
    * For a continuation line, pass empty strings for the position, name, start
    * number, club, class name and time.
    *
    * The arrays of cumulative and split times must have the same length.
    *
    * Each element in the array of extra controls should be an object
    * containing the properties cumTime and controlNum.  The parameter is
    * optional and can be omitted.
    *
    * @param {String|Number} posn - The position of the competitor.
    * @param {?String} startNum - The start number of the competitor, or
    *     null to skip the first column.
    * @param {String} name - The name of the competitor.
    * @param {String} club - The name of the competitor's club.
    * @param {boolean} useClasses - This parameter is not used.  It is
    *     specified only for compatibility with the other getCompetitorLines
    *     functions.
    * @param {String} className - The name of the competitor's class, or "" to
    *     default to course name.
    * @param {Number} time - The total time of the competitor.
    * @param {Array} cumTimes - Array of cumulative times, as strings.
    * @param {Array} splits - Array of split times, as strings.
    * @param {Array} extras - Optional array of extra splits times.
    * @return {String} Both lines concatenated together.
    */
    function getCompetitorLinesOld(posn: number,
                                startNum: string | null,
                                name: string,
                                club: string,
                                useClasses: boolean,
                                className: string,
                                time: string,
                                cumTimes: string[],
                                splits: string[],
                                extras?: any[]) {

        if (cumTimes.length !== splits.length) {
            throw new Error("Cumulative times and split times must have the same length");
        }

        let line1 = cellOld(posn.toString()) + ((startNum === null) ? "" : cellOld(startNum)) + cellOld(name) + className + cellOld(time);
        let line2 = cellOld("") + ((startNum === null) ? "" : cellOld("")) + cellOld(club) + cellOld("");

        for (let index = 0; index < cumTimes.length; index += 1) {
            const splitTime = (cumTimes[index] === "-----") ? "" : splits[index];
            if (index % 5 === 3) {
                line1 += "  " + cellOld(cumTimes[index]);
                line2 += "  " + cellOld(splitTime);
            } else {
                line1 += "  " + cumTimes[index] + "  ";
                line2 += "  " + splitTime + "  ";
            }
        }

        if (extras) {
            for (let index = 0; index < extras.length; index += 1) {
                line1 += " <i>  " + extras[index].cumTime + "  </i> ";
                line2 += " <i>  *" + extras[index].controlNum + " </i> ";
            }
        }

        return line1 + "
" + line2 + "
";
    }

    // New (tabular) format.

    /**
    * Wrap some text in some HTML for a new-format file
    * @param {String} contents - The contents to wrap.
    * @return {String} The contents wrapped up in HTML.
    */
    function cellNew(contents) {
        return '<td id=c12><nobr>   ' + contents + '</nobr></td>';
    }

    /**
    * Returns an new-format course header for a course with the given name,
    * length and climb.
    * @param {String} name - The name of the course.
    * @param {Number} length - The length of the course, in kilometres.
    * @param {Number} climb - The climb of the course, in metres.
    * @return {String} The created header line.
    */
    function getCourseHeaderNew(name, length, climb) {
        const header = '<table width=1105px>
<tbody>
<tr>' +
                     cellNew(name + " (21)") +
                     cellNew((length === null) ? "" : length + " Km") +
                     cellNew((climb === null) ? "" : climb + " m") +
                     '<td id="header" ></td>
</tr>
</tbody>
</table>
';
        return header;
    }

    /**
    * Returns a controls-line for a new-format course.
    * @param {Array} codes - Array of control codes.
    * @param {Number} offset - Control number offset.
    * @param {boolean} includeFinish - Whether to add the finish control.
    *     (The finish will always be specified as "F"; don't add a code to the
    *     codes array for this.)
    * @return {String} The created controls-line.
    */
    function getControlsLineNew(codes, offset, includeFinish) {
        let line = cellNew("") + cellNew("");
        line += line;

        for (let index = 0; index < codes.length; index += 1) {
            line += cellNew((index + 1 + offset) + "(" + codes[index] + ")  ");
        }

        if (includeFinish) {
            line += cellNew("F");
        }

        line = "<tr>" + line + "</tr>
";

        return line;
    }

    /**
    * Returns a pair of lines for one row competitor data in the new format.
    *
    * For a continuation line, pass empty strings for the position, name, start
    * number, club, class name and time.
    *
    * The arrays of cumulative and split times must have the same length.
    *
    * Each element in the array of extra controls should be an object
    * containing the properties cumTime and controlNum.  The parameter is
    * optional and can be omitted.
    *
    * @param {String|Number} posn - The position of the competitor.
    * @param {String} startNum - The start number of the competitor.
    * @param {String} name - The name of the competitor.
    * @param {String} club - The name of the competitor's club.
    * @param {boolean} useClasses - True to include a cell for the competitor's
    *     class name, false to default class name to course name.
    * @param {String} className - The name of the competitor's class, or "" to
    *     default to course name.
    * @param {Number} time - The total time of the competitor.
    * @param {Array} cumTimes - Array of cumulative times, as strings.
    * @param {Array} splits - Array of split times, as strings.
    * @param {Array} extras - Optional array of extra splits times.
    * @return {String} Both lines concatenated together.
    */
    function getCompetitorLinesNew(posn: string | number,
                                  startNum: string,
                                  name: string,
                                  club: string,
                                  useClasses: boolean,
                                  className: string,
                                  time: string,
                                  cumTimes: string[],
                                  splits: string[],
                                  extras?: any[]) {

        if (cumTimes.length !== splits.length) {
            throw new Error("Cumulative times and split times must have the same length");
        }

        let line1 = cellNew(posn) + ((startNum === null) ? "" : cellNew(startNum)) + cellNew(name) + ((useClasses) ? cellNew(className) : "") + cellNew(time);
        let line2 = cellNew("") + ((startNum === null) ? "" : cellNew("")) + cellNew(club) + ((useClasses) ? cellNew("") : "") + cellNew("");

        for (let index = 0; index < cumTimes.length; index += 1) {
            const splitTime = (cumTimes[index] === "-----") ? "" : splits[index];
            line1 += "  " + cellNew(cumTimes[index]);
            line2 += "  " + cellNew(splitTime);
        }

        if (extras) {
            for (let index = 0; index < extras.length; index += 1) {
                line1 += cellNew("") + cellNew("") + cellNew(" <i>  " + extras[index].cumTime + "  </i> ");
                line2 += cellNew("") + cellNew("") + cellNew(" <i>  *" + extras[index].controlNum + " </i> ");
            }
        }

        return "<tr>" + line1 + "</tr>
<tr>" + line2 + "</tr>
";
    }

    const NEW_FORMAT_DATA_HEADER = '<body>
<div id=reporttop>
<table width=1105px style="table-layout:auto;">
<tr><td><nobr>Event title</nobr></td><td id=rb><nobr>Sun 01/02/2013 12:34</nobr></td></tr>
</table>
<hr>
</div>
<table id=ln><tr><td>&nbsp</td></tr></table>
';

    const NEW_FORMAT_COURSE_HEADER_TABLE_CLASS = "<table width=1105px>
<col width=32px>
<col width=39px>
<col width=133px>
<thead>
<tr><th id=rb>Pl</th><th id=rb>Stno</th><th>Name</th><th>Cl.</th><th id=rb>Time</th><th id=rb></th><th id=rb></th></tr>
</thead><tbody></tbody></table>
";

    const NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS = "<table width=1105px>
<col width=32px>
<col width=39px>
<col width=133px>
<thead>
<tr><th id=rb>Pl</th><th id=rb>Stno</th><th>Name</th><th id=rb>Time</th><th id=rb></th><th id=rb></th></tr>
</thead><tbody></tbody></table>
";

    const NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS_NO_STARTNO = "<table width=1105px>
<col width=32px>
<col width=39px>
<col width=133px>
<thead>
<tr><th id=rb>Pl</th><th>Name</th><th id=rb>Time</th><th id=rb></th><th id=rb></th></tr>
</thead><tbody></tbody></table>
";

    const NEW_FORMAT_RESULTS_TABLE_HEADER = "<table width=1105px>
<col width=32px>
<col width=39px>
<col width=133px>
<tbody>
";

    // Separator used to separate the competitors that completed the course
    // from those that mispunched.
    const NEW_FORMAT_MID_TABLE_SEPARATOR = "<tr><td id=c10><nobr>&nbsp</nobr></td></tr>
";

    const NEW_FORMAT_COURSE_TABLE_FOOTER = NEW_FORMAT_MID_TABLE_SEPARATOR + NEW_FORMAT_MID_TABLE_SEPARATOR + "</tbody>
</table>
";

    const NEW_FORMAT_DATA_FOOTER = "</body>
</html>
";

    //  OEvent tabular format.

    const OEVENT_FORMAT_HEADER = '<html>
' +
                               '<head>
' +
                               '<META http-equiv="content-type" content="text/html" charset=utf-8>
' +
                               '<title>Title</title>
' +
                               '<STYLE type="text/css"></STYLE>
' +
                               '</head>
' +
                               '<body>
' +
                               '<table width="100%" class="header">
<tr><td>Title</td></tr>
</table>
' +
                               "<hr>
" +
                               "<table>
";

    /**
    * Returns a table cell in the OEvent tabular format.
    * @param {String} contents - The contents of the cell.
    * @return {String} The contents wrapped up in a table-data element.
    */
    function getCellOEventTabular(contents) {
        return "<td  align=\"right\">" + contents + "</td>";
    }

    /**
    * Returns a course header line for the OEvent tabular format.
    * @param {String} name - The name of the course.
    * @param {Number} length - The length of the course, in km.
    * @param {Number} climb - The climb of the course, in km.
    * @return {String} Course header line.
    */
    function getCourseHeaderOEventTabular(name, length, climb) {
        let contents;
        if (length === "" || climb === "") {
            contents = name;
        } else {
            const lengthInMetres = Math.round(length * 1000);
            contents = name + "    (" + lengthInMetres + "m, " + climb + "m)";
        }
        return "<tr class=\"clubName\"><td colspan=\"24\">" + contents + "</td></tr>
";
    }

    /**
    * Returns a line of the table that contains the controls.
    * @param {Array} codes - Array of control code strings.
    * @param {Number} offset - The offset to add to the control numbers.
    * @param {boolean} includeFinish - True to include the finish, false to
    *     not include it.
    * @return {String} Line of the table.
    */
    function getControlsLineOEventTabular(codes, offset, includeFinish) {
        const emptyCell = getCellOEventTabular("");
        let line = emptyCell + emptyCell + emptyCell + emptyCell;
        for (let index = 0; index < codes.length; index += 1) {
            line += getCellOEventTabular((index + 1 + offset) + "-" + codes[index]) + emptyCell;
        }

        if (includeFinish) {
            line += getCellOEventTabular("F") + emptyCell;
        }

        return "<tr>" + line + "</tr>
";
    }

    /**
    * Returns a pair of lines for one row competitor data in the OEvent tabular
    * format.
    *
    * For a continuation line, pass empty strings for the position, name, start
    * number, club, class name and time.
    *
    * The arrays of cumulative and split times must have the same length.
    *
    * Each element in the array of extra controls should be an object
    * containing the properties cumTime and controlNum.  The parameter is
    * optional and can be omitted.
    *
    * @param {String|Number} posn - The position of the competitor.
    * @param {String} startNum - The start number of the competitor.
    * @param {String} name - The name of the competitor.
    * @param {String} club - The name of the competitor's club.
    * @param {boolean} useClasses - True to include a table cell containing the
    *     class, false to not include the class name cell.
    * @param {String} className - The name of the competitor's class, or "" to
    *     default to course name.
    * @param {Number} time - The total time of the competitor.
    * @param {Array} cumTimes - Array of cumulative times, as strings.
    * @param {Array} splits - Array of split times, as strings.
    * @param {Array} extras - Optional array of extra splits times.
    * @return {String} Both lines concatenated together.
    */
    function getCompetitorLinesOEventTabular(posn, startNum, name, club, useClasses, className, time, cumTimes, splits, extras) {

        if (cumTimes.length !== splits.length) {
            throw new Error("Cumulative times and split times must have the same length");
        }

        const emptyCell = getCellOEventTabular("");
        const rankCell = getCellOEventTabular("(3)");

        let firstLine = "<tr>" + getCellOEventTabular((posn === "") ? "" : (posn + ".")) +
                                 getCellOEventTabular(startNum) +
                                 getCellOEventTabular(name);

        let secondLine = "<tr>" + emptyCell + emptyCell + getCellOEventTabular(club);

        if (useClasses) {
            firstLine += getCellOEventTabular(className);
            secondLine += emptyCell;
        }

        firstLine += getCellOEventTabular(time);
        secondLine += emptyCell;

        for (let index = 0; index < cumTimes.length; index += 1) {
            const splitTime = (cumTimes[index] === "-----") ? "" : splits[index];
            firstLine += getCellOEventTabular(cumTimes[index]) + ((cumTimes[index] === "-----") ? emptyCell : rankCell);
            secondLine += getCellOEventTabular(splitTime) + ((splitTime === "") ? emptyCell : rankCell);
        }

        if (extras) {
            for (let index = 0; index < extras.length; index += 1) {
                firstLine += getCellOEventTabular(extras[index].cumTime) + emptyCell;
                secondLine += getCellOEventTabular("*" + extras[index].controlNum) + emptyCell;
            }
        }

        firstLine += "</tr>
";
        secondLine += "</tr>
";
        return firstLine + secondLine;
    }

    const OLD_FORMAT = {
        name: "old format (preformatted)",
        header: "<html><head></head><body>
<pre>
<font>Dummy line</font>
",
        courseHeaderFunc: getCourseHeaderLineOld,
        tableHeaderNoClass: "",
        tableHeaderWithClass: "",
        controlsLineFunc: getControlsLineOld,
        competitorDataFunc: getCompetitorLinesOld,
        mispuncherSeparator: "",
        tableFooter: "",
        footer: "</pre></body></html>"
    };

    const NEW_FORMAT = {
        name: "new format (tabular)",
        header: NEW_FORMAT_DATA_HEADER,
        courseHeaderFunc: getCourseHeaderNew,
        tableHeaderNoClass: NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER,
        tableHeaderWithClass: NEW_FORMAT_COURSE_HEADER_TABLE_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER,
        controlsLineFunc: getControlsLineNew,
        competitorDataFunc: getCompetitorLinesNew,
        mispuncherSeparator: NEW_FORMAT_MID_TABLE_SEPARATOR,
        tableFooter: NEW_FORMAT_MID_TABLE_SEPARATOR + NEW_FORMAT_MID_TABLE_SEPARATOR + "</tbody>
</table>
",
        footer: "</body>
</html>
"
    };

    const OEVENT_FORMAT = {
        name: "OEvent tabular format",
        header: OEVENT_FORMAT_HEADER,
        courseHeaderFunc: getCourseHeaderOEventTabular,
        tableHeaderNoClass: "<tr><td colspan=\"24\">&nbsp;</td></tr>
",
        tableHeaderWithClass: "<tr><td colspan=\"25\">&nbsp;</td></tr>
",
        controlsLineFunc: getControlsLineOEventTabular,
        competitorDataFunc: getCompetitorLinesOEventTabular,
        mispuncherSeparator: "",
        tableFooter: "",
        footer: "</table>
</body>
</html>"
    };

    const ALL_TEMPLATES = [OLD_FORMAT, NEW_FORMAT, OEVENT_FORMAT];

    /**
    * Generates HTML from a template and a list of course data.
    *
    * Each course object within the courses array should contain the following:
    * * headerDetails: Array of arguments for header generation function.
    * * controlLines: Array of arrays of control codes, one sub-array per row.
    * * competitors: Array of arrays of data for each competitor.
    * @param {Object} template - The template object that details how to
    *                            construct an HTML file of a given format.
    * @param {Array} courses - Array of course data objects.
    * @param {boolean} useClasses - True to use classes, false not to.
    * @return {String} Created HTML.
    */
    function getHtmlFromTemplate(template, courses, useClasses) {
        let html = template.header;
        courses.forEach(function (course) {
            html += template.courseHeaderFunc.apply(null, course.headerDetails);
            html += (useClasses) ? template.tableHeaderWithClass : template.tableHeaderNoClass;

            let offset = 0;
            course.controlsLines.forEach(function (controlLine, index) {
                const includeFinish = (index + 1 === course.controlsLines.length);
                html += template.controlsLineFunc(controlLine, offset, includeFinish);
                offset += controlLine.length;
            });

            course.competitors.forEach(function (competitor) {
                html += template.competitorDataFunc.apply(null, competitor);
            });

            html += template.tableFooter;
        });

        html += template.footer;
        return html;
    }

    /**
    * Generates HTML using each available template, parses the resulting HTML,
    * and calls the given checking function on the result.
    *
    * The options supported are:
    * * useClasses (boolean): True to use class names separate from course
    *       names, false otherwise.  Defaults to false.
    * * preprocessor (Function): Function used to preprocess the
    *       HTML before it is parsed.  Defaults to no preprocessing.
    * * templates (Array): Array of templates to use with this parser.
    *       Defaults to all templates.
    * If none of the above three options are required, the options object
    * itself can be omitted.
    *
    * @param {Array} courses - Array of course objects to generate the HTML
    *                          using.
    * @param {Function} checkFunc - Checking function called for each parsed
    *                               event data object.  It is passed the data,
    *                               and also the name of the template used.
    * @param {Object} options - Options object, the contents of which are
    *     described above.
    */
    function runHtmlFormatParseTest(courses: Course[], checkFunc, options?) {
        const useClasses = (options && options.useClasses) || false;
        const templates = (options && options.templates) || ALL_TEMPLATES;
        templates.forEach(function (template) {
            let html = getHtmlFromTemplate(template, courses, useClasses);
            if (options && options.preprocessor) {
                html = options.preprocessor(html);
            }
            const eventData = parseEventData(html);
            checkFunc(eventData, template.name);
        });
    }

    /**
    * Generates HTML using each available template, attempts to parse each
    * generated HTML string and asserts that each attempt fails.
    * @param {QUnit.assert} assert - QUnit assert object.
    * @param {Array} courses - Array of course objects to generate the HTML
    *                          using.
    * @param {boolean} useClasses - True to use classes, false not to.
    */
    function runFailingHtmlFormatParseTest( courses, useClasses) {
        ALL_TEMPLATES.forEach(function (template) {
            const html = getHtmlFromTemplate(template, courses, useClasses);
            runInvalidDataTest( html, "invalid data - " + template.name);
        });
    }

    it("Cannot parse an empty event in any format", () => {
        runFailingHtmlFormatParseTest( [], false);
    });

    it("Can parse an event with an empty course in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(0,  "No classes should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141"]});
            });
    });

    it("Can parse an event with an empty course and non-numeric control code in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "ABC152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(0,  "No classes should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "ABC152", "141"]});
            });
    });

    it("Can parse an event with an empty course with length but no climb in two formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", ""], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: 2.7, climb: null});
            },
            // Don't run this on the OEvent format, it only supports both
            // length and climb, or neither.
            {templates: [OLD_FORMAT, NEW_FORMAT]});
    });

    it("Can parse an event with an empty course with length with comma as the decimal separator in two formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2,7", ""], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: 2.7, climb: null});
            },
            // Don't run this on the OEvent format, as lengths are in metres
            // and are never comma-separated.
            {templates: [OLD_FORMAT, NEW_FORMAT]});
    });

    it("Can parse an event with an empty course with length specified in metres in two formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2700", ""], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: 2.7, climb: null});
            },
            // Don't run this on the OEvent format as lengths are already in
            // metres.
            {templates: [OLD_FORMAT, NEW_FORMAT]});
    });

    it("Can parse an event with an empty course with climb but no length in two formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "", "35"], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: null, climb: 35});
            },
            // Don't run this on the OEvent format, it only supports both
            // length and climb, or neither.
            {templates: [OLD_FORMAT, NEW_FORMAT]});
    });

    it("Can parse an event with an empty course with no climb nor length in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "", ""], controlsLines: [["138", "152", "141"]], competitors: []}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                assertCourse( eventData.courses[0], {name: "Test course 1", length: null, climb: null});
            });
    });

    it("Can parse event data with a single course and single competitor in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 3, course: eventData.courses[0], competitorCount: 1});

                const competitor = courseClass.competitors[0];
                assertCompetitor( competitor, {name: "Test runner", club: "TEST", totalTime: 9 * 60 + 25,
                                                      originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25],
                                                      originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12],
                                                      isNonCompetitive: false, completed: true,
                                                      isNonStarter: false, isNonFinisher: false, isDisqualified: false});

                const course = eventData.courses[0];
                assertCourse( course, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141"], classCount: 1});
                expect(course.classes[0]).toEqual(courseClass);
            });
    });

    it("Can parse event data with a single course and single non-starting competitor with no split times in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "dns", [], []]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 3, course: eventData.courses[0], competitorCount: 1});

                const competitor = courseClass.competitors[0];
                assertCompetitor( competitor, {name: "Test runner", club: "TEST", totalTime: null,
                                                      originalCumTimes: [0, null, null, null, null],
                                                      originalSplitTimes: [null, null, null, null],
                                                      isNonCompetitive: false, completed: false,
                                                      isNonStarter: true, isNonFinisher: false, isDisqualified: false});
            });
    });

    it("Can parse event data with a single course and single competitor with negative split in the old format only", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "03:57", "09:25"], ["01:47", "02:15", "", "05:28"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 3, course: eventData.courses[0], competitorCount: 1});

                const competitor = courseClass.competitors[0];
                assertCompetitor( competitor, {name: "Test runner", club: "TEST", totalTime: 9 * 60 + 25,
                                                      originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 3 * 60 + 57, 9 * 60 + 25],
                                                      originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, -5, 5 * 60 + 28],
                                                      isNonCompetitive: false, completed: true});

                const course = eventData.courses[0];
                assertCourse( course, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141"], classCount: 1});
                expect(course.classes[0]).toEqual(courseClass);
            },
            {templates: [OLD_FORMAT]});
    });

    it("Can parse event data with a single course and single competitor with plenty of blank lines in the old format only", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "03:57", "09:25"], ["01:47", "02:15", "", "05:28"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 3, course: eventData.courses[0], competitorCount: 1});
            },
            {
                templates: [OLD_FORMAT],
                preprocessor: function (html) {
                    // Six newlines (the length of the closing tag) should be enough
                    // to trigger the bug that caused this.
                    return html.replace("</pre>", "





</pre>
");
                }
            });
    });

    it("Can parse event data with a single course and single competitor in a different class in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", true, "Class1", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                expect(eventData.classes[0].name).toEqual("Class1");
            },
            {useClasses: true});
    });

    it("Can parse event data with a single course and single competitor ignoring extra controls in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"],
                    [{cumTime: "03:31", controlNum: "151"}, {cumTime: "08:44", controlNum: "133"}]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 3, course: eventData.courses[0], competitorCount: 1});

                const competitor = courseClass.competitors[0];
                assertCompetitor( competitor, {name: "Test runner", club: "TEST", totalTime: 9 * 60 + 25,
                                                      originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25],
                                                      originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12],
                                                      isNonCompetitive: false, completed: true});

                const course = eventData.courses[0];
                assertCourse( course, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141"], classCount: 1});
                expect(course.classes[0]).toEqual(courseClass);
            });
    });

    // The zero split time with a decimal point turns up in event 6752.
    it("Can parse event data with a single course and single competitor ignoring extra control with invalid cumulative time in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"],
                    [{cumTime: "0.00", controlNum: "133"}]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
            });
    });

    it("Can parse event data with a single course and two competitors in the same class in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner 1", "TEST", true, "Class1", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]],
                ["2", "184", "Test runner 2", "ABCD", true, "Class1", "09:59", ["01:52", "04:05", "08:40", "09:59"], ["01:52", "02:13", "04:35", "01:19"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Class1", numControls: 3, course: eventData.courses[0], competitorCount: 2});

                assertCompetitor( courseClass.competitors[0], {name: "Test runner 1", club: "TEST", totalTime: 9 * 60 + 25});
                assertCompetitor( courseClass.competitors[1], {name: "Test runner 2", club: "ABCD", totalTime: 9 * 60 + 59});

                expect(eventData.courses[0].name).toEqual("Test course 1");
            },
            {useClasses: true});
    });

    it("Can parse event data with a single course and two competitors in different classes in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner 1", "TEST", true, "Class1", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]],
                ["2", "184", "Test runner 2", "ABCD", true, "Class2", "09:59", ["01:52", "04:05", "08:40", "09:59"], ["01:52", "02:13", "04:35", "01:19"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(2,  "Two classes should have been read - " + formatName);

                const course = eventData.courses[0];
                expect(course.name).toEqual("Test course 1");

                const courseClass1 = eventData.classes[0];
                assertCourseClass( courseClass1, {name: "Class1", numControls: 3, course: course, competitorCount: 1});

                const courseClass2 = eventData.classes[1];
                assertCourseClass( courseClass2, {name: "Class2", numControls: 3, course: course, competitorCount: 1});

                assertCompetitor( courseClass1.competitors[0], {name: "Test runner 1", club: "TEST", totalTime: 9 * 60 + 25});
                assertCompetitor( courseClass2.competitors[0], {name: "Test runner 2", club: "ABCD", totalTime: 9 * 60 + 59});
            },
            {useClasses: true});
    });

    it("Can parse event data with two courses and two competitors in different classes in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner 1", "TEST", true, "Class1", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]},
            {headerDetails: ["Test course 2", "2.4", "30"], controlsLines: [["132", "143", "139"]], competitors: [
                ["1", "184", "Test runner 2", "ABCD", true, "Class2", "09:59", ["01:52", "04:05", "08:40", "09:59"], ["01:52", "02:13", "04:35", "01:19"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(2,  "Two classes should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(2,  "Two classes should have been read - " + formatName);

                const course1 = eventData.courses[0];
                assertCourse( course1, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141"]});

                const course2 = eventData.courses[1];
                assertCourse( course2, {name: "Test course 2", length: 2.4, climb: 30, controls: ["132", "143", "139"]});

                const courseClass1 = eventData.classes[0];
                assertCourseClass( courseClass1, {name: "Class1", numControls: 3, course: course1, competitorCount: 1});

                const courseClass2 = eventData.classes[1];
                assertCourseClass( courseClass2, {name: "Class2", numControls: 3, course: course2, competitorCount: 1});

                expect(courseClass1.competitors[0].name).toEqual("Test runner 1");
                expect(courseClass2.competitors[0].name).toEqual("Test runner 2");
            },
            {useClasses: true});
    });

    it("Can parse event data with a two competitors in the same class but different course using course names in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner 1", "TEST", true, "Class1", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]},
            {headerDetails: ["Test course 2", "2.7", "35"], controlsLines: [["141", "150", "145"]], competitors: [
                ["2", "184", "Test runner 2", "ABCD", true, "Class1", "09:59", ["01:52", "04:05", "08:40", "09:59"], ["01:52", "02:13", "04:35", "01:19"]]
            ]}],
            function (eventData, formatName) {
                // As the class is shared across courses, it cannot be used, so
                // class names should fall back to course names.
                expect(eventData.classes.length).toEqual(2,  "Two classes should have been read - " + formatName);
                expect(eventData.classes[0].name).toEqual("Test course 1");
                expect(eventData.classes[1].name).toEqual("Test course 2");
            },
            {useClasses: true});
    });

    it("Can parse event data with a single course and single competitor with CRLF line endings in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                expect(eventData.classes[0].competitors.length).toEqual(1);
                expect(eventData.courses[0].classes.length).toEqual(1);
            },
            {preprocessor: function (html) { return html.replace(/
/g, "
"); }});
    });

    it("Can parse event data with a single course and single competitor with doubled line endings in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                expect(eventData.classes[0].competitors.length).toEqual(1);
                expect(eventData.courses[0].classes.length).toEqual(1);
            },
            {preprocessor: function (html) { return html.replace(/
/g, "

"); }}
        );
    });

    it("Can parse event data with a single course and single competitor with CR line endings in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                expect(eventData.classes[0].competitors.length).toEqual(1);
                expect(eventData.courses[0].classes.length).toEqual(1);
            },
            {preprocessor: function (html) { return html.replace(/
/g, ""); }});
    });

    it("Can parse event data with a single course and single mispunching competitor in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "-----", "09:25"], ["01:47", "02:15", "-----", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                const courseClass = eventData.classes[0];
                expect(courseClass.competitors.length).toEqual(1);
                assertCompetitor( courseClass.competitors[0], {totalTime: null,
                                                                   originalCumTimes: [0, 1 * 60 + 47, 4 * 60 + 2, null, 9 * 60 + 25],
                                                                   originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, null, null],
                                                                   isNonCompetitive: false, completed: false});
            });
    });

    it("Can parse event data with a single course and single mispunching competitor with missing cumulative split for the finish in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["", "165", "Test runner", "TEST", false, "", "mp", ["01:47", "04:02", "-----"], ["01:47", "02:15", "-----"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                const courseClass = eventData.classes[0];
                expect(courseClass.competitors.length).toEqual(1);
                assertCompetitor( courseClass.competitors[0], {totalTime: null,
                                                                   originalCumTimes: [0, 1 * 60 + 47, 4 * 60 + 2, null, null],
                                                                   originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, null, null],
                                                                   isNonCompetitive: false, completed: false});
            });
    });

    it("Can parse event data with a single course and single non-competitive competitor in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["", "165", "Test runner", "TEST", false, "", "n/c", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                const courseClass = eventData.classes[0];
                expect(courseClass.competitors.length).toEqual(1);
                assertCompetitor( courseClass.competitors[0], {totalTime: 9 * 60 + 25,
                                                                   originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25],
                                                                   originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12],
                                                                   isNonCompetitive: true, completed: true,
                                                                   isNonStarter: false, isNonFinisher: false, isDisqualified: false});
            });
    });

    it("Can parse event data with a single course and single non-starting competitor in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["", "165", "Test runner", "TEST", false, "", "", ["-----", "-----", "-----", "-----"], ["-----", "-----", "-----", "-----"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);
                const courseClass = eventData.classes[0];
                expect(courseClass.competitors.length).toEqual(1);
                assertCompetitor( courseClass.competitors[0], {totalTime: null,
                                                                   originalCumTimes: [0, null, null, null, null],
                                                                   originalSplitTimes: [null, null, null, null],
                                                                   isNonCompetitive: false, completed: false,
                                                                   isNonStarter: true, isNonFinisher: false, isDisqualified: false});
            });
    });

    it("Can parse event data with a single course and single competitor with 2 lines' worth of controls in all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"], ["140", "154"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "12:12", ["01:47", "04:02", "08:13"], ["01:47", "02:15", "04:11"]],
                ["", "", "", "", false, "", "", ["09:25", "11:09", "12:12"], ["01:12", "01:44", "01:03"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Test course 1", numControls: 5, course: eventData.courses[0], competitorCount: 1});

                assertCompetitor( courseClass.competitors[0], {name: "Test runner", club: "TEST", totalTime: 12 * 60 + 12,
                                                                   originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25, 11 * 60 + 9, 12 * 60 + 12],
                                                                   originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12, 1 * 60 + 44, 1 * 60 + 3],
                                                                   isNonCompetitive: false, completed: true});

                const course = eventData.courses[0];
                assertCourse( course, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141", "140", "154"], classCount: 1});
                expect(course.classes[0]).toEqual(courseClass);
            });
    });

    it("Can parse event data with a single course and single competitor with separate class name and 2 lines' worth of controls in the all formats", () => {
        runHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"], ["140", "154"]], competitors: [
                ["1", "165", "Test runner", "TEST", true, "Class1", "12:12", ["01:47", "04:02", "08:13"], ["01:47", "02:15", "04:11"]],
                ["", "", "", "", true, "", "", ["09:25", "11:09", "12:12"], ["01:12", "01:44", "01:03"]]
            ]}],
            function (eventData, formatName) {
                expect(eventData.courses.length).toEqual(1,  "One course should have been read - " + formatName);
                expect(eventData.classes.length).toEqual(1,  "One class should have been read - " + formatName);

                const courseClass = eventData.classes[0];
                assertCourseClass( courseClass, {name: "Class1", numControls: 5, course: eventData.courses[0], competitorCount: 1});

                assertCompetitor( courseClass.competitors[0], {name: "Test runner", club: "TEST", totalTime: 12 * 60 + 12,
                                                                   originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25, 11 * 60 + 9, 12 * 60 + 12],
                                                                   originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12, 1 * 60 + 44, 1 * 60 + 3],
                                                                   isNonCompetitive: false, completed: true});

                const course = eventData.courses[0];
                assertCourse( course, {name: "Test course 1", length: 2.7, climb: 35, controls: ["138", "152", "141", "140", "154"], classCount: 1});
                expect(course.classes[0]).toEqual(courseClass);
            },
            {useClasses: true});
    });

    it("Cannot parse event data in each format where the competitor has the wrong number of cumulative times", () => {
        runFailingHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"], ["140", "154"]], competitors: [
                ["1", "165", "Test runner", "TEST", false, "", "12:12", ["01:47", "04:02", "08:13"], ["01:47", "02:15", "04:11"]]
            ]}],
            false);
    });

    it("Cannot parse event data in each format where the first row of competitor details are all blank", () => {
        runFailingHtmlFormatParseTest(
            [{headerDetails: ["Test course 1", "2.7", "35"], controlsLines: [["138", "152", "141"]], competitors: [
                ["", "", "", "", false, "", "", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]]
            ]}],
            false);
    });

    // Format-specific tests.

    it("Cannot parse a string that contains an opening pre tag but no closing pre tag", () => {
        runInvalidDataTest( "<html><head></head><body>
<pre>
<font>blah blah blah</font>
</body></html>", "a string that contains <pre> but not </pre>", "InvalidData");
    });

    it("Cannot read event data without any closing table elements", () => {
        const html = NEW_FORMAT_DATA_HEADER.replace(/<\/table>/g, "") + "<table><table><table>" + NEW_FORMAT_DATA_FOOTER;
        runInvalidDataTest( html, "no closing-table elements");
    });

    // Format-specific as handles a quirk of the old format.
    it("Can parse event data with a single course and single valid competitor with no start number", () => {
        const html = OLD_FORMAT.header +
                   getCourseHeaderLineOld("Test course 1", 2.7, 35) +
                   getControlsLineOld(["138", "152", "141"], 0, true) +
                   getCompetitorLinesOld(1, null, "Test runner 1", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) +
                   OLD_FORMAT.footer;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        const courseClass = eventData.classes[0];
        expect(courseClass.competitors.length).toEqual(1,  "One competitor should should have been read");
        assertCompetitor( courseClass.competitors[0], {name: "Test runner 1", totalTime: 9 * 60 + 25,
                                                           originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, 8 * 60 + 13, 9 * 60 + 25],
                                                           originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, 4 * 60 + 11, 1 * 60 + 12],
                                                           isNonCompetitive: false, completed: true});
    });

    // Needs to remain format-specific as the newlines can only be inserted at specific locations.
    it("Can parse event data with a single course and single competitor with extra blank lines in the old format", () => {
        const html = "<html><head></head><body>
<pre>


" +
                   getCourseHeaderLineOld("Test course 1", 2.7, 35) + "
" +
                   getControlsLineOld(["138", "152", "141"], 0, true) + "





" +
                   getCompetitorLinesOld(1, "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) + "


" +
                   "</pre></body></html>



";
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        expect(eventData.classes[0].competitors.length).toEqual(1);
        expect(eventData.courses[0].classes.length).toEqual(1);
    });

    it("Can parse event data with a single course and single competitor with extra blank lines in the new format", () => {
        const html = NEW_FORMAT_DATA_HEADER +
                   getCourseHeaderNew("Test course 1", "2.7", "35") + "
" +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) + "





" +
                   getCompetitorLinesNew("1", "165", "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) + "


" +
                   NEW_FORMAT_COURSE_TABLE_FOOTER + NEW_FORMAT_DATA_FOOTER;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        expect(eventData.classes[0].competitors.length).toEqual(1);
        expect(eventData.courses[0].classes.length).toEqual(1);
    });

    // Needs to remain format-specific as the string manipulation is format-specific.
    it("Cannot parse event data in the old format where the second line of a competitor is missing", () => {
        let html = "<html><head></head><body>
<pre>
" +
                   getCourseHeaderLineOld("Test course 1", 2.7, 35) +
                   getControlsLineOld(["138", "152", "141"], 0, true) +
                   getCompetitorLinesOld(1, "165", "Test runner", "TEST0123", false, "", "12:12", ["01:47", "04:02", "08:13"], ["01:47", "02:15", "04:11"]);

        const clubIndex = html.indexOf("TEST0123");
        const lastNewlineIndex = html.lastIndexOf("
", clubIndex);
        html = html.substring(0, lastNewlineIndex) + "
</pre></body></html>";
        runInvalidDataTest( html, "data with a missing second line of competitor data");
    });

    it("Cannot parse event data in the new format where the second line of a competitor is missing", () => {
        let html = NEW_FORMAT_DATA_HEADER +
                   getCourseHeaderNew("Test course 1", "2.7", "35") +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) +
                   getCompetitorLinesNew("1", "165", "Test runner", "TEST0123", false, "", "12:12", ["01:47", "04:02", "08:13"], ["01:47", "02:15", "04:11"]);

        const clubIndex = html.indexOf("TEST0123");
        const lastNewlineIndex = html.lastIndexOf("
", clubIndex);
        html = html.substring(0, lastNewlineIndex) + NEW_FORMAT_COURSE_TABLE_FOOTER + NEW_FORMAT_DATA_FOOTER;
        runInvalidDataTest( html, "data with a missing second line of competitor data");
    });

    it("Can parse event data with a single course and single valid and single mispunching competitor with mid-table separator", () => {
        const html = NEW_FORMAT_DATA_HEADER +
                   getCourseHeaderNew("Test course 1", "2.7", "35") +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) +
                   getCompetitorLinesNew("1", "165", "Test runner 1", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) +
                   NEW_FORMAT_MID_TABLE_SEPARATOR +
                   getCompetitorLinesNew("", "182", "Test runner 2", "ABCD", false, "", "mp", ["01:47", "04:02", "-----"], ["01:47", "02:15", "-----"]) +
                   NEW_FORMAT_COURSE_TABLE_FOOTER + NEW_FORMAT_DATA_FOOTER;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        const courseClass = eventData.classes[0];
        expect(courseClass.competitors.length).toEqual(2,  "Two competitors should should have been read");
        assertCompetitor( courseClass.competitors[1], {name: "Test runner 2", totalTime: null,
                                                           originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, null, null],
                                                           originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, null, null],
                                                           isNonCompetitive: false, completed: false});
    });

    it("Can parse event data with a single course and single valid and single mispunching competitor with corrected mid-table separator", () => {
        const html = NEW_FORMAT_DATA_HEADER +
                   getCourseHeaderNew("Test course 1", "2.7", "35") +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) +
                   getCompetitorLinesNew("1", "165", "Test runner 1", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) +
                   NEW_FORMAT_MID_TABLE_SEPARATOR.replace(/&nbsp/g, "&nbsp;") +
                   getCompetitorLinesNew("", "165", "Test runner 2", "ABCD", false, "", "mp", ["01:47", "04:02", "-----"], ["01:47", "02:15", "-----"]) +
                   NEW_FORMAT_COURSE_TABLE_FOOTER + NEW_FORMAT_DATA_FOOTER;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        const courseClass = eventData.classes[0];
        expect(courseClass.competitors.length).toEqual(2,  "Two competitors should should have been read");
        assertCompetitor( courseClass.competitors[1], {name: "Test runner 2", totalTime: null,
                                                           originalCumTimes: [0, 1 * 60 + 47, 4 * 60 +  2, null, null],
                                                           originalSplitTimes: [1 * 60 + 47, 2 * 60 + 15, null, null],
                                                           isNonCompetitive: false, completed: false});
    });

    it("Can parse event data with two courses and navigation elements", () => {
        const html = NEW_FORMAT_DATA_HEADER +
                   "<a id=\"1\"></a>" +
                   getCourseHeaderNew("Test course 1", "2.7", "35") +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) +
                   getCompetitorLinesNew("1", "165", "Test runner 1", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) +
                   NEW_FORMAT_COURSE_TABLE_FOOTER +
                   "<a id=\"2\"></a>" +
                   getCourseHeaderNew("Test course 2", "2.7", "35") +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["164", "107", "133"], 0, true) +
                   getCompetitorLinesNew("", "165", "Test runner 2", "ABCD", false, "", "09:58", ["01:47", "04:02", "05:27", "09:58"], ["01:47", "02:15", "01:25", "04:31"]) +
                   NEW_FORMAT_COURSE_TABLE_FOOTER +
                   "<div id=\"navigation\">
<table>
" +
                   "<tr>
<td>etc. etc. etc.</td>
</tr>
" +
                   "</table>
</div>
" +
                   NEW_FORMAT_DATA_FOOTER;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(2,  "Two courses should have been read");
        expect(eventData.classes.length).toEqual(2,  "Two classes should have been read");
        expect(eventData.classes[0].competitors.length).toEqual(1,  "One competitor should should have been read for course 1");
        expect(eventData.classes[1].competitors.length).toEqual(1,  "One competitor should should have been read for course 2");
    });

    it("Can parse event data in new-format with no start numbers", () => {
        const html = NEW_FORMAT_DATA_HEADER +
                   getCourseHeaderNew("Test course 1", "2.7", "35") + "
" +
                   NEW_FORMAT_COURSE_HEADER_TABLE_NO_CLASS_NO_STARTNO + NEW_FORMAT_RESULTS_TABLE_HEADER +
                   getControlsLineNew(["138", "152", "141"], 0, true) + "





" +
                   getCompetitorLinesNew("1", null, "Test runner", "TEST", false, "", "09:25", ["01:47", "04:02", "08:13", "09:25"], ["01:47", "02:15", "04:11", "01:12"]) + "


" +
                   NEW_FORMAT_COURSE_TABLE_FOOTER + NEW_FORMAT_DATA_FOOTER;
        const eventData = parseEventData(html);
        expect(eventData.courses.length).toEqual(1,  "One course should have been read");
        expect(eventData.classes.length).toEqual(1,  "One class should have been read");
        expect(eventData.classes[0].competitors.length).toEqual(1);
        expect(eventData.classes[0].competitors[0].name).toEqual("Test runner");
        expect(eventData.classes[0].competitors[0].club).toEqual("TEST");
        expect(eventData.courses[0].classes.length).toEqual(1);
    });
});
