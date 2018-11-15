// file query-string.js

import { ascending as d3_ascending, range as d3_range } from "d3-array";
import { map as d3_map, set as d3_set } from "d3-collection";
import { Competitor, CourseClassSet, Results } from "../../model";
import { ChartType, ChartTypeClass } from "./chart-types";

type ChartCompareTo = "TotalTime" | "SplitTime" | "BehindFastest" | "TimeLoss";

export interface ResultsURLOptions {
    classes: Array<number>;
    chartType: ChartType;
    compareWith: boolean | null | { index: number; runner: Competitor };
    selected: Array<number> | null;
    stats: ChartCompareTo; // from readSelectedStatistics(queryString),
    showOriginal: boolean;
    filterText: string; // Text string to filter results with
}

const ChartTypes = ChartTypeClass.chartTypes;

/**
* Remove all matches of the given regular expression from the given string.
* The regexp is not assumed to contain the "g" flag.
* @sb-param {String} queryString - The query-string to process.
* @sb-param {RegExp} regexp - The regular expression to use to remove text.
* @sb-return {String} The given query-string with all regexp matches removed.
*/
function removeAll(queryString: string, regexp: RegExp): string {
    return queryString.replace(new RegExp(regexp.source, "g"), "");
}

const CLASS_NAME_REGEXP = /(?:^|&|\?)class=([^&]+)/;

/**
* Reads the selected class names from a query string.
* @sb-param {String} queryString - The query string to read the class name
*     from.
* @sb-param {Event} eventData - The event data read in, used to validate the
*     selected classes.
* @sb-return {CourseClassSet|null} - Array of selected CourseClass objects, or null
*     if none were found.
*/
function readSelectedClasses(queryString: string, eventData: Results): CourseClassSet | null {
    const classNameMatch = CLASS_NAME_REGEXP.exec(queryString);
    if (classNameMatch === null) {
        // No class name specified in the URL.
        return null;
    } else {
        const classesByName = <any>d3_map();
        for (let index = 0; index < eventData.classes.length; index += 1) {
            classesByName.set(eventData.classes[index].name, eventData.classes[index]);
        }

        let classNames = decodeURIComponent(classNameMatch[1]).split(";");
        classNames = d3_set(classNames).values();
        let selectedClasses = classNames.filter(function (className) { return classesByName.has(className); })
            .map(function (className) { return classesByName.get(className); });

        if (selectedClasses.length === 0) {
            // No classes recognised, or none were specified.
            return null;
        } else {
            // Ignore any classes that are not on the same course as the
            // first class.
            const course = selectedClasses[0].course;
            selectedClasses = selectedClasses.filter(function (selectedClass) { return selectedClass.course === course; });
            return new CourseClassSet(selectedClasses);
        }
    }
}

/**
* Formats the selected classes into the given query-string, removing any
* previous matches.
* @sb-param {String} queryString - The original query-string.
* @sb-param {Event} eventData - The event data.
* @sb-param {Array} classIndexes - Array of indexes of selected classes.
* @sb-return {String} The query-string with the selected classes formatted in.
*/
function formatSelectedClasses(queryString: string, eventData, classIndexes: Array<number>): string {
    queryString = removeAll(queryString, CLASS_NAME_REGEXP);
    const classNames = classIndexes.map(function (index) { return eventData.classes[index].name; });
    return queryString + "&class=" + encodeURIComponent(classNames.join(";"));
}

const CHART_TYPE_REGEXP = /(?:^|&|\?)chartType=([^&]+)/;

/**
* Reads the selected chart type from a query string.
* @sb-param {String} queryString - The query string to read the chart type
*     from.
* @sb-return {ChartType|null} Selected chart type, or null if not recognised.
*/
function readChartType(queryString: string): ChartType | null {
    const chartTypeMatch = CHART_TYPE_REGEXP.exec(queryString);
    if (chartTypeMatch === null) {
        return null;
    } else {
        const chartTypeName = chartTypeMatch[1];
        if (ChartTypes.hasOwnProperty(chartTypeName)) {
            return ChartTypes[chartTypeName];
        } else {
            return null;
        }
    }
}

