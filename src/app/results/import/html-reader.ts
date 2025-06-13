
import { Competitor, Course, CourseClass, InvalidData, Results, sbTime, TimeUtilities, WrongFileFormat } from "../model";
import { isNotNull } from "../model/results_util";
import { normaliseLineEndings, parseCourseLength } from "./util";

const parseTime = TimeUtilities.parseTime;

type RecogniserClass = OldHtmlFormatRecognizer | NewHtmlFormatRecognizer | OEventTabularHtmlFormatRecognizer;

// Regexps to help with parsing.
const HTML_TAG_STRIP_REGEXP = /<[^>]+>/g;
const DISTANCE_FIND_REGEXP = /([0-9.,]+)\s*(?:Km|km)/;
const CLIMB_FIND_REGEXP = /(\d+)\s*(?:Cm|Hm|hm|m)/;

/**
* Returns whether the given string is nonempty.
* @sb-param {String} string - The string to check.
* @sb-return True if the string is neither null nor empty, false if it is null or empty.
*/
function isNonEmpty(string: string): boolean {
    return string !== null && string !== "";
}

/**
* Returns whether the given string contains a number.  The string is
* considered to contain a number if, after stripping whitespace, the string
* is not empty and calling isFinite on it returns true.
* @sb-param {String} string - The string to test.
* @sb-return True if the string contains a number, false if not.
*/
function hasNumber(string: string): boolean {
    string = string.trim();
    // isFinite is not enough on its own: isFinite("") is true.
    return string !== "" && isFinite(+string);
}

/**
* Splits a line by whitespace.
* @sb-param {String} line - The line to split.
* @sb-return {Array} Array of whitespace-separated strings.
*/
function splitByWhitespace(line: string): Array<string> {
    return line.split(/\s+/g).filter(isNonEmpty);
}

/**
* Strips all HTML tags from a string and returns the remaining string.
* @sb-param {String} text - The HTML string to strip tags from.
* @sb-return {String} The input string with HTML tags removed.
*/
function stripHtml(text: string): string {
    return text.replace(HTML_TAG_STRIP_REGEXP, "");
}

/**
* Returns all matches of the given regexp within the given text,
* after being stripped of HTML.
*
* Note that it is recommended to pass this function a new regular
* expression each time, rather than using a precompiled regexp.
*
* @sb-param {RegExp} regexp - The regular expression to find all matches of.
* @sb-param {String} text - The text to search for matches within.
* @sb-return {Array} Array of strings representing the HTML-stripped regexp
*     matches.
*/
function getHtmlStrippedRegexMatches(regexp: RegExp, text: string): Array<string> {
    const matches = [];
    let match;
    while (true) {
        match = regexp.exec(text);
        if (match === null) {
            break;
        } else {
            matches.push(stripHtml(match[1]));
        }
    }

    return matches;
}

/**
* Returns the contents of all <font> ... </font> elements within the given
* text.  The contents of the <font> elements are stripped of all other HTML
* tags.
* @sb-param {String} text - The HTML string containing the <font> elements.
* @sb-return {Array} Array of strings of text inside <font> elements.
*/
function getFontBits(text: string): string[] {
    return getHtmlStrippedRegexMatches(/<font[^>]*>(.*?)<\/font>/g, text);
}

/**
* Returns the contents of all <td> ... </td> elements within the given
* text.  The contents of the <td> elements are stripped of all other HTML
* tags.
* @sb-param {String} text - The HTML string containing the <td> elements.
* @sb-return {Array} Array of strings of text inside <td> elements.
*/
function getTableDataBits(text: string): string[] {
    return getHtmlStrippedRegexMatches(/<td[^>]*>(.*?)<\/td>/g, text).map((s) => s.trim());
}

/**
* Returns the contents of all <td> ... </td> elements within the given
* text.  The contents of the <td> elements are stripped of all other HTML
* tags.  Empty matches are removed.
* @sb-param {String} text - The HTML string containing the <td> elements.
* @sb-return {Array} Array of strings of text inside <td> elements.
*/
function getNonEmptyTableDataBits(text: string): string[] {
    return getTableDataBits(text).filter((bit) => bit !== "");
}

/**
* Returns the contents of all <th> ... </th> elements within the given
* text.  The contents of the <th> elements are stripped of all other HTML
* tags.  Empty matches are removed.
* @sb-param {String} text - The HTML string containing the <td> elements.
* @sb-return {Array} Array of strings of text inside <td> elements.
*/
function getNonEmptyTableHeaderBits(text: string): string[] {
    const matches = getHtmlStrippedRegexMatches(/<th[^>]*>(.*?)<\/th>/g, text);
    return matches.filter((bit) => bit !== "");
}

/**
* Attempts to read a course distance from the given string.
* @sb-param {String} text - The text string to read a course distance from.
* @sb-return {?Number} - The parsed course distance, or null if no
*     distance could be parsed.
*/
function tryReadDistance(text: string): number | null {
    const distanceMatch = DISTANCE_FIND_REGEXP.exec(text);
    if (distanceMatch === null) {
        return null;
    } else {
        return parseCourseLength(distanceMatch[1]);
    }
}

/**
* Attempts to read a course climb from the given string.
* @sb-param {String} text - The text string to read a course climb from.
* @sb-return {?Number} - The parsed course climb, or null if no climb
*     could be parsed.
*/
function tryReadClimb(text: string): number | null {
    const climbMatch = CLIMB_FIND_REGEXP.exec(text);
    if (climbMatch === null) {
        return null;
    } else {
        return parseInt(climbMatch[1], 10);
    }
}

