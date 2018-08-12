/*!
 *  SplitsBrowser - Orienteering results analysis.
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

// tslint:disable:max-line-length
import * as $ from "jquery";
import * as d3 from "d3";
import { Lang } from "./lang";

// import
import { parseEventData } from "../../import";

// Model
import { TimeUtilities, sbTime, Competitor, CourseClass, CourseClassSet, Course, Results, InvalidData } from "../../model";
import { LanguageSelector } from "./lang-selection";
import { isNaNStrict, isNotNullNorNaN } from "../../model/util";
import { Repairer } from "../../model/repairer";

// Controls
import { parseQueryString, formatQueryString } from "./query-string";
import { ChartTypeClass, ChartType } from "./chart-types";
import { CompetitorSelection } from "./competitor-selection";
import { ClassSelector } from "./class-selector";
import { ChartTypeSelector } from "./chart-type-selector";
import { ComparisonSelector } from "./comparision-selection";
import { OriginalDataSelector } from "./original-data-selector";
import { StatisticsSelector } from "./statistics-selection";
import { WarningViewer } from "./warning-viewer";
import { CompetitorList } from "./competitor-list";
import { Chart } from "./chart";
import { ResultsTable } from "./results-table";

const Version = "4.0.0";

// file viewer.js
export interface SplitsbrowserOptions {
    topBar?: string;
    containerElement?: string;
    defaultLanguage?: string;
}

// Delay in milliseconds between a resize event being triggered and the
// page responding to it.
// (Resize events tend to come more than one at a time; if a resize event
// comes in while a previous event is waiting, the previous event is
// cancelled.)
const RESIZE_DELAY_MS = 100;

const getMessage = Lang.getMessage;
const tryGetMessage = Lang.tryGetMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;
const initialiseMessages = Lang.initialiseMessages;

const ChartTypes = ChartTypeClass.chartTypes;

/**
* Checks that D3 version 4 or later is present.
* @sb-return {Boolean} true if D3 version 4 is present, false if no D3 was found
*     or a version of D3 older version 4 was found.
*/
function checkD3Version4(): boolean {
    // DKR d3 imported rather than on the window object
    if (!d3) {
        alert("D3 was not found.  SplitsBrowser requires D3 version 4 or later.");
        return false;
    } else if (parseFloat(d3.version) < 4) {
        alert("D3 version " + d3.version + " was found.  SplitsBrowser requires D3 version 4 or later.");
        return false;
    } else {
        return true;
    }
}

/**
* The 'overall' viewer object responsible for viewing the splits graph.
* @constructor
* @sb-param {?Object} options - Optional object containing various options
*     to SplitsBrowser.
*/
export function Viewer(options: SplitsbrowserOptions) {
    this.options = options;

    this.eventData = null;
    this.classes = null;
    this.currentClasses = [];
    this.chartData = null;
    this.referenceCumTimes = null;
    this.fastestCumTimes = null;
    this.previousCompetitorList = [];

    this.topBarHeight = (options && options.topBar && $(options.topBar).length > 0) ? $(options.topBar).outerHeight(true) : 0;

    this.selection = null;
    this.courseClassSet = null;
    this.languageSelector = null;
    this.classSelector = null;
    this.comparisonSelector = null;
    this.originalDataSelector = null;
    this.statisticsSelector = null;
    this.competitorList = null;
    this.warningViewer = null;
    this.chart = null;
    this.topPanel = null;
    this.mainPanel = null;
    this.buttonsPanel = null;
    this.competitorListContainer = null;
    this.container = null;

    this.currentResizeTimeout = null;
}

/**
* Pops up an alert box with the given message.
*
* The viewer passes this function to various controls so that they can pop
* up an alert box in normal use and call some other function during
* testing.
*
* @sb-param {String} message - The message to show.
*/
function alerter(message: string) {
    alert(message);
}

/**
* Pops up an alert box informing the user that the race graph cannot be
* chosen as the start times are missing.
*/
function alertRaceGraphDisabledAsStartTimesMissing() {
    alert(getMessage("RaceGraphDisabledAsStartTimesMissing"));
}

