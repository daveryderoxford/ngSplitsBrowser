// file competitor-list.js

import { range as d3_range } from "d3-array";
import { event as d3_event, mouse as d3_mouse, select as d3_select, selectAll as d3_selectAll } from "d3-selection";
import * as $ from "jquery";
import { Competitor } from "../../model";
import { ChartType } from "./chart-types";
import { CompetitorSelection } from "./competitor-selection";
import { Lang } from "./lang";

// ID of the competitor list div.
// Must match that used in styles.css.
const COMPETITOR_LIST_ID = "competitorList";

// The number that identifies the left mouse button.
const LEFT_BUTTON = 1;

// Dummy index used to represent the mouse being let go off the bottom of
// the list of competitors.
const CONTAINER_COMPETITOR_INDEX = -1;

// ID of the container that contains the list and the filter textbox.
const COMPETITOR_LIST_CONTAINER_ID = "competitorListContainer";

const getMessage = Lang.getMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;

/**
* Object that controls a list of competitors from which the user can select.
* @constructor
* @sb-param {HTMLElement} parent - Parent element to add this list to.
* @sb-param {Function} alerter - Function to call to issue an alert message.
*/
export const CompetitorList = function (parent: HTMLElement, alerter) {
    this.parent = parent;
    this.alerter = alerter;
    this.handler = null;
    this.competitorSelection = null;
    this.lastFilterString = "";
    this.allCompetitors = [];
    this.allCompetitorDetails = [];
    this.dragging = false;
    this.dragStartCompetitorIndex = null;
    this.currentDragCompetitorIndex = null;
    this.allCompetitorDivs = [];
    this.inverted = false;
    this.placeholderDiv = null;

    this.changeHandlers = [];

    this.containerDiv = d3_select(parent).append("div")
        .attr("id", COMPETITOR_LIST_CONTAINER_ID);

    this.buttonsPanel = this.containerDiv.append("div");

    const outerThis = this;
    this.allButton = this.buttonsPanel.append("button")
        .attr("id", "selectAllCompetitors")
        .style("width", "50%")
        .on("click", function () { outerThis.selectAllFiltered(); });

    this.noneButton = this.buttonsPanel.append("button")
        .attr("id", "selectNoCompetitors")
        .style("width", "50%")
        .on("click", function () { outerThis.selectNoneFiltered(); });

    // Wire up double-click event with jQuery for easier testing.
    $(this.noneButton.node()).dblclick(function () { outerThis.selectNone(); });

    this.buttonsPanel.append("br");

    this.crossingRunnersButton = this.buttonsPanel.append("button")
        .attr("id", "selectCrossingRunners")
        .style("width", "100%")
        .on("click", function () { outerThis.selectCrossingRunners(); })
        .style("display", "none");

    this.filter = this.buttonsPanel.append("input")
        .attr("type", "text");

    // Update the filtered list of competitors on any change to the
    // contents of the filter textbox.  The last two are for the benefit of
    // IE9 which doesn't fire the input event upon text being deleted via
    // selection or the X button at the right.  Instead, we use delayed
    // updates to filter on key-up and mouse-up, which I believe *should*
    // catch every change.  It's not a problem to update the filter too
    // often: if the filter text hasn't changed, nothing happens.
    this.filter.on("input", function () { outerThis.updateFilterIfChanged(); })
        .on("keyup", function () { outerThis.updateFilterIfChangedDelayed(); })
        .on("mouseup", function () { outerThis.updateFilterIfChangedDelayed(); });

    this.listDiv = this.containerDiv.append("div")
        .attr("id", COMPETITOR_LIST_ID);

    this.listDiv.on("mousedown", function () { outerThis.startDrag(CONTAINER_COMPETITOR_INDEX); })
        .on("mousemove", function () { outerThis.mouseMove(CONTAINER_COMPETITOR_INDEX); })
        .on("mouseup", function () { outerThis.stopDrag(); });

    d3_select(document.body).on("mouseup", function () { outerThis.stopDrag(); });

    this.setMessages();
};