/**
* Reads control codes from an array of strings.  Each code should be of the
* form num(code), with the exception of the finish, which, if it appears,
* should contain no parentheses and must be the last.  The finish is
* returned as null.
* @sb-param {Array} labels - Array of string labels.
* @sb-return {Array} Array of control codes, with null indicating the finish.
*/
function readControlCodes(labels: string[]) {
    const controlCodes = [];
    for (let labelIdx = 0; labelIdx < labels.length; labelIdx += 1) {
        const label = labels[labelIdx];
        const parenPos = label.indexOf("(");
        if (parenPos > -1 && label[label.length - 1] === ")") {
            const controlCode = label.substring(parenPos + 1, label.length - 1);
            controlCodes.push(controlCode);
        } else if (labelIdx + 1 === labels.length) {
            controlCodes.push(null);
        } else {
            throw new InvalidData("Unrecognised control header label: '" + label + "'");
        }
    }

    return controlCodes;
}

/**
* Removes from the given arrays of cumulative and split times any 'extra'
* controls.
*
* An 'extra' control is a control that a competitor punches without it
* being a control on their course.  Extra controls are indicated by the
* split 'time' beginning with an asterisk.
*
* This method does not return anything, instead it mutates the arrays
* given.
*
* @sb-param {Array} cumTimes - Array of cumulative times.
* @sb-param {Array} splitTimes - Array of split times.
*/
function removeExtraControls(cumTimes: number[], splitTimes: string[]): void {
    while (splitTimes.length > 0 && splitTimes[splitTimes.length - 1][0] === "*") {
        splitTimes.splice(splitTimes.length - 1, 1);
        cumTimes.splice(cumTimes.length - 1, 1);
    }
}

/**
* Represents the result of parsing lines of competitor data.  This can
* represent intermediate data as well as complete data. 
* */
class CompetitorParseRecord {
    /**
    * Represents the result of parsing lines of competitor data.  This can
    * represent intermediate data as well as complete data.
    * @constructor
    * @sb-param {String} name - The name of the competitor.
    * @sb-param {String} club - The name of the competitor's club.
    * @sb-param {String} className - The class of the competitor.
    * @sb-param {?Number} totalTimeStr - The total time taken by the competitor, or
    *     null for no total time.
    * @sb-param {Array} cumTimes - Array of cumulative split times.
    * @sb-param {boolean} competitive - Whether the competitor's run is competitive.
    */
    constructor(public name: string,
        public club: string,
        public className: string,
        public totalTimeStr: string | null,
        public cumTimes: Array<sbTime>,
        public competitive: boolean) {}

    /**
    * Returns whether this competitor record is a 'continuation' record.
    * A continuation record is one that has no name, club, class name or total
    * time.  Instead it represents the data read from lines of data other than
    * the first two.
    * @sb-return {boolean} True if the record is a continuation record, false if not.
    */
    public isContinuation(): boolean {
        return (this.name === "" && this.club === "" && this.className === null && this.totalTimeStr === "" && !this.competitive);
    }

    /**
    * Appends the cumulative split times in another CompetitorParseRecord to
    * this one.  The one given must be a 'continuation' record.
    * @sb-param {CompetitorParseRecord} other - The record whose cumulative times
    *     we wish to append.
    */
    public append(other: CompetitorParseRecord) {
        if (other.isContinuation()) {
            this.cumTimes = this.cumTimes.concat(other.cumTimes);
        } else {
            throw new Error("Can only append a continuation CompetitorParseRecord");
        }
    }

    /**
    * Creates a Competitor object from this CompetitorParseRecord object.
    * @sb-param {Number} order - The number of this competitor within their class
    *     (1=first, 2=second, ...).
    * @sb-return {Competitor} Converted competitor object.
    */
    public toCompetitor(order: number): Competitor {
        // Prepend a zero cumulative time.
        const cumTimes = [0].concat(this.cumTimes);

        // The null is for the start time.
        const competitor = Competitor.fromOriginalCumTimes(order, this.name, this.club, null, cumTimes);
        if (competitor.completed() && !this.competitive) {
            competitor.setNonCompetitive();
        }

        if (!competitor.hasAnyTimes()) {
            competitor.setNonStarter();
        }

        return competitor;
    }
}
/*
* There are three types of HTML format supported by this parser: one that is
* based on pre-formatted text, one that is based around a single HTML table,
* and one that uses many HTML tables.  The overall strategy when parsing
* any format is largely the same, but the exact details vary.
*
* A 'Recognizer' is used to handle the finer details of the format parsing.
* A recognizer should contain methods 'isTextOfThisFormat',
* 'preprocess', 'canIgnoreThisLine', 'isCourseHeaderLine',
* 'parseCourseHeaderLine', 'parseControlsLine' and 'parseCompetitor'.
* See the documentation on the objects below for more information about
* what these methods do.
*/

/**
* A Recognizer that handles the 'older' HTML format based on preformatted
* text.
*/
// There exists variations of the format depending on what the second
// <font> ... </font> element on each row contains.  It can be blank,
// contain a number (start number, perhaps?) or something else.
// If blank or containing a number, the competitor's name is in column
// 2 and there are four preceding columns.  Otherwise the competitor's
// name is in column 1 and there are three preceding columns.
class OldHtmlFormatRecognizer {
    precedingColumnCount: number | null = null;