/**
* Enables or disables the race graph option in the chart type selector
* depending on whether all visible competitors have start times.
*/
Viewer.prototype.enableOrDisableRaceGraph = function () {
    const anyStartTimesMissing = this.courseClassSet.allCompetitors.some(function (competitor) { return competitor.lacksStartTime(); });
    this.chartTypeSelector.setRaceGraphDisabledNotifier((anyStartTimesMissing) ? alertRaceGraphDisabledAsStartTimesMissing : null);
};

/**
* Sets the classes that the viewer can view.
* @sb-param {Event} eventData - All event data loaded.
*/
Viewer.prototype.setReaults = function (eventData: Results) {
    this.eventData = eventData;
    this.classes = eventData.classes;
    if (this.classSelector !== null) {
        this.classSelector.setClasses(this.classes);
    }

    this.warningViewer.setWarnings(eventData.warnings);
};

/**
* Draws the logo in the top panel.
*/
Viewer.prototype.drawLogo = function () {
    this.logoSvg = this.topPanel.append("svg")
        .classed("topRowStart", true);

    this.logoSvg.style("width", "19px")
        .style("height", "19px")
        .style("margin-bottom", "-3px");

    this.logoSvg.append("rect")
        .attr("x", "0")
        .attr("y", "0")
        .attr("width", "19")
        .attr("height", "19")
        .attr("fill", "white");

    this.logoSvg.append("polygon")
        .attr("points", "0,19 19,0 19,19")
        .attr("fill", "red");

    this.logoSvg.append("polyline")
        .attr("points", "0.5,0.5 0.5,18.5 18.5,18.5 18.5,0.5 0.5,0.5 0.5,18.5")
        .attr("stroke", "black")
        .attr("fill", "none");

    this.logoSvg.append("polyline")
        .attr("points", "1,12 5,8 8,14 17,11")
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", "2");

    this.logoSvg.selectAll("*")
        .append("title");

    this.setLogoMessages();
};

/**
* Sets messages in the logo, following either its creation or a change of
* selected language.
*/
Viewer.prototype.setLogoMessages = function () {
    this.logoSvg.selectAll("title")
        .text(getMessageWithFormatting("ApplicationVersion", { "$$VERSION$$": Version }));
};

/**
* Adds a spacer between controls on the top row.
*/
Viewer.prototype.addSpacer = function () {
    this.topPanel.append("div").classed("topRowStartSpacer", true);
};

/**
* Adds the language selector control to the top panel.
*/
Viewer.prototype.addLanguageSelector = function () {
    this.languageSelector = new LanguageSelector(this.topPanel.node());
};

/**
* Adds the class selector control to the top panel.
*/
Viewer.prototype.addClassSelector = function () {
    this.classSelector = new ClassSelector(this.topPanel.node());
    if (this.classes !== null) {
        this.classSelector.setClasses(this.classes);
    }
};

/**
* Adds the chart-type selector to the top panel.
*/
Viewer.prototype.addChartTypeSelector = function () {
    const chartTypes = [ChartTypes.SplitsGraph, ChartTypes.RaceGraph, ChartTypes.PositionAfterLeg,
    ChartTypes.SplitPosition, ChartTypes.PercentBehind, ChartTypes.ResultsTable];

    this.chartTypeSelector = new ChartTypeSelector(this.topPanel.node(), chartTypes);
};

/**
* Adds the comparison selector to the top panel.
*/
Viewer.prototype.addComparisonSelector = function () {
    this.comparisonSelector = new ComparisonSelector(this.topPanel.node(), alerter);
    if (this.classes !== null) {
        this.comparisonSelector.setClasses(this.classes);
    }
};

/**
* Adds a checkbox to select the 'original' data or data after SplitsBrowser
* has attempted to repair it.
*/
Viewer.prototype.addOriginalDataSelector = function () {
    this.originalDataSelector = new OriginalDataSelector(this.topPanel);
};