/**
* Formats the given chart type into the query-string
* @sb-param {String} queryString - The original query-string.
* @sb-param {Object} chartType - The chart type
* @sb-return {String} The query-string with the chart-type formatted in.
*/
function formatChartType(queryString: string, chartType: ChartType): string {
    queryString = removeAll(queryString, CHART_TYPE_REGEXP);
    for (const chartTypeName in ChartTypes) {
        if (ChartTypes.hasOwnProperty(chartTypeName) && ChartTypes[chartTypeName] === chartType) {
            return queryString + "&chartType=" + encodeURIComponent(chartTypeName);
        }
    }

    // Unrecognised chart type?
    return queryString;
}

const COMPARE_WITH_REGEXP = /(?:^|&|\?)compareWith=([^&]+)/;

const BUILTIN_COMPARISON_TYPES = ["Winner", "FastestTime", "FastestTimePlus5",
    "FastestTimePlus25", "FastestTimePlus50", "FastestTimePlus100"];

/**
* Reads what to compare against.
* @sb-param {String} queryString - The query string to read the comparison
*     type from.
* @sb-param {CourseClassSet|null} courseClassSet - Course-class set containing
*     selected course-classes, or null if none are selected.
* @sb-return {Object|null} Selected comparison type, or null if not
*     recognised.
*/
function readComparison(queryString: string, courseClassSet: CourseClassSet): boolean | null | { index: number, runner: Competitor } {
    const comparisonMatch = COMPARE_WITH_REGEXP.exec(queryString);
    if (comparisonMatch === null) {
        return null;
    } else {
        const comparisonName = decodeURIComponent(comparisonMatch[1]);
        const defaultIndex = BUILTIN_COMPARISON_TYPES.indexOf(comparisonName);
        if (defaultIndex >= 1) {
            return { index: defaultIndex, runner: null };
        } else if (defaultIndex === 0 && courseClassSet !== null) {
            const hasCompleters = courseClassSet.allCompetitors.some(function (competitor) {
                return competitor.completed();
            });

            if (hasCompleters) {
                return { index: 0, runner: null };
            } else {
                // Cannot select 'Winner' as there was no winner.
                return null;
            }
        } else if (courseClassSet === null) {
            // Not one of the recognised comparison types and we have no
            // classes to look for competitor names within.
            return null;
        } else {
            for (let competitorIndex = 0; competitorIndex < courseClassSet.allCompetitors.length; competitorIndex += 1) {
                const competitor = courseClassSet.allCompetitors[competitorIndex];
                if (competitor.name === comparisonName && competitor.completed()) {
                    return { index: BUILTIN_COMPARISON_TYPES.length, runner: competitor };
                }
            }

            // Didn't find the competitor.
            return null;
        }
    }
}

/**
* Formats the given comparison into the given query-string.
* @sb-param {String} queryString - The original query-string.
* @sb-param {Number} index - Index of the comparison type.
* @sb-param {String} The formatted query-string.
*/
function formatComparison(queryString: string, index: number, runner): string {
    queryString = removeAll(queryString, COMPARE_WITH_REGEXP);
    let comparison = null;
    if (typeof index === typeof 0 && 0 <= index && index < BUILTIN_COMPARISON_TYPES.length) {
        comparison = BUILTIN_COMPARISON_TYPES[index];
    } else if (runner !== null) {
        comparison = runner.name;
    }

    if (comparison === null) {
        return queryString;
    } else {
        return queryString + "&compareWith=" + encodeURIComponent(comparison);
    }
}

const SELECTED_COMPETITORS_REGEXP = /(?:^|&|\?)selected=([^&]+)/;

