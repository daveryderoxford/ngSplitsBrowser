// file results-table.js

import * as d3 from "d3";
import { Competitor, CourseClass, TimeUtilities } from "../../model";
import { isNotNullNorNaN } from "../../model/util";
import { Lang } from "./lang";
import { select as d3_select, range as d3_range } from "d3";

const getMessage = Lang.getMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;

const NON_BREAKING_SPACE_CHAR = "\u00a0";

// Maximum precision to show a results-table entry using.
const MAX_PERMITTED_PRECISION = 2;

/**
* A control that shows an entire table of results.
* @constructor
* @sb-param {HTMLElement} parent - The parent element to add this control to.
*/
export function ResultsTable(parent) {
    this.parent = parent;
    this.courseClass = null;
    this.div = null;
    this.headerSpan = null;
    this.table = null;
    this.buildTable();
}

/**
* Build the results table.
*/
ResultsTable.prototype.buildTable = function (): void {
    this.div = d3_select(this.parent).append("div")
        .attr("id", "resultsTableContainer");

    this.headerSpan = this.div.append("div")
        .append("span")
        .classed("resultsTableHeader", true);

    this.table = this.div.append("table")
        .classed("resultsTable", true);

    this.table.append("thead")
        .append("tr");

    this.table.append("tbody");
};

/**
* Determines the precision with which to show the results.
*
* If there are some fractional times, then all times should be shown with
* the same precision, even if not all of them need to.  For example, a
* a split time between controls punched after 62.7 and 108.7 seconds must
* be shown as 46.0 seconds, not 46.
*
* @sb-param {Array} competitors - Array of Competitor objects.
* @sb-return {Number} Maximum precision to use.
*/
function determinePrecision(competitors: Array<Competitor>): number {
    let maxPrecision = 0;
    let maxPrecisionFactor = 1;
    competitors.forEach(function (competitor) {
        competitor.getAllOriginalCumulativeTimes().forEach(function (cumTime) {
            if (isNotNullNorNaN(cumTime)) {
                while (maxPrecision < MAX_PERMITTED_PRECISION &&
                    Math.abs(cumTime - Math.round(cumTime * maxPrecisionFactor) / maxPrecisionFactor) > 1e-7 * cumTime) {
                    maxPrecision += 1;
                    maxPrecisionFactor *= 10;
                }
            }
        });
    });

    return maxPrecision;
}

/**
* Returns the contents of the time or status column for the given
* competitor.
*
* The status may be a string that indicates the competitor mispunched.
*
* @sb-param {Competitor} competitor The competitor to get the status of.
* @sb-return {String} Time or status for the given competitor.
*/
function getTimeOrStatus(competitor: Competitor): string {
    if (competitor.isNonStarter) {
        return getMessage("DidNotStartShort");
    } else if (competitor.isNonFinisher) {
        return getMessage("DidNotFinishShort");
    } else if (competitor.isDisqualified) {
        return getMessage("DisqualifiedShort");
    } else if (competitor.isOverMaxTime) {
        return getMessage("OverMaxTimeShort");
    } else if (competitor.completed()) {
        return TimeUtilities.formatTime(competitor.totalTime);
    } else {
        return getMessage("MispunchedShort");
    }
}