/**
* Adds a direct link which links directly to SplitsBrowser with the given
* settings.
*/
Viewer.prototype.addDirectLink = function () {
    this.directLink = this.topPanel.append("a")
        .classed("topRowStart", true)
        .attr("id", "directLinkAnchor")
        .attr("href", document.location.href);
    this.setDirectLinkMessages();
};

/**
* Adds the warning viewer to the top panel.
*/
Viewer.prototype.addWarningViewer = function () {
    this.warningViewer = new WarningViewer(this.topPanel);
};

/**
* Sets the text in the direct-link, following either its creation or a
* change in selected language.
*/
Viewer.prototype.setDirectLinkMessages = function () {
    this.directLink.attr("title", tryGetMessage("DirectLinkToolTip", ""))
        .text(getMessage("DirectLink"));
};

/**
* Updates the URL that the direct link points to.
*/
Viewer.prototype.updateDirectLink = function () {
    const data = {
        classes: this.classSelector.getSelectedClasses(),
        chartType: this.chartTypeSelector.getChartType(),
        compareWith: this.comparisonSelector.getComparisonType(),
        selected: this.selection.getSelectedIndexes(),
        stats: this.statisticsSelector.getVisibleStatistics(),
        showOriginal: this.courseClassSet.hasDubiousData() && this.originalDataSelector.isOriginalDataSelected(),
        filterText: this.competitorList.getFilterText()
    };

    const oldQueryString = document.location.search;
    const newQueryString = formatQueryString(oldQueryString, this.eventData, this.courseClassSet, data);
    const oldHref = document.location.href;
    this.directLink.attr("href", oldHref.substring(0, oldHref.length - oldQueryString.length) + "?" + newQueryString.replace(/^\?+/, ""));
};

/**
* Adds the list of competitors, and the buttons, to the page.
*/
Viewer.prototype.addCompetitorList = function () {
    this.competitorList = new CompetitorList(this.mainPanel.node(), alerter);
};

/**
* Construct the UI inside the HTML body.
*/
Viewer.prototype.buildUi = function (options: SplitsbrowserOptions) {
    let rootElement: any;
    // DKR Attach the D3 output to a div with ID of SB container
    if (options && options.containerElement) {
        rootElement = d3.select(options.containerElement);
    } else {
        rootElement = d3.select("body");
    }

    rootElement.style("overflow", "hidden");

    this.container = rootElement.append("div")
        .attr("id", "sbContainer");
    //     this.container == d3.select('.sb');
    //  this.container.append("Hi Dave");

    this.topPanel = this.container.append("div");

    this.drawLogo();
    this.addLanguageSelector();
    this.addSpacer();
    this.addClassSelector();
    this.addSpacer();
    this.addChartTypeSelector();
    this.addSpacer();
    this.addComparisonSelector();
    this.addOriginalDataSelector();
    this.addSpacer();
    this.addDirectLink();
    this.addWarningViewer();

    this.statisticsSelector = new StatisticsSelector(this.topPanel.node());

    // Add an empty div to clear the floating divs and ensure that the
    // top panel 'contains' all of its children.
    this.topPanel.append("div")
        .style("clear", "both");

    this.mainPanel = this.container.append("div");

    this.addCompetitorList();
    this.chart = new Chart(this.mainPanel.node());

    this.resultsTable = new ResultsTable(this.container.node());
    this.resultsTable.hide();

    const outerThis = this;

    $(window).resize(function () { outerThis.handleWindowResize(); });

    // Disable text selection anywhere other than text inputs.
    // This is mainly for the benefit of IE9, which doesn't support any
    // -*-user-select CSS style.
    $("input:text").bind("selectstart", function (evt) { evt.stopPropagation(); });
    $(this.container.node()).bind("selectstart", function () { return false; });

    // Hide 'transient' elements such as the list of other classes in the
    // class selector or warning list when the Escape key is pressed.
    $(document).keydown(function (e) {
        if (e.which === 27) {
            outerThis.hideTransientElements();
        }
    });
};

