// file original-data-selector.js

import { Lang } from "./lang";
import {  } from "d3-collection";

// ID of the div used to contain the object.
// Must match the name defined in styles.css.
const CONTAINER_DIV_ID = "originalDataSelectorContainer";

const getMessage = Lang.getMessage;

/**
* Constructs a new OriginalDataSelector object.
* @constructor
* @sb-param {d3_selection} parent - d3 selection containing the parent to
*     insert the selector into.
*/
export function OriginalDataSelector(parent) {
    this.parent = parent;

    const checkboxId = "originalDataCheckbox";
    this.containerDiv = parent.append("div")
        .classed("topRowStart", true)
        .attr("id", CONTAINER_DIV_ID);

    this.containerDiv.append("div").classed("topRowStartSpacer", true);

    const span = this.containerDiv.append("span");

    const outerThis = this;
    this.checkbox = span.append("input")
        .attr("type", "checkbox")
        .attr("id", checkboxId)
        .on("click", function () { outerThis.fireChangeHandlers(); })
        .node();

    this.label = span.append("label")
        .attr("for", checkboxId)
        .classed("originalDataSelectorLabel", true);

    this.handlers = [];
    this.setMessages();
}

/**
* Sets the messages in this control, following either its creation of a
* change of selected language.
*/
OriginalDataSelector.prototype.setMessages = function () {
    this.label.text(getMessage("ShowOriginalData"));
    this.containerDiv.attr("title", getMessage("ShowOriginalDataTooltip"));
};

/**
* Register a change handler to be called whenever the choice of original or
* repaired data is changed.
*
* If the handler was already registered, nothing happens.
* @sb-param {Function} handler - Function to be called whenever the choice
*                             changes.
*/
OriginalDataSelector.prototype.registerChangeHandler = function (handler) {
    if (this.handlers.indexOf(handler) === -1) {
        this.handlers.push(handler);
    }
};

/**
* Deregister a change handler from being called whenever the choice of
* original or repaired data is changed.
*
* If the handler given was never registered, nothing happens.
* @sb-param {Function} handler - Function to be called whenever the choice
*                             changes.
*/
OriginalDataSelector.prototype.deregisterChangeHandler = function (handler) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
        this.handlers.splice(index, 1);
    }
};

/**
* Fires all change handlers registered.
*/
OriginalDataSelector.prototype.fireChangeHandlers = function () {
    this.handlers.forEach(function (handler) { handler(this.checkbox.checked); }, this);
};

/**
* Returns whether original data is selected.
* @sb-return {boolean} True if original data is selected, false if not.
*/
OriginalDataSelector.prototype.isOriginalDataSelected = function () {
    return this.checkbox.checked;
};

/**
* Selects original data.
*/
OriginalDataSelector.prototype.selectOriginalData = function () {
    this.checkbox.checked = true;
    this.fireChangeHandlers();
};

/**
* Sets whether this original-data selector should be visible.
* @sb-param {boolean} isVisible - True if the original-data selector should be
*     visible, false if it should be hidden.
*/
OriginalDataSelector.prototype.setVisible = function (isVisible) {
    this.containerDiv.style("display", (isVisible) ? null : "none");
};

/**
* Sets whether the control is enabled.
* @sb-param {boolean} isEnabled - True if the control is enabled, false if
*      disabled.
*/
OriginalDataSelector.prototype.setEnabled = function (isEnabled) {
    this.parent.selectAll("label.originalDataSelectorLabel")
        .classed("disabled", !isEnabled);

    this.checkbox.disabled = !isEnabled;
};