/**
* Sets messages within this control, following either its creation or a
* change of language.
*/
CompetitorList.prototype.setMessages = function () {
    this.allButton.text(getMessage("SelectAllCompetitors"));
    this.noneButton.text(getMessage("SelectNoCompetitors"));
    this.crossingRunnersButton.text(getMessage("SelectCrossingRunners"));
    this.filter.attr("placeholder", getMessage("CompetitorListFilter"));
};

/**
* Retranslates this control following a change of language.
*/
CompetitorList.prototype.retranslate = function () {
    this.setMessages();
    if (this.placeholderDiv !== null) {
        this.placeholderDiv.text(getMessage("NoCompetitorsStarted"));
        this.fireChangeHandlers();
    }
};

/**
* Register a handler to be called whenever the filter text changes.
*
* When a change is made, this function will be called, with no arguments.
*
* If the handler has already been registered, nothing happens.
*
* @sb-param {Function} handler - The handler to register.
*/
CompetitorList.prototype.registerChangeHandler = function (handler) {
    if (this.changeHandlers.indexOf(handler) === -1) {
        this.changeHandlers.push(handler);
    }
};

/**
* Unregister a handler from being called when the filter text changes.
*
* If the handler given was never registered, nothing happens.
*
* @sb-param {Function} handler - The handler to register.
*/
CompetitorList.prototype.deregisterChangeHandler = function (handler) {
    const index = this.changeHandlers.indexOf(handler);
    if (index > -1) {
        this.changeHandlers.splice(index, 1);
    }
};

/**
* Fires all of the change handlers currently registered.
*/
CompetitorList.prototype.fireChangeHandlers = function () {
    this.changeHandlers.forEach(function (handler) { handler(); }, this);
};

/**
* Returns whether the current mouse event is off the bottom of the list of
* competitor divs.
* @sb-return {boolean} True if the mouse is below the last visible div, false
*     if not.
*/
CompetitorList.prototype.isMouseOffBottomOfCompetitorList = function () {
    return this.lastVisibleDiv === null || d3_mouse(this.lastVisibleDiv)[1] >= $(this.lastVisibleDiv).height();
};

/**
* Returns the name of the CSS class to apply to competitor divs currently
* part of the selection/deselection.
* @sb-return {String} CSS class name;
*/
CompetitorList.prototype.getDragClassName = function () {
    return (this.inverted) ? "dragDeselected" : "dragSelected";
};

/**
* Handles the start of a drag over the list of competitors.
* @sb-param {Number} index - Index of the competitor div that the drag started
*     over, or COMPETITOR_CONTAINER_INDEX if below the list of competitors.
*/
CompetitorList.prototype.startDrag = function (index) {
    if (d3_event.which === LEFT_BUTTON) {
        this.dragStartCompetitorIndex = index;
        this.currentDragCompetitorIndex = index;
        this.allCompetitorDivs = $("div.competitor");
        const visibleDivs = this.allCompetitorDivs.filter(":visible");
        this.lastVisibleDiv = (visibleDivs.length === 0) ? null : visibleDivs[visibleDivs.length - 1];
        this.inverted = d3_event.shiftKey;
        if (index === CONTAINER_COMPETITOR_INDEX) {
            // Drag not starting on one of the competitors.
            if (!this.isMouseOffBottomOfCompetitorList()) {
                // User has started the drag in the scrollbar.  Ignore it.
                return;
            }
        } else {
            d3_select(this.allCompetitorDivs[index]).classed(this.getDragClassName(), true);
        }

        d3_event.stopPropagation();
        this.dragging = true;
    }
};