    /**
    * Returns whether this recognizer is likely to recognize the given HTML
    * text and possibly be able to parse it.  If this method returns true, the
    * parser will use this recognizer to attempt to parse the HTML.  If it
    * returns false, the parser will not use this recognizer.  Other methods on
    * this object can therefore assume that this method has returned true.
    *
    * As this recognizer is for recognizing preformatted text which also uses a
    * lot of &lt;font&gt; elements, it simply checks for the presence of
    * HTML &lt;pre&gt; and &lt;font&gt; elements.
    *
    * @sb-param {String} text - The entire input text read in.
    * @sb-return {boolean} True if the text contains any pre-formatted HTML, false
    *     otherwise
    */
    isTextOfThisFormat(text: string): boolean {
        return (text.indexOf("<pre>") >= 0 && text.indexOf("<font") >= 0);
    };

    /**
    * Performs some pre-processing on the text before it is read in.
    *
    * This object strips everything up to and including the opening
    * &lt;pre&gt; tag, and everything from the closing &lt;/pre&gt; tag
    * to the end of the text.
    *
    * @sb-param {String} text - The HTML text to preprocess.
    * @sb-return {String} The preprocessed text.
    */
    preprocess(text: string): string {
        const prePos = text.indexOf("<pre>");
        if (prePos === -1) {
            throw new Error("Cannot find opening pre tag");
        }

        let lineEndPos = text.indexOf("\n", prePos);
        text = text.substring(lineEndPos + 1);

        // Replace blank lines.
        text = text.replace(/\n{2,}/g, "\n");

        const closePrePos = text.lastIndexOf("</pre>");
        if (closePrePos === -1) {
            throw new InvalidData("Found opening <pre> but no closing </pre>");
        }

        lineEndPos = text.lastIndexOf("\n", closePrePos);
        text = text.substring(0, lineEndPos);
        return text.trim();
    };

    /**
    * Returns whether the HTML parser can ignore the given line altogether.
    *
    * The parser will call this method with every line read in, apart from
    * the second line of each pair of competitor data rows.  These are always
    * assumed to be in pairs.
    *
    * This recognizer ignores only blank lines.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if the line should be ignored, false if not.
    */
    canIgnoreThisLine(line: string): boolean {
        return line === "";
    };

    /**
    * Returns whether the given line is the first line of a course.
    *
    * If so, it means the parser has finished processing the previous course
    * (if any), and can start a new course.
    *
    * This recognizer treats a line with exactly two
    * &lt;font&gt;...&lt;/font&gt; elements as a course header line, and
    * anything else not.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if this is the first line of a course, false
    *     otherwise.
    */
    isCourseHeaderLine(line: string): boolean {
        return (getFontBits(line).length === 2);
    };

    /**
    * Parse a course header line and return the course name, distance and
    * climb.
    *
    * This method can assume that the line given is a course header line.
    *
    * @sb-param {String} line - The line to parse course details from.
    * @sb-return {Object} Object containing the parsed course details.
    */
    parseCourseHeaderLine(line: string): { name: string, distance: number, climb: number; } {
        const bits = getFontBits(line);
        if (bits.length !== 2) {
            throw new Error("Course header line should have two parts");
        }

        const nameAndControls = bits[0];
        const distanceAndClimb = bits[1];

        const openParenPos = nameAndControls.indexOf("(");
        const courseName = (openParenPos > -1) ? nameAndControls.substring(0, openParenPos) : nameAndControls;

        const distance = tryReadDistance(distanceAndClimb);
        const climb = tryReadClimb(distanceAndClimb);

        return {
            name: courseName.trim(),
            distance: distance,
            climb: climb
        };
    };

    /**
    * Parse control codes from the given line and return a list of them.
    *
    * This method can assume that the previous line was the course header or a
    * previous control line.  It should also return null for the finish, which
    * should have no code.  The finish is assumed to he the last.
    *
    * @sb-param {String} line - The line to parse control codes from.
    * @sb-return {Array} Array of control codes.
    */
    parseControlsLine(line: string): string[] {
        const lastFontPos = line.lastIndexOf("</font>");
        const controlsText = (lastFontPos === -1) ? line : line.substring(lastFontPos + "</font>".length);

        const controlLabels = splitByWhitespace(controlsText.trim());
        return readControlCodes(controlLabels);
    };

    /**
    * Read either cumulative or split times from the given line of competitor
    * data.
    * (This method is not used by the parser, only elsewhere in the recognizer.)
    * @sb-param {String} line - The line to read the times from.
    * @sb-return {Array} Array of times.
    */
    readCompetitorSplitDataLine(line: string): string[] {
        for (let i = 0; i < this.precedingColumnCount; i += 1) {
            const closeFontPos = line.indexOf("</font>");
            line = line.substring(closeFontPos + "</font>".length);
        }

        const times = splitByWhitespace(stripHtml(line));
        return times;
    };

    /**
    * Parse two lines of competitor data into a CompetitorParseRecord object
    * containing the data.
    * @sb-param {String} firstLine - The first line of competitor data.
    * @sb-param {String} secondLine - The second line of competitor data.
    * @sb-return {CompetitorParseRecord} The parsed competitor.
    */
    parseCompetitor(firstLine: string, secondLine: string): CompetitorParseRecord {
        const firstLineBits = getFontBits(firstLine);
        const secondLineBits = getFontBits(secondLine);

        if (this.precedingColumnCount === null) {
            // If column 1 is blank or a number, we have four preceding
            // columns.  Otherwise we have three.
            const column1 = firstLineBits[1].trim();
            this.precedingColumnCount = (column1.match(/^\d*$/)) ? 4 : 3;
        }

        const competitive = hasNumber(firstLineBits[0]);
        const name = firstLineBits[this.precedingColumnCount - 2].trim();
        const totalTime = firstLineBits[this.precedingColumnCount - 1].trim();
        const club = secondLineBits[this.precedingColumnCount - 2].trim();

        const cumulativeTimesStr = this.readCompetitorSplitDataLine(firstLine);
        const splitTimes = this.readCompetitorSplitDataLine(secondLine);
        let cumulativeTimes = cumulativeTimesStr.map(parseTime);

        removeExtraControls(cumulativeTimes, splitTimes);

        let className = null;
        if (name !== null && name !== "") {
            let lastCloseFontPos = -1;
            for (let i = 0; i < this.precedingColumnCount; i += 1) {
                lastCloseFontPos = firstLine.indexOf("</font>", lastCloseFontPos + 1);
            }

            const firstLineUpToLastPreceding = firstLine.substring(0, lastCloseFontPos + "</font>".length);
            const firstLineMinusFonts = firstLineUpToLastPreceding.replace(/<font[^>]*>(.*?)<\/font>/g, "");
            const lineParts = splitByWhitespace(firstLineMinusFonts);
            if (lineParts.length > 0) {
                className = lineParts[0];
            }
        }

        return new CompetitorParseRecord(name, club, className, totalTime, cumulativeTimes, competitive);
    };

}