/**
* Registers change handlers.
*/
Viewer.prototype.registerChangeHandlers = function () {
    const outerThis = this;
    this.languageSelector.registerChangeHandler(function () { outerThis.retranslate(); });
    this.classSelector.registerChangeHandler(function (indexes) { outerThis.selectClasses(indexes); });
    this.chartTypeSelector.registerChangeHandler(function (chartType) { outerThis.selectChartTypeAndRedraw(chartType); });
    this.comparisonSelector.registerChangeHandler(function (comparisonFunc) { outerThis.selectComparison(comparisonFunc); });
    this.originalDataSelector.registerChangeHandler(function (showOriginalData) { outerThis.showOriginalOrRepairedData(showOriginalData); });
    this.competitorList.registerChangeHandler(function () { outerThis.handleFilterTextChanged(); });
};

/**
 * Handle a resize of the window.
 */
Viewer.prototype.handleWindowResize = function () {
    if (this.currentResizeTimeout !== null) {
        clearTimeout(this.currentResizeTimeout);
    }

    const outerThis = this;
    this.currentResizeTimeout = setTimeout(function () { outerThis.postResizeHook(); }, RESIZE_DELAY_MS);
};

/**
* Resize the chart following a change of size of the chart.
*/
Viewer.prototype.postResizeHook = function () {
    this.currentResizeTimeout = null;
    this.setCompetitorListHeight();
    this.setChartSize();
    this.hideTransientElements();
    this.redraw();
};

/**
* Hides all transient elements that happen to be open.
*/
Viewer.prototype.hideTransientElements = function () {
    d3.selectAll(".transient").style("display", "none");
};

/**
* Returns the horizontal margin around the container, i.e. the sum of the
* left and right margin, padding and border for the body element and the
* container element.
* @sb-return {Number} Total horizontal margin.
*/
Viewer.prototype.getHorizontalMargin = function (): number {
    const body = $("app-graph");
    const container = $(this.container.node());
    return (body.outerWidth(true) - body.width()) + (container.outerWidth() - container.width());
};

/**
* Returns the vertical margin around the container, i.e. the sum of the top
* and bottom margin, padding and border for the body element and the
* container element.
* @sb-return {Number} Total vertical margin.
*/
Viewer.prototype.getVerticalMargin = function (): number {
    const parent = $("app-graph");
    const container = $(this.container.node());
    return (parent.outerHeight(true) - parent.height()) + (container.outerHeight() - container.height());
};

/**
* Gets the usable height of the window, i.e. the height of the window minus
* margin and the height of the top bar, if any.  This height is used for
* the competitor list and the chart.
* @sb-return {Number} Usable height of the window.
*/
Viewer.prototype.getUsableHeight = function (): number {
    const bodyHeight = $(window).outerHeight() - this.getVerticalMargin() - this.topBarHeight;
    const topPanelHeight = $(this.topPanel.node()).height();
    return bodyHeight - topPanelHeight;
};

/**
* Sets the height of the competitor list.
*/
Viewer.prototype.setCompetitorListHeight = function () {
    this.competitorList.setHeight(this.getUsableHeight());
};