/**
* Escapes a piece of text as HTML so that it can be concatenated into an
* HTML string without the risk of any injection.
* @sb-param {String} value The HTML value to escape.
* @sb-return {String} The HTML value escaped.
*/
function escapeHtml(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/**
* Populates the contents of the table with the course-class data.
*/
ResultsTable.prototype.populateTable = function () {
    let headerText = this.courseClass.name + ", ";
    if (this.courseClass.numControls === 1) {
        headerText += getMessage("ResultsTableHeaderSingleControl");
    } else {
        headerText += getMessageWithFormatting("ResultsTableHeaderMultipleControls", { "$$NUM$$": this.courseClass.numControls });
    }

    const course = this.courseClass.course;
    if (course.length !== null) {
        headerText += ", " + getMessageWithFormatting("ResultsTableHeaderCourseLength", { "$$DISTANCE$$": course.length.toFixed(1) });
    }
    if (course.climb !== null) {
        headerText += ", " + getMessageWithFormatting("ResultsTableHeaderClimb", { "$$CLIMB$$": course.climb });
    }

    this.headerSpan.text(headerText);

    let headerCellData = [
        getMessage("ResultsTableHeaderControlNumber"),
        getMessage("ResultsTableHeaderName"),
        getMessage("ResultsTableHeaderTime")
    ];

    const controls = this.courseClass.course.controls;
    if (controls === null) {
        headerCellData = headerCellData.concat(d3_range(1, this.courseClass.numControls + 1).toString());
    } else {
        headerCellData = headerCellData.concat(controls.map(function (control, index) {
            return (index + 1) + NON_BREAKING_SPACE_CHAR + "(" + control + ")";
        }));
    }

    headerCellData.push(getMessage("FinishName"));

    let headerCells = this.table.select("thead tr")
        .selectAll("th")
        .data(headerCellData);

    headerCells.enter().append("th");
    headerCells.exit().remove();
    headerCells = this.table.select("thead tr")
        .selectAll("th")
        .data(headerCellData);

    headerCells.text(function (header) { return header; });

    // Array that accumulates bits of HTML for the table body.
    const htmlBits = [];

    // Adds a two-line cell to the array of table-body HTML parts.
    // If truthy, cssClass is assumed to be HTML-safe and not require
    // escaping.
    function addCell(topLine, bottomLine, cssClass, cumFastest, splitFastest, cumDubious, splitDubious) {
        htmlBits.push("<td");
        if (cssClass) {
            htmlBits.push(" class=\"" + cssClass + "\"");
        }

        htmlBits.push("><span");
        let className = (((cumFastest) ? "fastest" : "") + " " + ((cumDubious) ? "dubious" : "")).trim();
        if (className !== "") {
            htmlBits.push(" class=\"" + className + "\"");
        }

        htmlBits.push(">");
        htmlBits.push(escapeHtml(topLine));
        htmlBits.push("</span><br><span");
        className = (((splitFastest) ? "fastest" : "") + " " + ((splitDubious) ? "dubious" : "")).trim();
        if (className !== "") {
            htmlBits.push(" class=\"" + className + "\"");
        }

        htmlBits.push(">");
        htmlBits.push(escapeHtml(bottomLine));
        htmlBits.push("</span></td>\n");
    }

    const competitors = this.courseClass.competitors.slice(0);
    competitors.sort(Competitor.compareCompetitors);

    let nonCompCount = 0;
    let rank = 0;

    const precision = determinePrecision(competitors);

    competitors.forEach(function (competitor, index) {
        htmlBits.push("<tr><td>");

        if (competitor.isNonCompetitive) {
            htmlBits.push(escapeHtml(getMessage("NonCompetitiveShort")));
            nonCompCount += 1;
        } else if (competitor.completed()) {
            if (index === 0 || competitors[index - 1].totalTime !== competitor.totalTime) {
                rank = index + 1 - nonCompCount;
            }

            htmlBits.push("" + rank);
        }

        htmlBits.push("</td>");

        addCell(competitor.name, competitor.club, false, false, false, false, false);
        addCell(getTimeOrStatus(competitor), NON_BREAKING_SPACE_CHAR, "time", false, false, false, false);

        d3_range(1, this.courseClass.numControls + 2).forEach(function (controlNum) {
            const formattedCumTime = TimeUtilities.formatTime(competitor.getOriginalCumulativeTimeTo(controlNum), precision);
            const formattedSplitTime = TimeUtilities.formatTime(competitor.getOriginalSplitTimeTo(controlNum), precision);
            const isCumTimeFastest = (competitor.getCumulativeRankTo(controlNum) === 1);
            const isSplitTimeFastest = (competitor.getSplitRankTo(controlNum) === 1);
            const isCumDubious = competitor.isCumulativeTimeDubious(controlNum);
            const isSplitDubious = competitor.isSplitTimeDubious(controlNum);
            addCell(formattedCumTime, formattedSplitTime, "time", isCumTimeFastest, isSplitTimeFastest, isCumDubious, isSplitDubious);
        });

        htmlBits.push("</tr>\n");

    }, this);

    this.table.select("tbody").node().innerHTML = htmlBits.join("");
};

/**
* Sets the class whose data is displayed.
* @sb-param {CourseClass} courseClass - The class displayed.
*/
ResultsTable.prototype.setClass = function (courseClass: CourseClass) {
    this.courseClass = courseClass;
    if (this.courseClass !== null) {
        this.populateTable();
    }
};

/**
* Shows the table of results.
*/
ResultsTable.prototype.show = function (): void {
    this.div.style("display", null);
};

/**
* Hides the table of results.
*/
ResultsTable.prototype.hide = function (): void {
    this.div.style("display", "none");
};

/**
* Retranslates the results table following a change of selected language.
*/
ResultsTable.prototype.retranslate = function (): void {
    this.populateTable();
};