/**
* Reads what to compare against.
* @sb-param {String} queryString - The query string to read the comparison
*     type from.
* @sb-param {CourseClassSet|null} courseClassSet - Course-class set containing
*     selected course-classes, or null if none are selected.
* @sb-return {Array|null} Array of selected competitor indexes, or null if
*     none found.
*/
function readSelectedCompetitors(queryString: string, courseClassSet: CourseClassSet): Array<number> | null {
    if (courseClassSet === null) {
        return null;
    } else {
        const selectedCompetitorsMatch = SELECTED_COMPETITORS_REGEXP.exec(queryString);
        if (selectedCompetitorsMatch === null) {
            return null;
        } else {
            let competitorNames = decodeURIComponent(selectedCompetitorsMatch[1]).split(";");
            if (competitorNames.indexOf("*") >= 0) {
                // All competitors selected.
                return d3_range(0, courseClassSet.allCompetitors.length);
            }

            competitorNames = d3_set(competitorNames).values();
            const allCompetitorNames = courseClassSet.allCompetitors.map(function (competitor) { return competitor.name; });
            const selectedCompetitorIndexes = [];
            competitorNames.forEach(function (competitorName) {
                const index = allCompetitorNames.indexOf(competitorName);
                if (index >= 0) {
                    selectedCompetitorIndexes.push(index);
                }
            });

            selectedCompetitorIndexes.sort(d3_ascending);
            return (selectedCompetitorIndexes.length === 0) ? null : selectedCompetitorIndexes;
        }
    }
}

/**
* Formats the given selected competitors into the given query-string.
* @sb-param {String} queryString - The original query-string.
* @sb-param {CourseClassSet} courseClassSet - The current course-class set.
* @sb-param {Array} selected - Array of indexes within the course-class set's
*     list of competitors of those that are selected.
* @sb-return {String} Query-string with the selected competitors formatted
*     into it.
*/
function formatSelectedCompetitors(queryString: string, courseClassSet: CourseClassSet, selected: Array<number>) {
    queryString = removeAll(queryString, SELECTED_COMPETITORS_REGEXP);
    const selectedCompetitors = selected.map(function (index) { return courseClassSet.allCompetitors[index]; });
    if (selectedCompetitors.length === 0) {
        return queryString;
    } else if (selectedCompetitors.length === courseClassSet.allCompetitors.length) {
        // Assume all selected competitors are different, so all must be
        // selected.
        return queryString + "&selected=*";
    } else {
        const competitorNames = selectedCompetitors.map(function (comp) { return comp.name; }).join(";");
        return queryString + "&selected=" + encodeURIComponent(competitorNames);
    }
}

const SELECTED_STATISTICS_REGEXP = /(?:^|&|\?)stats=([^&]*)/;

const ALL_STATS_NAMES = ["TotalTime", "SplitTime", "BehindFastest", "TimeLoss"];

/**
* Reads the selected statistics from the query string.
* @sb-param {String} queryString - The query string to read the selected
*     statistics from.
* @sb-return {Object|null} - Object containing the statistics read, or null
*     if no statistics parameter was found.
*/
function readSelectedStatistics(queryString: string): any {
    const statsMatch = SELECTED_STATISTICS_REGEXP.exec(queryString);
    if (statsMatch === null) {
        return null;
    } else {
        const statsNames = decodeURIComponent(statsMatch[1]).split(";");
        const stats: any = {} as any;
        ALL_STATS_NAMES.forEach(function (statsName) { stats[statsName] = false; });

        for (let index = 0; index < statsNames.length; index += 1) {
            const name = statsNames[index];
            if (stats.hasOwnProperty(name)) {
                stats[name] = true;
            } else if (name !== "") {
                // Ignore unrecognised non-empty statistic name.
                return null;
            }
        }

        return stats;
    }
}

/**
* Formats the selected statistics into the given query string.
* @sb-param {String} queryString - The original query-string.
* @sb-param {Object} stats - The statistics to format.
* @sb-return Query-string with the selected statistics formatted in.
*/
function formatSelectedStatistics(queryString: string, stats) {
    queryString = removeAll(queryString, SELECTED_STATISTICS_REGEXP);
    const statsNames = ALL_STATS_NAMES.filter(function (name) { return stats.hasOwnProperty(name) && stats[name]; });
    return queryString + "&stats=" + encodeURIComponent(statsNames.join(";"));
}

const SHOW_ORIGINAL_REGEXP = /(?:^|&|\?)showOriginal=([^&]*)/;