/**
* Determines the size of the chart and sets it.
*/
Viewer.prototype.setChartSize = function () {
    // Margin around the body element.
    const horzMargin = this.getHorizontalMargin();
    const vertMargin = this.getVerticalMargin();

    // Extra amount subtracted off of the width of the chart in order to
    // prevent wrapping, in units of pixels.
    // 2 to prevent wrapping when zoomed out to 33% in Chrome.
    // DKR TODO Temp bdge as chart seems to be wrapping in chrome currently  was 2. Looks like a scrollbar
    // width associated the mets viewport tag in the index.
    const EXTRA_WRAP_PREVENTION_SPACE = 15;

    const containerWidth = $(window).width() - horzMargin;
    const containerHeight = $(window).height() - vertMargin - this.topBarHeight;

    $(this.container.node()).width(containerWidth).height(containerHeight);

    const chartWidth = containerWidth - this.competitorList.width() - EXTRA_WRAP_PREVENTION_SPACE;
    const chartHeight = this.getUsableHeight();

    this.chart.setSize(chartWidth, chartHeight);
};
/**

* Draw the chart using the current data.
*/
Viewer.prototype.drawChart = function () {
    if (this.chartTypeSelector.getChartType().isResultsTable) {
        return;
    }

    this.currentVisibleStatistics = this.statisticsSelector.getVisibleStatistics();

    if (this.selectionChangeHandler !== null) {
        this.selection.deregisterChangeHandler(this.selectionChangeHandler);
    }

    if (this.statisticsChangeHandler !== null) {
        this.statisticsSelector.deregisterChangeHandler(this.statisticsChangeHandler);
    }

    const outerThis = this;

    this.selectionChangeHandler = function () {
        outerThis.competitorList.enableOrDisableCrossingRunnersButton();
        outerThis.redraw();
        outerThis.updateDirectLink();
    };

    this.selection.registerChangeHandler(this.selectionChangeHandler);

    this.statisticsChangeHandler = function (visibleStatistics) {
        outerThis.currentVisibleStatistics = visibleStatistics;
        outerThis.redraw();
        outerThis.updateDirectLink();
    };

    this.statisticsSelector.registerChangeHandler(this.statisticsChangeHandler);

    this.updateControlEnabledness();
    if (this.classes.length > 0) {
        const comparisonFunction = this.comparisonSelector.getComparisonFunction();
        this.referenceCumTimes = comparisonFunction(this.courseClassSet);
        this.fastestCumTimes = this.courseClassSet.getFastestCumTimes();
        this.chartData = this.courseClassSet.getChartData(this.referenceCumTimes, this.selection.getSelectedIndexes(), this.chartTypeSelector.getChartType());
        this.redrawChart();
    }
};

/**
* Redraws the chart using all of the current data.
*/
Viewer.prototype.redrawChart = function () {
    const data = {
        chartData: this.chartData,
        eventData: this.eventData,
        courseClassSet: this.courseClassSet,
        referenceCumTimes: this.referenceCumTimes,
        fastestCumTimes: this.fastestCumTimes
    };

    this.chart.drawChart(data, this.selection.getSelectedIndexes(), this.currentVisibleStatistics, this.chartTypeSelector.getChartType());
};

/**
* Redraw the chart, possibly using new data.
*/
Viewer.prototype.redraw = function () {
    const chartType = this.chartTypeSelector.getChartType();
    if (!chartType.isResultsTable) {
        this.chartData = this.courseClassSet.getChartData(this.referenceCumTimes, this.selection.getSelectedIndexes(), chartType);
        this.redrawChart();
    }
};

/**
* Retranslates the UI following a change of language.
*/
Viewer.prototype.retranslate = function () {
    this.setLogoMessages();
    this.languageSelector.setMessages();
    this.classSelector.retranslate();
    this.chartTypeSelector.setMessages();
    this.comparisonSelector.setMessages();
    this.originalDataSelector.setMessages();
    this.setDirectLinkMessages();
    this.statisticsSelector.setMessages();
    this.warningViewer.setMessages();
    this.competitorList.retranslate();
    this.resultsTable.retranslate();
    if (!this.chartTypeSelector.getChartType().isResultsTable) {
        this.redrawChart();
    }
};

/**
* Sets the currently-selected classes in various objects that need it:
* current course-class set, comparison selector and results table.
* @sb-param {Array} classIndexes - Array of selected class indexes.
*/
Viewer.prototype.setClasses = function (classIndexes: Array<number>) {
    this.currentClasses = classIndexes.map(function (index) { return this.classes[index]; }, this);
    this.courseClassSet = new CourseClassSet(this.currentClasses);
    this.comparisonSelector.setCourseClassSet(this.courseClassSet);
    this.resultsTable.setClass(this.currentClasses.length > 0 ? this.currentClasses[0] : null);
    this.enableOrDisableRaceGraph();
    this.originalDataSelector.setVisible(this.courseClassSet.hasDubiousData());
};

