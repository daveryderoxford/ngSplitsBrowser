


import * as d3 from "d3";
import * as $ from "jquery";
import { Lang } from "./lang";

const getMessage = Lang.getMessage;

// ID of the statistics selector control.
// Must match that used in styles.css.
const STATISTIC_SELECTOR_ID = "statisticSelector";

const LABEL_ID_PREFIX = "statisticCheckbox";

// Internal names of the statistics.
const STATISTIC_NAMES = ["TotalTime", "SplitTime", "BehindFastest", "TimeLoss"];

// Message keys for the labels of the four checkboxes.
const STATISTIC_NAME_KEYS = ["StatisticsTotalTime", "StatisticsSplitTime", "StatisticsBehindFastest", "StatisticsTimeLoss"];

// Names of statistics that are selected by default when the application
// starts.
const DEFAULT_SELECTED_STATISTICS = ["SplitTime", "TimeLoss"];

/**
* Control that contains a number of checkboxes for enabling and/or disabling
* the display of various statistics.
* @constructor
* @sb-param {HTMLElement} parent - The parent element.
*/
export function StatisticsSelector(parent) {
    this.div = d3.select(parent).append("div")
        .classed("topRowEnd", true)
        .attr("id", STATISTIC_SELECTOR_ID);

    const childDivs = this.div.selectAll("div")
        .data(STATISTIC_NAMES)
        .enter()
        .append("div")
        .style("display", "inline-block");

    childDivs.append("input")
        .attr("id", function (name) { return LABEL_ID_PREFIX + name; })
        .attr("type", "checkbox")
        .attr("checked", function (name) { return (DEFAULT_SELECTED_STATISTICS.indexOf(name) >= 0) ? "checked" : null; });

    this.statisticLabels = childDivs.append("label")
        .attr("for", function (name) { return LABEL_ID_PREFIX + name; })
        .classed("statisticsSelectorLabel", true);


    const outerThis = this;
    $("input", this.div.node()).bind("change", function () { return outerThis.onCheckboxChanged(); });

    this.handlers = [];

    this.setMessages();
}

/**
* Sets the messages in this control, following either its creation or a
* change of selected language.
*/
StatisticsSelector.prototype.setMessages = function () {
    this.statisticLabels.text(function (name, index) { return getMessage(STATISTIC_NAME_KEYS[index]); });
};

/**
* Deselects all checkboxes.
*
* This method is intended only for test purposes.
*/
StatisticsSelector.prototype.clearAll = function () {
    this.div.selectAll("input").attr("checked", null);
};

/**
* Sets whether the statistics selector controls are enabled.
* @sb-param {boolean} isEnabled - True if the controls are to be enabled,
*      false if the controls are to be disabled.
*/
StatisticsSelector.prototype.setEnabled = function (isEnabled) {
    this.div.selectAll("label.statisticsSelectorLabel")
        .classed("disabled", !isEnabled);
    this.div.selectAll("input")
        .attr("disabled", (isEnabled) ? null : "disabled");
};

/**
* Register a change handler to be called whenever the choice of currently-
* visible statistics is changed.
*
* If the handler was already registered, nothing happens.
* @sb-param {Function} handler - Function to be called whenever the choice
*                             changes.
*/
StatisticsSelector.prototype.registerChangeHandler = function (handler) {
    if (this.handlers.indexOf(handler) === -1) {
        this.handlers.push(handler);
    }
};

/**
* Deregister a change handler from being called whenever the choice of
*  currently-visible statistics is changed.
*
* If the handler given was never registered, nothing happens.
* @sb-param {Function} handler - Function to be called whenever the choice
*                             changes.
*/
StatisticsSelector.prototype.deregisterChangeHandler = function (handler) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
        this.handlers.splice(index, 1);
    }
};

/**
* Return the statistics that are currently enabled.
* @sb-returns {Object} Object that lists all the statistics and whether they
*     are enabled.
*/
StatisticsSelector.prototype.getVisibleStatistics = function () {
    const visibleStats = new Object;
    this.div.selectAll("input").nodes().forEach(function (checkbox, index) {
        visibleStats[STATISTIC_NAMES[index]] = checkbox.checked;
    });

    return visibleStats;
};

/**
* Sets the visible statistics.
* @sb-param {Object} visibleStats - The statistics to make visible.
*/
StatisticsSelector.prototype.setVisibleStatistics = function (visibleStats) {
    this.div.selectAll("input").nodes().forEach(function (checkbox, index) {
        checkbox.checked = visibleStats[STATISTIC_NAMES[index]] || false;
    });

    this.onCheckboxChanged();
};

/**
* Handles the change in state of a checkbox, by firing all of the handlers.
*/
StatisticsSelector.prototype.onCheckboxChanged = function () {
    const checkedFlags = this.getVisibleStatistics();
    this.handlers.forEach(function (handler) { handler(checkedFlags); });
};