/**
* Reads the show-original-data flag from the given query-string.
*
* To show original data, the parameter showOriginal=1 must be part of the
* URL.  If this parameter does not exist or has some other value, original
* data will not be shown.  If the selected classes do not contain any
* dubious splits, this option will have no effect.
* @sb-param {String} queryString - The query-string to read.
* @sb-return {boolean} True to show original data, false not to.
*/
function readShowOriginal(queryString: string): boolean {
    const showOriginalMatch = SHOW_ORIGINAL_REGEXP.exec(queryString);
    return (showOriginalMatch !== null && showOriginalMatch[1] === "1");
}

/**
* Formats the show-original-data flag into the given query-string.
* @sb-param {String} queryString - The original query-string.
* @sb-param {boolean} showOriginal - True to show original data, false not to.
* @sb-return {String} queryString - The query-string with the show-original
*     data flag formatted in.
*/
function formatShowOriginal(queryString: string, showOriginal: boolean): string {
    queryString = removeAll(queryString, SHOW_ORIGINAL_REGEXP);
    return (showOriginal) ? queryString + "&showOriginal=1" : queryString;
}

const FILTER_TEXT_REGEXP = /(?:^|&|\?)filterText=([^&]*)/;

/**
* Reads the filter text from the given query string.
*
* If no filter text is found, an empty string is returned.
*
* @sb-param {String} queryString - The query-string to read.
* @sb-return {String} The filter text read.
*/
function readFilterText(queryString: string) {
    const filterTextMatch = FILTER_TEXT_REGEXP.exec(queryString);
    if (filterTextMatch === null) {
        return "";
    } else {
        return decodeURIComponent(filterTextMatch[1]);
    }
}

/**
* Formats filter text into the given query-string.
* @sb-param {String} queryString - The original query-string.
* @sb-param {String} filterText - The filter text.
* @sb-return {String} The query-string with the filter text formatted in.
*/
function formatFilterText(queryString: string, filterText: string): string {
    queryString = removeAll(queryString, FILTER_TEXT_REGEXP);
    return (filterText === "") ? queryString : queryString + "&filterText=" + encodeURIComponent(filterText);
}

/**
* Attempts to parse the given query string.
* @sb-param {String} queryString - The query string to parse.
* @sb-param {Event} eventData - The parsed event data.
* @sb-return {Object} The data parsed from the given query string.
*/
export function parseQueryString(queryString: string, eventData: Results): ResultsURLOptions {
    const courseClassSet = readSelectedClasses(queryString, eventData);
    const classIndexes = (courseClassSet === null) ? null :
        courseClassSet.classes.map(function (courseClass) { return eventData.classes.indexOf(courseClass); });
    return {
        classes: classIndexes,
        chartType: readChartType(queryString),
        compareWith: readComparison(queryString, courseClassSet),
        selected: readSelectedCompetitors(queryString, courseClassSet),
        stats: readSelectedStatistics(queryString),
        showOriginal: readShowOriginal(queryString),
        filterText: readFilterText(queryString)
    };
}

/**
* Formats a query string with the given data.
*
* The original query-string is provided, and any argument values within it
* are replaced with those given, and new ones added.  Unrecognised query-
* string parameters are preserved; they could be used server-side by
* whatever web application is hosting SplitsBrowser.
*
* @sb-param {String} queryString - The original query-string.
* @sb-param {OEvent} eventData - The event data.
* @sb-param {CourseClassSet} courseClassSet - The current course-class set.
* @sb-param {Object} data - Object containing the data to format into the
*     query-string.
* @sb-return The formatted query-string.
*/
export function formatQueryString(queryString: string, eventData: Results, courseClassSet: CourseClassSet, data): string {
    queryString = formatSelectedClasses(queryString, eventData, data.classes);
    queryString = formatChartType(queryString, data.chartType);
    queryString = formatComparison(queryString, data.compareWith.index, data.compareWith.runner);
    queryString = formatSelectedCompetitors(queryString, courseClassSet, data.selected);
    queryString = formatSelectedStatistics(queryString, data.stats);
    queryString = formatShowOriginal(queryString, data.showOriginal);
    queryString = formatFilterText(queryString, data.filterText);
    queryString = queryString.replace(/^\??&/, "");
    return queryString;
}