/**
* Formatting the 'newer' format of HTML
* event results data.
*
* Data in this format is given within a number of HTML tables, three per
* course. */
class NewHtmlFormatRecognizer {
    timesOffset: number | null = null;

    /**
    * Returns whether this recognizer is likely to recognize the given HTML
    * text and possibly be able to parse it.  If this method returns true, the
    * parser will use this recognizer to attempt to parse the HTML.  If it
    * returns false, the parser will not use this recognizer.  Other methods on
    * this object can therefore assume that this method has returned true.
    *
    * As this recognizer is for recognizing HTML formatted in tables, it
    * returns whether the number of HTML &lt;table&gt; tags is at least five.
    * Each course uses three tables, and there are two HTML tables before the
    * courses.
    *
    * @sb-param {String} text - The entire input text read in.
    * @sb-return {boolean} True if the text contains at least five HTML table
    *     tags.
    */
    isTextOfThisFormat(text: string): boolean {
        let tablePos = -1;
        for (let i = 0; i < 5; i += 1) {
            tablePos = text.indexOf("<table", tablePos + 1);
            if (tablePos === -1) {
                // Didn't find another table.
                return false;
            }
        }

        return true;
    };

    /**
    * Performs some pre-processing on the text before it is read in.
    *
    * This recognizer performs a fair amount of pre-processing, to remove
    * parts of the file we don't care about, and to reshape what there is left
    * so that it is in a more suitable form to be parsed.
    *
    * @sb-param {String} text - The HTML text to preprocess.
    * @sb-return {String} The preprocessed text.
    */
    preprocess(text: string): string {
        // Remove the first table and end of the <div> it is contained in.
        const tableEndPos = text.indexOf("</table>");
        if (tableEndPos === -1) {
            throw new InvalidData("Could not find any closing </table> tags");
        }

        text = text.substring(tableEndPos + "</table>".length);

        const closeDivPos = text.indexOf("</div>");
        const openTablePos = text.indexOf("<table");
        if (closeDivPos > -1 && closeDivPos < openTablePos) {
            text = text.substring(closeDivPos + "</div>".length);
        }

        // Rejig the line endings so that each row of competitor data is on its
        // own line, with table and table-row tags starting on new lines,
        // and closing table and table-row tags at the end of lines.
        text = text.replace(/>\n+</g, "><").replace(/><tr>/g, ">\n<tr>").replace(/<\/tr></g, "</tr>\n<")
            .replace(/><table/g, ">\n<table").replace(/<\/table></g, "</table>\n<");

        // Remove all <col> elements.
        text = text.replace(/<\/col[^>]*>/g, "");

        // Remove all rows that contain only a single non-breaking space.
        // In the file I have, the &nbsp; entities are missing their
        // semicolons.  However, this could well be fixed in the future.
        text = text.replace(/<tr[^>]*><td[^>]*>(?:<nobr>)?&nbsp;?(?:<\/nobr>)?<\/td><\/tr>/g, "");

        // Remove any anchor elements used for navigation...
        text = text.replace(/<a id="[^"]*"><\/a>/g, "");

        // ... and the navigation div.  Use [\s\S] to match everything
        // including newlines - JavaScript regexps have no /s modifier.
        text = text.replace(/<div id="navigation">[\s\S]*?<\/div>/g, "");

        // Finally, remove the trailing </body> and </html> elements.
        text = text.replace("</body></html>", "");

        return text.trim();
    };

    /**
    * Returns whether the HTML parser can ignore the given line altogether.
    *
    * The parser will call this method with every line read in, apart from
    * the second line of each pair of competitor data rows.  These are always
    * assumed to be in pairs.  This recognizer takes advantage of this to scan
    * the course header tables to see if class names are included.
    *
    * This recognizer ignores blank lines. It also ignores any that contain
    * opening or closing HTML table tags.  This is not a problem because the
    * preprocessing has ensured that the table data is not in the same line.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if the line should be ignored, false if not.
    */
    canIgnoreThisLine(line: string): boolean {
        if (line.indexOf("<th>") > -1) {
            const bits = getNonEmptyTableHeaderBits(line);
            this.timesOffset = bits.length;
            return true;
        } else {
            return (line === "" || line.indexOf("<table") > -1 || line.indexOf("</table>") > -1);
        }
    };

    /**
    * Returns whether the given line is the first line of a course.
    *
    * If so, it means the parser has finished processing the previous course
    * (if any), and can start a new course.
    *
    * This recognizer treats a line that contains a table-data cell with ID
    * "header" as the first line of a course.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if this is the first line of a course, false
    *     otherwise.
    */
    isCourseHeaderLine(line: string): boolean {
        return line.indexOf("<td id=\"header\"") > -1;
    };