/**
* Handles a mouse-move event. by adjust the range of dragged competitors to
* include the current index.
* @sb-param {Number} dragIndex - The index to which the drag has now moved.
*/
CompetitorList.prototype.mouseMove = function (dragIndex) {
    if (this.dragging) {
        d3_event.stopPropagation();
        if (dragIndex !== this.currentDragCompetitorIndex) {
            const dragClassName = this.getDragClassName();
            d3_selectAll("div.competitor." + dragClassName).classed(dragClassName, false);

            if (this.dragStartCompetitorIndex === CONTAINER_COMPETITOR_INDEX && dragIndex === CONTAINER_COMPETITOR_INDEX) {
                // Drag is currently all off the list, so do nothing further.
                return;
            } else if (dragIndex === CONTAINER_COMPETITOR_INDEX && !this.isMouseOffBottomOfCompetitorList()) {
                // Drag currently goes onto the div's scrollbar.
                return;
            }

            let leastIndex, greatestIndex;
            if (this.dragStartCompetitorIndex === CONTAINER_COMPETITOR_INDEX || dragIndex === CONTAINER_COMPETITOR_INDEX) {
                // One of the ends is off the bottom.
                leastIndex = this.dragStartCompetitorIndex + dragIndex - CONTAINER_COMPETITOR_INDEX;
                greatestIndex = this.allCompetitorDivs.length - 1;
            } else {
                leastIndex = Math.min(this.dragStartCompetitorIndex, dragIndex);
                greatestIndex = Math.max(this.dragStartCompetitorIndex, dragIndex);
            }

            const selectedCompetitors = [];
            for (let index = leastIndex; index <= greatestIndex; index += 1) {
                if (this.allCompetitorDetails[index].visible) {
                    selectedCompetitors.push(this.allCompetitorDivs[index]);
                }
            }

            d3_selectAll(selectedCompetitors).classed(dragClassName, true);
            this.currentDragCompetitorIndex = dragIndex;
        }
    }
};

/**
* Handles the end of a drag in the competitor list.
*/
CompetitorList.prototype.stopDrag = function () {
    if (!this.dragging) {
        // This handler is wired up to mouseUp on the entire document, in
        // order to cancel the drag if it is let go away from the list.  If
        // we're not dragging then we have a mouse-up after a mouse-down
        // somewhere outside of this competitor list.  Ignore it.
        return;
    }

    this.dragging = false;

    const selectedCompetitorIndexes = [];
    const dragClassName = this.getDragClassName();
    for (let index = 0; index < this.allCompetitorDivs.length; index += 1) {
        if ($(this.allCompetitorDivs[index]).hasClass(dragClassName)) {
            selectedCompetitorIndexes.push(index);
        }
    }

    d3_selectAll("div.competitor." + dragClassName).classed(dragClassName, false);

    if (d3_event.currentTarget === document) {
        // Drag ended outside the list.
    } else if (this.currentDragCompetitorIndex === CONTAINER_COMPETITOR_INDEX && !this.isMouseOffBottomOfCompetitorList()) {
        // Drag ended in the scrollbar.
    } else if (selectedCompetitorIndexes.length === 1) {
        // User clicked, or maybe dragged within the same competitor.
        this.toggleCompetitor(selectedCompetitorIndexes[0]);
    } else if (this.inverted) {
        this.competitorSelection.bulkDeselect(selectedCompetitorIndexes);
    } else {
        this.competitorSelection.bulkSelect(selectedCompetitorIndexes);
    }

    this.dragStartCompetitorIndex = null;
    this.currentDragCompetitorIndex = null;

    d3_event.stopPropagation();
};

/**
* Returns the width of the list, in pixels.
* @sb-returns {Number} Width of the list.
*/
CompetitorList.prototype.width = function () {
    return $(this.listDiv.node()).width();
};

/**
* Sets the overall height of the competitor list.
* @sb-param {Number} height - The height of the control, in pixels.
*/
CompetitorList.prototype.setHeight = function (height) {
    $(this.listDiv.node()).height(height - $(this.buttonsPanel.node()).height());
};

/**
* Returns all visible indexes.  This is the indexes of all competitors that
* have not been excluded by the filters.
* @sb-returns {Array} Array of indexes of visible competitors.
*/
CompetitorList.prototype.getAllVisibleIndexes = function () {
    return d3_range(this.allCompetitorDetails.length).filter(function (index) {
        return this.allCompetitorDetails[index].visible;
    }, this);
};