/**
* Initialises the viewer with the given initial classes.
* @sb-param {Array} classIndexes - Array of selected class indexes.
*/
Viewer.prototype.initClasses = function (classIndexes: Array<number>) {
    this.classSelector.selectClasses(classIndexes);
    this.setClasses(classIndexes);
    this.competitorList.setCompetitorList(this.courseClassSet.allCompetitors, (this.currentClasses.length > 1));
    this.selection = new CompetitorSelection(this.courseClassSet.allCompetitors.length);
    this.competitorList.setSelection(this.selection);
    this.previousCompetitorList = this.courseClassSet.allCompetitors;
};

/**
* Change the graph to show the classes with the given indexes.
* @sb-param {Array<Number}> classIndexes - The (zero-based) indexes of the classes.
*/
Viewer.prototype.selectClasses = function (classIndexes: Array<number>) {
    if (classIndexes.length > 0 && this.currentClasses.length > 0 && this.classes[classIndexes[0]] === this.currentClasses[0]) {
        // The 'primary' class hasn't changed, only the 'other' ones.
        // In this case we don't clear the selection.
    } else {
        this.selection.selectNone();
    }

    this.setClasses(classIndexes);
    this.competitorList.setCompetitorList(this.courseClassSet.allCompetitors, (this.currentClasses.length > 1));
    this.selection.migrate(this.previousCompetitorList, this.courseClassSet.allCompetitors);
    this.competitorList.selectionChanged();
    if (!this.chartTypeSelector.getChartType().isResultsTable) {
        this.setChartSize();
        this.drawChart();
    }
    this.previousCompetitorList = this.courseClassSet.allCompetitors;
    this.updateDirectLink();
};

/**
* Change the graph to compare against a different reference.
*/
Viewer.prototype.selectComparison = function () {
    this.drawChart();
    this.updateDirectLink();
};

/**
* Change the type of chart shown.
* @sb-param {Object} chartType - The type of chart to draw.
*/
Viewer.prototype.selectChartType = function (chartType: ChartType) {
    if (chartType.isResultsTable) {
        this.mainPanel.style("display", "none");

        // Remove any fixed width and height on the container, as well as
        // overflow:hidden on the body, as we need the window to be able
        // to scroll if the results table is too wide or too tall and also
        // adjust size if one or both scrollbars appear.
        this.container.style("width", null).style("height", null);
        d3.select("body").style("overflow", null);

        this.resultsTable.show();
    } else {
        this.resultsTable.hide();
        // TODO Should be root to application
        d3.select("body").style("overflow", "hidden");
        this.mainPanel.style("display", null);
        this.setChartSize();
    }

    this.updateControlEnabledness();
    this.competitorList.setChartType(chartType);
};

/**
* Change the type of chart shown.
* @sb-param {Object} chartType - The type of chart to draw.
*/
Viewer.prototype.selectChartTypeAndRedraw = function (chartType: ChartType) {
    this.selectChartType(chartType);
    if (!chartType.isResultsTable) {
        this.setCompetitorListHeight();
        this.drawChart();
    }

    this.updateDirectLink();
};

/**
* Selects original or repaired data, doing any recalculation necessary.
* @sb-param {boolean} showOriginalData - True to show original data, false to
*     show repaired data.
*/
Viewer.prototype.selectOriginalOrRepairedData = function (showOriginalData: boolean) {
    if (showOriginalData) {
        Repairer.transferCompetitorData(this.eventData);
    } else {
        Repairer.repairEventData(this.eventData);
    }

    this.eventData.determineTimeLosses();
};

/**
* Shows original or repaired data.
* @sb-param {boolean} showOriginalData - True to show original data, false to
*     show repaired data.
*/
Viewer.prototype.showOriginalOrRepairedData = function (showOriginalData: boolean) {
    this.selectOriginalOrRepairedData(showOriginalData);
    this.drawChart();
    this.updateDirectLink();
};

/**
* Handles a change in the filter text in the competitor list.
*/
Viewer.prototype.handleFilterTextChanged = function () {
    this.setChartSize();
    this.redraw();
    this.updateDirectLink();
};