    /**
    * Parse a course header line and return the course name, distance and
    * climb.
    *
    * This method can assume that the line given is a course header line.
    *
    * @sb-param {String} line - The line to parse course details from.
    * @sb-return {Object} Object containing the parsed course details.
    */
    parseCourseHeaderLine(line: string): { name: string, distance: number, climb: number; } {
        const dataBits = getNonEmptyTableDataBits(line);
        if (dataBits.length === 0) {
            throw new InvalidData("No parts found in course header line");
        }

        let name = dataBits[0];
        const openParenPos = name.indexOf("(");
        if (openParenPos > -1) {
            name = name.substring(0, openParenPos);
        }

        name = name.trim();

        let distance = null;
        let climb = null;

        for (let bitIndex = 1; bitIndex < dataBits.length; bitIndex += 1) {
            if (distance === null) {
                distance = tryReadDistance(dataBits[bitIndex]);
            }

            if (climb === null) {
                climb = tryReadClimb(dataBits[bitIndex]);
            }
        }

        return { name: name, distance: distance, climb: climb };
    };

    /**
    * Parse control codes from the given line and return a list of them.
    *
    * This method can assume that the previous line was the course header or a
    * previous control line.  It should also return null for the finish, which
    * should have no code.  The finish is assumed to he the last.
    *
    * @sb-param {String} line - The line to parse control codes from.
    * @sb-return {Array} Array of control codes.
    */
    parseControlsLine(line: string): string[] {
        const bits = getNonEmptyTableDataBits(line);
        return readControlCodes(bits);
    };

    /**
    * Read either cumulative or split times from the given line of competitor
    * data.
    * (This method is not used by the parser, only elsewhere in the recognizer.)
    * @sb-param {String} line - The line to read the times from.
    * @sb-return {Array} Array of times.
    */
    readCompetitorSplitDataLine(line: string): string[] {
        const bits = getTableDataBits(line);

        const startPos = this.timesOffset;

        // Discard the empty bits at the end.
        let endPos = bits.length;
        while (endPos > 0 && bits[endPos - 1] === "") {
            endPos -= 1;
        }

        return bits.slice(startPos, endPos).filter(isNonEmpty);
    };

    /**
    * Parse two lines of competitor data into a CompetitorParseRecord object
    * containing the data.
    * @sb-param {String} firstLine - The first line of competitor data.
    * @sb-param {String} secondLine - The second line of competitor data.
    * @sb-return {CompetitorParseRecord} The parsed competitor.
    */
    parseCompetitor(firstLine: string, secondLine: string): CompetitorParseRecord {
        const firstLineBits = getTableDataBits(firstLine);
        const secondLineBits = getTableDataBits(secondLine);

        const competitive = hasNumber(firstLineBits[0]);
        const nameOffset = (this.timesOffset === 3) ? 1 : 2;
        const name = firstLineBits[nameOffset];
        const totalTime = firstLineBits[this.timesOffset - 1];
        const club = secondLineBits[nameOffset];

        const className = (this.timesOffset === 5 && name !== "") ? firstLineBits[3] : null;

        const cumulativeTimesStr = this.readCompetitorSplitDataLine(firstLine);
        const splitTimes = this.readCompetitorSplitDataLine(secondLine);
        let cumulativeTimes = cumulativeTimesStr.map(parseTime);

        removeExtraControls(cumulativeTimes, splitTimes);

        const nonZeroCumTimeCount = cumulativeTimes.filter(isNotNull).length;

        if (nonZeroCumTimeCount !== splitTimes.length) {
            // eslint-disable-next-line max-len
            throw new InvalidData("Cumulative and split times do not have the same length: " + nonZeroCumTimeCount + " cumulative times, " + splitTimes.length + " split times");
        }

        return new CompetitorParseRecord(name, club, className, totalTime, cumulativeTimes, competitive);
    };
}

/**
* Constructs a recognizer for formatting an HTML format supposedly from
* 'OEvent'.
*
* Data in this format is contained within a single HTML table, with another
* table before it containing various (ignored) header information.
*/
class OEventTabularHtmlFormatRecognizer {
    usesClasses = false;

    /**
    * Returns whether this recognizer is likely to recognize the given HTML
    * text and possibly be able to parse it.  If this method returns true, the
    * parser will use this recognizer to attempt to parse the HTML.  If it
    * returns false, the parser will not use this recognizer.  Other methods on
    * this object can therefore assume that this method has returned true.
    *
    * As this recognizer is for recognizing HTML formatted in precisely two
    * tables, it returns whether the number of HTML &lt;table&gt; tags is
    * two.  If fewer than two tables are found, or more than two, this method
    * returns false.
    *
    * @sb-param {String} text - The entire input text read in.
    * @sb-return {boolean} True if the text contains precisely two HTML table
    *     tags.
    */
    isTextOfThisFormat(text: string): boolean {
        const table1Pos = text.indexOf("<table");
        if (table1Pos >= 0) {
            const table2Pos = text.indexOf("<table", table1Pos + 1);
            if (table2Pos >= 0) {
                const table3Pos = text.indexOf("<table", table2Pos + 1);
                if (table3Pos < 0) {
                    // Format characterised by precisely two tables.
                    return true;
                }
            }
        }

        return false;
    };