/**
* Selects all of the competitors that are matched by the filter.
*/
CompetitorList.prototype.selectAllFiltered = function () {
    this.competitorSelection.bulkSelect(this.getAllVisibleIndexes());
};

/**
* Selects none of the competitors that are matched by the filter.
*/
CompetitorList.prototype.selectNoneFiltered = function () {
    this.competitorSelection.bulkDeselect(this.getAllVisibleIndexes());
};

/**
* Selects none of the competitors at all.
*/
CompetitorList.prototype.selectNone = function () {
    this.competitorSelection.selectNone();
};

/**
* Returns whether the competitor with the given index is selected.
* @sb-param {Number} index - Index of the competitor within the list.
* @sb-return True if the competitor is selected, false if not.
*/
CompetitorList.prototype.isSelected = function (index: number): boolean {
    return this.competitorSelection !== null && this.competitorSelection.isSelected(index);
};

/**
* Select all of the competitors that cross the unique selected competitor.
*/
CompetitorList.prototype.selectCrossingRunners = function () {
    this.competitorSelection.selectCrossingRunners(this.allCompetitorDetails);
    if (this.competitorSelection.isSingleRunnerSelected()) {
        // Only a single runner is still selected, so nobody crossed the
        // selected runner.
        const competitorName = this.allCompetitors[this.competitorSelection.getSingleRunnerIndex()].name;
        const filterInEffect = (this.lastFilterString.length > 0);
        const messageKey = (filterInEffect) ? "RaceGraphNoCrossingRunnersFiltered" : "RaceGraphNoCrossingRunners";
        this.alerter(getMessageWithFormatting(messageKey, { "$$NAME$$": competitorName }));
    }
};

/**
* Enables or disables the crossing-runners button as appropriate.
*/
CompetitorList.prototype.enableOrDisableCrossingRunnersButton = function () {
    this.crossingRunnersButton.node().disabled = !this.competitorSelection.isSingleRunnerSelected();
};

/**
* Sets the chart type, so that the competitor list knows whether to show or
* hide the Crossing Runners button.
* @sb-param {Object} chartType - The chart type selected.
*/
CompetitorList.prototype.setChartType = function (chartType: ChartType) {
    this.crossingRunnersButton.style("display", (chartType.isRaceGraph) ? "block" : "none");
};

/**
* Handles a change to the selection of competitors, by highlighting all
* those selected and unhighlighting all those no longer selected.
*/
CompetitorList.prototype.selectionChanged = function () {
    const outerThis = this;
    this.listDiv.selectAll("div.competitor")
        .data(d3_range(this.competitorSelection.count))
        .classed("selected", function (comp, index) { return outerThis.isSelected(index); });
};

/**
* Toggle the selectedness of a competitor.
* @sb-param {Number} index - The index of the competitor.
*/
CompetitorList.prototype.toggleCompetitor = function (index: number) {
    this.competitorSelection.toggle(index);
};

/**
* 'Normalise' a name or a search string into a common format.
*
* This is used before searching: a name matches a search string if the
* normalised name contains the normalised search string.
*
* At present, the normalisations carried out are:
* * Conversion to lower case
* * Removing all non-alphanumeric characters.
*
* @sb-param {String} name - The name to normalise.
* @sb-return {String} The normalised names.
*/
function normaliseName(name: string): string {
    return name.toLowerCase().replace(/\W/g, "");
}

