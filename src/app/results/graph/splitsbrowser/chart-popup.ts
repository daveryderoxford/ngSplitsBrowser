// file chart-popup.js

import { select as d3_select } from "d3-selection";
import * as $ from "jquery";
import { TimeUtilities } from "../../model";

/**
* Creates a ChartPopup control.
* @constructor
* @sb-param {HTMLElement} parent - Parent HTML element.
* @sb-param {Object} handlers - Object that maps mouse event names to handlers.
*/
export function ChartPopup(parent, handlers) {

    this.shown = false;
    this.mouseIn = false;
    this.popupDiv = d3_select(parent).append("div");
    this.popupDiv.classed("chartPopup", true)
        .style("display", "none")
        .style("position", "absolute");

    this.dataHeader = this.popupDiv.append("div")
        .classed("chartPopupHeader", true)
        .append("span");

    const tableContainer = this.popupDiv.append("div")
        .classed("chartPopupTableContainer", true);


    this.dataTable = tableContainer.append("table");

    this.popupDiv.selectAll(".nextControls").style("display", "none");

    // At this point we need to pass through mouse events to the parent.
    // This is solely for the benefit of IE < 11, as IE11 and other
    // browsers support pointer-events: none, which means that this div
    // receives no mouse events at all.
    for (const eventName in handlers) {
        if (handlers.hasOwnProperty(eventName)) {
            $(this.popupDiv.node()).on(eventName, handlers[eventName]);
        }
    }

    const outerThis = this;
    $(this.popupDiv.node()).mouseenter(function () { outerThis.mouseIn = true; });
    $(this.popupDiv.node()).mouseleave(function () { outerThis.mouseIn = false; });
}

/**
* Returns whether the popup is currently shown.
* @sb-return {boolean} True if the popup is shown, false otherwise.
*/
ChartPopup.prototype.isShown = function () {
    return this.shown;
};

/**
* Returns whether the mouse is currently over the popup.
* @sb-return {boolean} True if the mouse is over the popup, false otherwise.
*/
ChartPopup.prototype.isMouseIn = function () {
    return this.mouseIn;
};

/**
* Populates the chart popup with data.
*
* 'competitorData' should be an object that contains a 'title', a 'data'
* and a 'placeholder' property.  The 'title' is a string used as the
* popup's title.  The 'data' property is an array where each element should
* be an object that contains the following properties:
* * time - A time associated with a competitor.  This may be a split time,
*   cumulative time or the time of day.
* * className (Optional) - Name of the competitor's class.
* * name - The name of the competitor.
* * highlight - A boolean value which indicates whether to highlight the
*   competitor.
* The 'placeholder' property is a placeholder string to show if there is no
* 'data' array is empty.  It can be null to show no such message.
* @sb-param {Object} competitorData - Array of data to show.
* @sb-param {boolean} includeClassNames - Whether to include class names.
*/
ChartPopup.prototype.setData = function (competitorData, includeClassNames) {
    this.dataHeader.text(competitorData.title);

    let rows = this.dataTable.selectAll("tr")
        .data(competitorData.data);

    rows.enter().append("tr");

    rows = this.dataTable.selectAll("tr")
        .data(competitorData.data);
    rows.classed("highlighted", function (row) { return row.highlight; });

    rows.selectAll("td").remove();
    rows.append("td").text(function (row) { return TimeUtilities.formatTime(row.time); });
    if (includeClassNames) {
        rows.append("td").text(function (row) { return row.className; });
    }
    rows.append("td").text(function (row) { return row.name; });

    rows.exit().remove();

    if (competitorData.data.length === 0 && competitorData.placeholder !== null) {
        this.dataTable.append("tr")
            .append("td")
            .text(competitorData.placeholder);
    }
};

/**
* Sets the next-controls data.
*
* The next-controls data should be an object that contains two properties:
* * thisControl - The 'current' control.
* * nextControls - Array of objects, each with 'course' and 'nextControl'
*   properties.
*
* @sb-param {Object} nextControlsData - The next-controls data.
*/
ChartPopup.prototype.setNextControlData = function (nextControlsData) {
    this.dataHeader.text(nextControlsData.thisControl);

    const rows = this.dataTable.selectAll("tr")
        .data(nextControlsData.nextControls);
    rows.enter().append("tr");

    rows.selectAll("td").remove();
    rows.classed("highlighted", false);
    rows.append("td").text(function (nextControlData) { return nextControlData.course.name; });
    rows.append("td").text("-->");
    rows.append("td").text(function (nextControlData) { return nextControlData.nextControls; });

    rows.exit().remove();
};

/**
* Adjusts the location of the chart popup.
*
* The location object should contain "x" and "y" properties.  The two
* coordinates are in units of pixels from top-left corner of the viewport.
*
* @sb-param {Object} location - The location of the chart popup.
*/
ChartPopup.prototype.setLocation = function (location) {
    this.popupDiv.style("left", location.x + "px")
        .style("top", location.y + "px");
};

/**
* Shows the chart popup.
*
* The location object should contain "x" and "y" properties.  The two
* coordinates are in units of pixels from top-left corner of the viewport.
*
* @sb-param {Object} location - The location of the chart popup.
*/
ChartPopup.prototype.show = function (location) {
    this.popupDiv.style("display", null);
    this.shown = true;
    this.setLocation(location);
};

/**
* Hides the chart popup.
*/
ChartPopup.prototype.hide = function () {
    this.popupDiv.style("display", "none");
    this.shown = false;
};

/**
* Returns the height of the popup, in units of pixels.
* @sb-return {Number} Height of the popup, in pixels.
*/
ChartPopup.prototype.height = function () {
    return $(this.popupDiv.node()).height();
};