    /**
    * Performs some pre-processing on the text before it is read in.
    *
    * This recognizer performs a fair amount of pre-processing, to remove
    * parts of the file we don't care about, and to reshape what there is left
    * so that it is in a more suitable form to be parsed.
    *
    * @sb-param {String} text - The HTML text to preprocess.
    * @sb-return {String} The preprocessed text.
    */
    preprocess(text: string): string {
        // Remove the first table.
        const tableEndPos = text.indexOf("</table>");
        if (tableEndPos === -1) {
            throw new InvalidData("Could not find any closing </table> tags");
        }

        if (text.indexOf("<td colspan=\"25\">") >= 0) {
            // The table has 25 columns with classes and 24 without.
            this.usesClasses = true;
        }

        text = text.substring(tableEndPos + "</table>".length);

        // Remove all rows that contain only a single non-breaking space.
        text = text.replace(/<tr[^>]*><td colspan=[^>]*>&nbsp;<\/td><\/tr>/g, "");

        // Replace blank lines.
        text = text.replace(/\n{2,}/g, "\n");

        // Finally, remove the trailing </body> and </html> elements.
        text = text.replace("</body>", "").replace("</html>", "");

        return text.trim();
    };

    /**
    * Returns whether the HTML parser can ignore the given line altogether.
    *
    * The parser will call this method with every line read in, apart from
    * the second line of each pair of competitor data rows.  These are always
    * assumed to be in pairs.
    *
    * This recognizer ignores blank lines. It also ignores any that contain
    * opening or closing HTML table tags or horizontal-rule tags.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if the line should be ignored, false if not.
    */
    canIgnoreThisLine(line: string): boolean {
        return (line === "" || line.indexOf("<table") > -1 || line.indexOf("</table>") > -1 || line.indexOf("<hr>") > -1);
    };

    /**
    * Returns whether the given line is the first line of a course.
    *
    * If so, it means the parser has finished processing the previous course
    * (if any), and can start a new course.
    *
    * This recognizer treats a line that contains a table-row cell with class
    * "clubName" as the first line of a course.
    *
    * @sb-param {String} line - The line to check.
    * @sb-return {boolean} True if this is the first line of a course, false
    *     otherwise.
    */
    isCourseHeaderLine(line: string): boolean {
        return line.indexOf("<tr class=\"clubName\"") > -1;
    };

    /**
    * Parse a course header line and return the course name, distance and
    * climb.
    *
    * This method can assume that the line given is a course header line.
    *
    * @sb-param {String} line - The line to parse course details from.
    * @sb-return {Object} Object containing the parsed course details.
    */
    parseCourseHeaderLine(line: string): { name: string, distance: number, climb: number; } {
        const dataBits = getNonEmptyTableDataBits(line);
        if (dataBits.length === 0) {
            throw new InvalidData("No parts found in course header line");
        }

        const part = dataBits[0];

        let name, distance, climb;
        const match = /^(.*?)\s+\((\d+)m,\s*(\d+)m\)$/.exec(part);
        if (match === null) {
            // Assume just course name.
            name = part;
            distance = null;
            climb = null;
        } else {
            name = match[1];
            distance = parseInt(match[2], 10) / 1000;
            climb = parseInt(match[3], 10);
        }

        return { name: name.trim(), distance: distance, climb: climb };
    };

    /**
    * Parse control codes from the given line and return a list of them.
    *
    * This method can assume that the previous line was the course header or a
    * previous control line.  It should also return null for the finish, which
    * should have no code.  The finish is assumed to he the last.
    *
    * @sb-param {String} line - The line to parse control codes from.
    * @sb-return {Array} Array of control codes.
    */
    parseControlsLine(line: string): string[] {
        const bits = getNonEmptyTableDataBits(line);
        return bits.map(function (bit) {
            const dashPos = bit.indexOf("-");
            return (dashPos === -1) ? null : bit.substring(dashPos + 1);
        });
    };

    /**
    * Read either cumulative or split times from the given line of competitor
    * data.
    * (This method is not used by the parser, only elsewhere in the recognizer.)
    * @sb-param {Array} bits - Array of all contents of table elements.
    * @sb-return {Array} Array of times.
    */
    readCompetitorSplitDataLine(bits: string[]): string[] {

        const startPos = (this.usesClasses) ? 5 : 4;

        // Discard the empty bits at the end.
        let endPos = bits.length;
        while (endPos > 0 && bits[endPos - 1] === "") {
            endPos -= 1;
        }

        // Alternate cells contain ranks, which we're not interested in.
        const timeBits = [];
        for (let index = startPos; index < endPos; index += 2) {
            const bit = bits[index];
            if (isNonEmpty(bit)) {
                timeBits.push(bit);
            }
        }

        return timeBits;
    };

    /**
    * Parse two lines of competitor data into a CompetitorParseRecord object
    * containing the data.
    * @sb-param {String} firstLine - The first line of competitor data.
    * @sb-param {String} secondLine - The second line of competitor data.
    * @sb-return {CompetitorParseRecord} The parsed competitor.
    */
    parseCompetitor(firstLine: string, secondLine: string): CompetitorParseRecord {
        const firstLineBits = getTableDataBits(firstLine);
        const secondLineBits = getTableDataBits(secondLine);

        const competitive = hasNumber(firstLineBits[0]);
        const name = firstLineBits[2];
        const totalTime = firstLineBits[(this.usesClasses) ? 4 : 3];
        const className = (this.usesClasses && name !== "") ? firstLineBits[3] : null;
        const club = secondLineBits[2];

        // If there is any cumulative time with a blank corresponding split
        // time, use a placeholder value for the split time.  Typically this
        // happens when a competitor has punched one control but not the
        // previous.
        for (let index = ((this.usesClasses) ? 5 : 4); index < firstLineBits.length && index < secondLineBits.length; index += 2) {
            if (firstLineBits[index] !== "" && secondLineBits[index] === "") {
                secondLineBits[index] = "----";
            }
        }

        const cumulativeTimesStr = this.readCompetitorSplitDataLine(firstLineBits);
        const splitTimes = this.readCompetitorSplitDataLine(secondLineBits);
        let cumulativeTimes = cumulativeTimesStr.map(parseTime);

        removeExtraControls(cumulativeTimes, splitTimes);

        if (cumulativeTimes.length !== splitTimes.length) {
            // eslint-disable-next-line max-len
            throw new InvalidData("Cumulative and split times do not have the same length: " + cumulativeTimes.length +
                " cumulative times, " + splitTimes.length + " split times");
        }

        return new CompetitorParseRecord(name, club, className, totalTime, cumulativeTimes, competitive);
    };
}