/**
* Sets the list of competitors.
* @sb-param {Array} competitors - Array of competitor data.
* @sb-param {boolean} multipleClasses - Whether the list of competitors is
*      made up from those in multiple classes.
*/
CompetitorList.prototype.setCompetitorList = function (competitors: Array<Competitor>, multipleClasses: boolean) {
    this.allCompetitors = competitors;
    this.allCompetitorDetails = this.allCompetitors.map(function (comp) {
        return { competitor: comp, normedName: normaliseName(comp.name), visible: true };
    });

    if (this.placeholderDiv !== null) {
        this.placeholderDiv.remove();
        this.placeholderDiv = null;
    }

    let competitorDivs = this.listDiv.selectAll("div.competitor").data(this.allCompetitors);

    const outerThis = this;
    competitorDivs.enter().append("div")
        .classed("competitor", true)
        .classed("selected", function (comp, index) { return outerThis.isSelected(index); });

    competitorDivs.selectAll("span").remove();

    competitorDivs = this.listDiv.selectAll("div.competitor").data(this.allCompetitors);
    if (multipleClasses) {
        competitorDivs.append("span")
            .classed("competitorClassLabel", true)
            .text(function (comp) { return comp.className; });
    }

    competitorDivs.append("span")
        .classed("nonfinisher", function (comp) { return !comp.completed(); })
        .text(function (comp) { return (comp.completed()) ? comp.name : "* " + comp.name; });

    competitorDivs.exit().remove();

    if (this.allCompetitors.length === 0) {
        this.placeholderDiv = this.listDiv.append("div")
            .classed("competitorListPlaceholder", true)
            .text(getMessage("NoCompetitorsStarted"));
    }

    this.allButton.property("disabled", this.allCompetitors.length === 0);
    this.noneButton.property("disabled", this.allCompetitors.length === 0);
    this.filter.property("disabled", this.allCompetitors.length === 0);

    competitorDivs.on("mousedown", function (_datum, index) { outerThis.startDrag(index); })
        .on("mousemove", function (_datum, index) { outerThis.mouseMove(index); })
        .on("mouseup", function () { outerThis.stopDrag(); });

    // Force an update on the filtering.
    this.updateFilter();
};

/**
* Sets the competitor selection object.
* @sb-param {SplitsBrowser.Controls.CompetitorSelection} selection - Competitor selection.
*/
CompetitorList.prototype.setSelection = function (selection: CompetitorSelection) {
    if (this.competitorSelection !== null) {
        this.competitorSelection.deregisterChangeHandler(this.handler);
    }

    const outerThis = this;
    this.competitorSelection = selection;
    this.handler = function () { outerThis.selectionChanged(); };
    this.competitorSelection.registerChangeHandler(this.handler);
    this.selectionChanged();
};

/**
* Returns the filter text currently being used.
* @sb-return {String} Filter text.
*/
CompetitorList.prototype.getFilterText = function () {
    return this.filter.node().value;
};

/**
* Sets the filter text to use.
* @sb-param {String} filterText - The filter text to use.
*/
CompetitorList.prototype.setFilterText = function (filterText) {
    this.filter.node().value = filterText;
    this.updateFilterIfChanged();
};

/**
* Updates the filtering.
*/
CompetitorList.prototype.updateFilter = function () {
    const currentFilterString = this.filter.node().value;
    const normedFilter = normaliseName(currentFilterString);
    this.allCompetitorDetails.forEach(function (comp) {
        comp.visible = (comp.normedName.indexOf(normedFilter) >= 0);
    });

    const outerThis = this;
    this.listDiv.selectAll("div.competitor")
        .style("display", function (div, index) { return (outerThis.allCompetitorDetails[index].visible) ? null : "none"; });
};

/**
* Updates the filtering following a change in the filter text input, if the
* filter text has changed since last time.  If not, nothing happens.
*/
CompetitorList.prototype.updateFilterIfChanged = function () {
    const currentFilterString = this.getFilterText();
    if (currentFilterString !== this.lastFilterString) {
        this.updateFilter();
        this.lastFilterString = currentFilterString;
        this.fireChangeHandlers();
    }
};

/**
* Updates the filtering following a change in the filter text input
* in a short whiie.
*/
CompetitorList.prototype.updateFilterIfChangedDelayed = function () {
    const outerThis = this;
    setTimeout(function () { outerThis.updateFilterIfChanged(); }, 1);
};
