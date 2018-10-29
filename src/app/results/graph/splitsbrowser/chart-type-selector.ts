// file chart-type-selector.js


import * as d3 from "d3";
import * as $ from "jquery";
import { ChartType } from "./chart-types";
import { Lang } from "./lang";

const getMessage = Lang.getMessage;

/**
* A control that wraps a drop-down list used to choose the types of chart to view.
* @sb-param {HTMLElement} parent - The parent element to add the control to.
* @sb-param {Array} chartTypes - Array of types of chart to list.
*/
export function ChartTypeSelector(parent: HTMLElement, chartTypes: Array<ChartType>) {
    this.changeHandlers = [];
    this.chartTypes = chartTypes;
    this.raceGraphDisabledNotifier = null;
    this.lastSelectedIndex = 0;

    const div = d3.select(parent).append("div")
        .classed("topRowStart", true);

    this.labelSpan = div.append("span");

    const outerThis = this;
    this.dropDown = div.append("select").node();
    $(this.dropDown).bind("change", function () { outerThis.onSelectionChanged(); });

    this.optionsList = d3.select(this.dropDown).selectAll("option").data(chartTypes);
    this.optionsList.enter().append("option");

    this.optionsList = d3.select(this.dropDown).selectAll("option").data(chartTypes);
    this.optionsList.attr("value", function (_value, index) { return index.toString(); });

    this.optionsList.exit().remove();

    this.setMessages();
}

/**
* Sets the messages displayed within this control, following either its
* creation or a change of selected language.
*/
ChartTypeSelector.prototype.setMessages = function () {
    this.labelSpan.text(getMessage("ChartTypeSelectorLabel"));
    this.optionsList.text(function (value) { return getMessage(value.nameKey); });
};

/**
* Sets the function used to disable the selection of the race graph.
*
* If not null, this will be called whenever an attempt to select the race
* graph is made, and the selection will revert to what it was before.  If
* it is null, the race graph can be selected.
*
* @sb-param {?Function} raceGraphDisabledNotifier - Function to call when the
*     race graph is selected
*/
ChartTypeSelector.prototype.setRaceGraphDisabledNotifier = function (raceGraphDisabledNotifier) {
    this.raceGraphDisabledNotifier = raceGraphDisabledNotifier;
    if (this.raceGraphDisabledNotifier !== null && this.chartTypes[this.dropDown.selectedIndex].isRaceGraph) {
        // Race graph has already been selected but now the race graph
        // isn't available, so switch back to the splits graph.
        this.raceGraphDisabledNotifier();
        this.dropDown.selectedIndex = 0;
        this.onSelectionChanged();
    }
};

/**
* Add a change handler to be called whenever the selected type of chart is changed.
*
* The selected type of chart is passed to the handler function.
*
* @sb-param {Function} handler - Handler function to be called whenever the
*                             chart type changes.
*/
ChartTypeSelector.prototype.registerChangeHandler = function (handler) {
    if (this.changeHandlers.indexOf(handler) === -1) {
        this.changeHandlers.push(handler);
    }
};

/**
* Returns the currently-selected chart type.
* @sb-return {Object} The currently-selected chart type.
*/
ChartTypeSelector.prototype.getChartType = function () {
    return this.chartTypes[Math.max(this.dropDown.selectedIndex, 0)];
};

/**
* Sets the chart type.  If the chart type given is not recognised, nothing
* happens.
* @sb-param {Object} chartType - The chart type selected.
*/
ChartTypeSelector.prototype.setChartType = function (chartType) {
    const index = this.chartTypes.indexOf(chartType);
    if (index >= 0) {
        this.dropDown.selectedIndex = index;
        this.onSelectionChanged();
    }
};

/**
* Handle a change of the selected option in the drop-down list.
*/
ChartTypeSelector.prototype.onSelectionChanged = function () {
    if (this.raceGraphDisabledNotifier !== null && this.chartTypes[this.dropDown.selectedIndex].isRaceGraph) {
        this.raceGraphDisabledNotifier();
        this.dropDown.selectedIndex = Math.max(this.lastSelectedIndex, 0);
    }

    this.changeHandlers.forEach(function (handler) { handler(this.chartTypes[this.dropDown.selectedIndex]); }, this);
    this.lastSelectedIndex = this.dropDown.selectedIndex;
};