/**
* Represents the partial result of parsing a course.
*/
class CourseParseRecord {
    controls: string[] = [];
    competitors: CompetitorParseRecord[] = [];

    /**
    * Represents the partial result of parsing a course.
    * @constructor
    * @sb-param {String} name - The name of the course.
    * @sb-param {?Number} distance - The distance of the course in kilometres,
    *     if known, else null.
    * @sb-param {?Number} climb - The climb of the course in metres, if known,
    *     else null.
    */
    constructor(public name: string, public distance: number, public climb: number) { }

    /**
    * Adds the given list of control codes to those built up so far.
    * @sb-param {Array} controls - Array of control codes read.
    */
    addControls(controls: string[]) {
        this.controls = this.controls.concat(controls);
    };

    /**
    * Returns whether the course has all of the controls it needs.
    * The course has all its controls if its last control is the finish, which
    * is indicated by a null control code.
    * @sb-return {boolean} True if the course has all of its controls, including
    *     the finish, false otherwise.
    */
    hasAllControls() {
        return this.controls.length > 0 && this.controls[this.controls.length - 1] === null;
    };

    /**
    * Adds a competitor record to the collection held by this course.
    * @sb-param {CompetitorParseRecord} competitor - The competitor to add.
    */
    addCompetitor(competitor: CompetitorParseRecord) {
        if (!competitor.competitive && competitor.cumTimes.length === this.controls.length - 1) {
            // Odd quirk of the format: mispunchers may have their finish split
            // missing, i.e. not even '-----'.  If it looks like this has
            // happened, fill the gap by adding a missing time for the finish.
            competitor.cumTimes.push(null);
        }

        if (parseTime(competitor.totalTimeStr) === null && competitor.cumTimes.length === 0) {
            while (competitor.cumTimes.length < this.controls.length) {
                competitor.cumTimes.push(null);
            }
        }

        if (competitor.cumTimes.length === this.controls.length) {
            this.competitors.push(competitor);
        } else {
            throw new InvalidData("Competitor '" + competitor.name + "' should have " + this.controls.length +
                " cumulative times, but has " + competitor.cumTimes.length + " times");
        }
    };
}

/**
* A parser that is capable of parsing event data in a given HTML format.
*/
class HtmlFormatParser {
    courses: CourseParseRecord[] = [];
    currentCourse: CourseParseRecord | null = null;
    lines: string[] = null;
    linePos = -1;
    currentCompetitor: CompetitorParseRecord | null = null;

    /**
    * A parser that is capable of parsing event data in a given HTML format.
    * @constructor
    * @sb-param {Object} recognizer - The recognizer to use to parse the HTML.
    */
    constructor(public recognizer: RecogniserClass) { }

    /**
    * Attempts to read the next unread line from the data given.  If the end of
    * the data has been read, null will be returned.
    * @sb-return {?String} The line read, or null if the end of the data has
    *     been reached.
    */
    tryGetLine() {
        if (this.linePos + 1 < this.lines.length) {
            this.linePos += 1;
            return this.lines[this.linePos];
        } else {
            return null;
        }
    };

    /**
    * Adds the current competitor being constructed to the current course, and
    * clear the current competitor.
    *
    * If there is no current competitor, nothing happens.
    */
    addCurrentCompetitorIfNecessary() {
        if (this.currentCompetitor !== null) {
            this.currentCourse.addCompetitor(this.currentCompetitor);
            this.currentCompetitor = null;
        }
    };

    /**
    * Adds the current competitor being constructed to the current course, and
    * the current course being constructed to the list of all courses.
    *
    * If there is no current competitor nor no current course, nothing happens.
    */
    addCurrentCompetitorAndCourseIfNecessary() {
        this.addCurrentCompetitorIfNecessary();
        if (this.currentCourse !== null) {
            this.courses.push(this.currentCourse);
        }
    };

    /**
    * Reads in data for one competitor from two lines of the input data.
    *
    * The first of the two lines will be given; the second will be read.
    * @sb-param {String} firstLine - The first of the two lines to read the
    *     competitor data from.
    */
    readCompetitorLines(firstLine: string) {
        const secondLine = this.tryGetLine();
        if (secondLine === null) {
            throw new InvalidData("Hit end of input data unexpectedly while parsing competitor: first line was '" + firstLine + "'");
        }

        const competitorRecord = this.recognizer.parseCompetitor(firstLine, secondLine);
        if (competitorRecord.isContinuation()) {
            if (this.currentCompetitor === null) {
                throw new InvalidData("First row of competitor data has no name nor time");
            } else {
                this.currentCompetitor.append(competitorRecord);
            }
        } else {
            this.addCurrentCompetitorIfNecessary();
            this.currentCompetitor = competitorRecord;
        }
    };

