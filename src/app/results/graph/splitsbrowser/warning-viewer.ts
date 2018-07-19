

import * as d3 from "d3";
import * as $ from "jquery";

import { Lang } from "./lang";

const getMessage = Lang.getMessage;

const CONTAINER_DIV_ID = "warningViewerContainer";

/**
* Constructs a new WarningViewer object.
* @constructor
* @sb-param {d3.selection} parent - d3 selection containing the parent to
*     insert the selector into.
*/
export function WarningViewer(parent) {
    this.parent = parent;
    this.warnings = [];

    this.containerDiv = parent.append("div")
        .classed("topRowStart", true)
        .attr("id", CONTAINER_DIV_ID)
        .style("display", "none");

    this.containerDiv.append("div").classed("topRowStartSpacer", true);

    this.warningTriangle = this.createWarningTriangle(this.containerDiv);

    this.warningList = parent.append("div")
        .classed("warningList", true)
        .classed("transient", true)
        .style("position", "absolute")
        .style("display", "none");

    // Ensure that a click outside of the warning list or the selector
    // box closes it.
    // Taken from http://stackoverflow.com/questions/1403615 and adjusted.
    const outerThis = this;
    $(document).click(function (e) {
        if (outerThis.warningList.style("display") !== "none") {
            const container = $("div#warningTriangleContainer,div.warningList");
        //   if (!container.is(e.target) && container.has(e.target).length === 0) {
        //     outerThis.warningList.style("display", "none");
        //    }
        }
    });

    this.setMessages();
}

/**
* Sets the message shown in the tooltip, either as part of initialisation or
* following a change of selected language.
*/
WarningViewer.prototype.setMessages = function () {
    this.containerDiv.attr("title", getMessage("WarningsTooltip"));
};

/**
* Creates the warning triangle.
* @sb-return {Object} d3 selection containing the warning triangle.
*/
WarningViewer.prototype.createWarningTriangle = function () {
    const svgContainer = this.containerDiv.append("div")
        .attr("id", "warningTriangleContainer");
    const svg = svgContainer.append("svg");

    svg.style("width", "21px")
        .style("height", "19px")
        .style("margin-bottom", "-3px");

    svg.append("polygon")
        .attr("points", "1,18 10,0 19,18")
        .style("stroke", "black")
        .style("stroke-width", "1.5px")
        .style("fill", "#ffd426");

    svg.append("text")
        .attr("x", 10)
        .attr("y", 16)
        .attr("text-anchor", "middle")
        .style("font-size", "14px")
        .text("!");

    const outerThis = this;
    svgContainer.on("click", function () { outerThis.showHideErrorList(); });

    return svg;
};

/**
* Sets the list of visible warnings.
* @sb-param {Array} warnings - Array of warning messages.
*/
WarningViewer.prototype.setWarnings = function (warnings) {
    let errorsSelection = this.warningList.selectAll("div")
        .data(warnings);

    errorsSelection.enter().append("div")
        .classed("warning", true);

    errorsSelection = this.warningList.selectAll("div")
        .data(warnings);

    errorsSelection.text(function (errorMessage) { return errorMessage; });
    errorsSelection.exit().remove();
    this.containerDiv.style("display", (warnings && warnings.length > 0) ? "block" : "none");
};

/**
* Shows or hides the list of warnings.
*/
WarningViewer.prototype.showHideErrorList = function () {
    if (this.warningList.style("display") === "none") {
        const offset = $(this.warningTriangle.node()).offset();
        const height = $(this.warningTriangle.node()).outerHeight();
        const width = $(this.warningList.node()).outerWidth();
        this.warningList.style("left", Math.max(offset.left - width / 2, 0) + "px")
            .style("top", (offset.top + height + 5) + "px")
            .style("display", "block");
    } else {
        this.warningList.style("display", "none");
    }
};