/**
* Updates whether a number of controls are enabled.
*/
Viewer.prototype.updateControlEnabledness = function () {
    const chartType = this.chartTypeSelector.getChartType();
    this.classSelector.setOtherClassesEnabled(!chartType.isResultsTable);
    this.comparisonSelector.setEnabled(!chartType.isResultsTable);
    this.statisticsSelector.setEnabled(!chartType.isResultsTable);
    this.originalDataSelector.setEnabled(!chartType.isResultsTable);
    this.competitorList.enableOrDisableCrossingRunnersButton();
};

/**
* Updates the state of the viewer to reflect query-string arguments parsed.
* @sb-param {Object} parsedQueryString - Parsed query-string object.
*/
Viewer.prototype.updateFromQueryString = function (parsedQueryString) {
    if (parsedQueryString.classes === null) {
        this.setDefaultSelectedClass();
    } else {
        this.initClasses(parsedQueryString.classes);
    }

    if (parsedQueryString.chartType !== null) {
        this.chartTypeSelector.setChartType(parsedQueryString.chartType);
        this.selectChartType(parsedQueryString.chartType);
    }

    if (parsedQueryString.compareWith !== null) {
        this.comparisonSelector.setComparisonType(parsedQueryString.compareWith.index, parsedQueryString.compareWith.runner);
    }

    if (parsedQueryString.selected !== null) {
        this.selection.setSelectedIndexes(parsedQueryString.selected);
    }

    if (parsedQueryString.stats !== null) {
        this.statisticsSelector.setVisibleStatistics(parsedQueryString.stats);
    }

    if (parsedQueryString.showOriginal && this.courseClassSet.hasDubiousData()) {
        this.originalDataSelector.selectOriginalData();
        this.selectOriginalOrRepairedData(true);
    }

    if (parsedQueryString.filterText !== "") {
        this.competitorList.setFilterText(parsedQueryString.filterText);
    }
};

/**
* Sets the default selected class.
*/
Viewer.prototype.setDefaultSelectedClass = function () {
    this.initClasses((this.classes.length > 0) ? [0] : []);
};

/**
* Shows a message that appears if SplitsBrowser is unable to load event
* data.
* @sb-param {String} key - The key of the message to show.
* @sb-param {Object} params - Object mapping parameter names to values.
*/
function showLoadFailureMessage(key: string, params) {
    const errorDiv = d3.select("body")
        .append("div")
        .classed("sbErrors", true);

    errorDiv.append("h1")
        .text(getMessage("LoadFailedHeader"));

    errorDiv.append("p")
        .text(getMessageWithFormatting(key, params));
}

/**
* Reads in the data in the given string and starts SplitsBrowser.
* @sb-param {String} data - String containing the data to read.
* @sb-param {Object|String|HTMLElement|undefined} options - Optional object
*     containing various options to SplitsBrowser.  It can also be used for
*     an HTML element that forms a 'banner' across the top of the page.
*     This element can be specified by a CSS selector for the element, or
*     the HTML element itself, although this behaviour is deprecated.
*/
export const displayGraph = function (results: Results, options: SplitsbrowserOptions) {
    if (!checkD3Version4()) {
        return;
    }

    // remove any sbcontainer instances.
    removeGraph();

    if (typeof options === "string") {
        // Deprecated; support the top-bar specified only as a
        // string.
        options = { topBar: options };
    }

    if (options && options.defaultLanguage) {
        initialiseMessages(options.defaultLanguage);
    }

    const viewer = new Viewer(options);
    viewer.buildUi(options);

    if (results.needsRepair()) {
        Repairer.repairEventData(results);
    }

    results.determineTimeLosses();
    viewer.setReaults(results);

    const queryString = document.location.search;
    if (queryString !== null && queryString.length > 0) {
        const parsedQueryString = parseQueryString(queryString, results);
        viewer.updateFromQueryString(parsedQueryString);
    } else {
        viewer.setDefaultSelectedClass();
    }

    viewer.setCompetitorListHeight();
    viewer.setChartSize();
    viewer.drawChart();
    viewer.registerChangeHandlers();

};

export const removeGraph = function () {
     $('#sbContainer').remove();
};