    /**
    * Returns whether the classes are unique within courses.  If so, they can
    * be used to subdivide courses.  If not, CourseClasses and Courses must be
    * the same.
    * @sb-return {boolean} True if no two competitors in the same class are on
    *     different classes, false otherwise.
    */
    areClassesUniqueWithinCourses() {
        const classesToCoursesMap = new Map<string, string>();
        for (let courseIndex = 0; courseIndex < this.courses.length; courseIndex += 1) {
            const course = this.courses[courseIndex];
            for (let competitorIndex = 0; competitorIndex < course.competitors.length; competitorIndex += 1) {
                const competitor = course.competitors[competitorIndex];
                if (classesToCoursesMap.has(competitor.className)) {
                    if (classesToCoursesMap.get(competitor.className) !== course.name) {
                        return false;
                    }
                } else {
                    classesToCoursesMap.set(competitor.className, course.name);
                }
            }
        }

        return true;
    };

    /**
    * Reads through all of the intermediate parse-record data and creates an
    * Event object with all of the courses and classes.
    * @sb-return {Event} Event object containing all of the data.
    */
    createOverallEventObject() {
        // There is a complication here regarding classes.  Sometimes, classes
        // are repeated within multiple courses.  In this case, ignore the
        // classes given and create a CourseClass for each set.
        const classesUniqueWithinCourses = this.areClassesUniqueWithinCourses();

        const newCourses: Course[] = [];
        const classes: CourseClass[] = [];

        const competitorsHaveClasses = this.courses.every(function (course) {
            return course.competitors.every(function (competitor) { return isNotNull(competitor.className); });
        });

        this.courses.forEach(function (course) {
            // Firstly, sort competitors by class.
            const classToCompetitorsMap = new Map<string, CompetitorParseRecord[]>();
            course.competitors.forEach(function (competitor) {
                const className = (competitorsHaveClasses && classesUniqueWithinCourses) ? competitor.className : course.name;
                if (classToCompetitorsMap.has(className)) {
                    classToCompetitorsMap.get(className).push(competitor);
                } else {
                    classToCompetitorsMap.set(className, [competitor]);
                }
            });

            const classesForThisCourse: CourseClass[] = [];

            for (const className of classToCompetitorsMap.keys()) {
                const numControls = course.controls.length - 1;
                const oldCompetitors = classToCompetitorsMap.get(className);
                const newCompetitors = oldCompetitors.map((competitor: CompetitorParseRecord, index: number) => competitor.toCompetitor(index + 1));

                const courseClass = new CourseClass(className, numControls, newCompetitors);
                classesForThisCourse.push(courseClass);
                classes.push(courseClass);
            }

            const newCourse = new Course(course.name, classesForThisCourse, course.distance,
                course.climb, course.controls.slice(0, course.controls.length - 1));
            newCourses.push(newCourse);
            classesForThisCourse.forEach(function (courseClass) {
                courseClass.setCourse(newCourse);
            });
        }, this);

        // Empty array is for warnings, which aren't supported by the HTML
        // format parsers.
        return new Results(classes, newCourses, []);
    };

    /**
    * Parses the given HTML text containing results data into an Event object.
    * @sb-param {String} text - The HTML text to parse.
    * @sb-return {Event} Event object containing all the parsed data.
    */
    parse(text: string): Results {
        this.lines = text.split("\n");
        while (true) {
            const line = this.tryGetLine();
            if (line === null) {
                break;
            } else if (this.recognizer.canIgnoreThisLine(line)) {
                // Do nothing - recognizer says we can ignore this line.
            } else if (this.recognizer.isCourseHeaderLine(line)) {
                this.addCurrentCompetitorAndCourseIfNecessary();
                const courseObj = this.recognizer.parseCourseHeaderLine(line);
                this.currentCourse = new CourseParseRecord(courseObj.name, courseObj.distance, courseObj.climb);
            } else if (this.currentCourse === null) {
                // Do nothing - still not found the start of the first course.
            } else if (this.currentCourse.hasAllControls()) {
                // Course has all of its controls; read competitor data.
                this.readCompetitorLines(line);
            } else {
                const controls = this.recognizer.parseControlsLine(line);
                this.currentCourse.addControls(controls);
            }
        }

        this.addCurrentCompetitorAndCourseIfNecessary();

        if (this.courses.length === 0) {
            throw new InvalidData("No competitor data was found");
        }

        const eventData = this.createOverallEventObject();
        return eventData;
    };
}

/**
* Attempts to parse data as one of the supported HTML formats.
*
* If the data appears not to be HTML data, a WrongFileFormat exception
* is thrown.  If the data appears to be HTML data but is invalid in some
* way, an InvalidData exception is thrown.
*
* @sb-param {String} data - The string containing event data.
* @sb-return {Event} The parsed event.
*/
export function parseHTMLEventData(data: string): Results {

    const RECOGNIZER_CLASSES = [OldHtmlFormatRecognizer, NewHtmlFormatRecognizer, OEventTabularHtmlFormatRecognizer];

    data = normaliseLineEndings(data);
    for (let recognizerIndex = 0; recognizerIndex < RECOGNIZER_CLASSES.length; recognizerIndex += 1) {
        const recognizerClass = RECOGNIZER_CLASSES[recognizerIndex];
        const recognizer = new recognizerClass();
        if (recognizer.isTextOfThisFormat(data)) {
            data = recognizer.preprocess(data);
            const parser = new HtmlFormatParser(recognizer);
            const parsedEvent = parser.parse(data);
            return parsedEvent;
        }
    }

    // If we get here, the format wasn't recognized.
    throw new WrongFileFormat("No HTML recognizers recognised this as HTML they could parse");
}
