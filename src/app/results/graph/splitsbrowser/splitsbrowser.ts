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


// Tell JSHint not to complain that this isn't used anywhere.
/* exported SplitsBrowser */
/* exported SplitsBrowser */
import * as $ from "jquery";
import * as d3 from "d3";

import { isNaNStrict, InvalidData, isNotNullNorNaN, isNotNull, normaliseLineEndings, WrongFileFormat, parseCourseLength, parseCourseClimb, isTrue } from "./util";

import { Lang } from "./lang/lang"

// Model
import { TimeUtilities, sbTime } from "./time";
import { Competitor } from "./competitor";
import { CourseClass } from "./course-class";
import { CourseClassSet } from "./course-class-set";
import { Course } from "./course";
import { Results } from "./results";

// Graph
import { ChartTypeClass, ChartType } from "./chart-types";
import { CompetitorSelection } from "./competitor-selection";
import { parseEventData } from "./input";

export let SplitsBrowser = {} as any;

SplitsBrowser.Version = "4.0.0";

SplitsBrowser.Controls = {} as any;

// file data-repair.js
(function () {
    "use strict";

    interface FirstNonAssendingIndices {
        first: number;
        second: number;
    }

    // Maximum number of minutes added to finish splits to ensure that all
    // competitors have sensible finish splits.
    const MAX_FINISH_SPLIT_MINS_ADDED = 5;

    /**
     * Construct a Repairer, for repairing some data.
    */
    const Repairer = function () {
        this.madeAnyChanges = false;
    };

    /**
     * Returns the positions at which the first pair of non-ascending cumulative
     * times are found.  This is returned as an object with 'first' and 'second'
     * properties.
     *
     * If the entire array of cumulative times is strictly ascending, this
     * returns null.
     *
     * @sb-param {Array} cumTimes - Array of cumulative times.
     * @sb-return {?Object} Object containing indexes of non-ascending entries, or
     *     null if none found.
     */
    function getFirstNonAscendingIndexes(cumTimes: Array<sbTime>): FirstNonAssendingIndices | null {
        if (cumTimes.length === 0 || cumTimes[0] !== 0) {
            throw new InvalidData("cumulative times array does not start with a zero cumulative time");
        }

        let lastNumericTimeIndex = 0;

        for (let index = 1; index < cumTimes.length; index += 1) {
            const time = cumTimes[index];
            if (isNotNullNorNaN(time)) {
                // This entry is numeric.
                if (time <= cumTimes[lastNumericTimeIndex]) {
                    return { first: lastNumericTimeIndex, second: index };
                }

                lastNumericTimeIndex = index;
            }
        }

        // If we get here, the entire array is in strictly-ascending order.
        return null;
    }

    /**
    * Remove, by setting to NaN, any cumulative time that is equal to the
    * previous cumulative time.
    * @sb-param {Array} cumTimes - Array of cumulative times.
    */
    Repairer.prototype.removeCumulativeTimesEqualToPrevious = function (cumTimes: Array<number>) {
        let lastCumTime = cumTimes[0];
        for (let index = 1; index + 1 < cumTimes.length; index += 1) {
            if (cumTimes[index] !== null && cumTimes[index] === lastCumTime) {
                cumTimes[index] = NaN;
                this.madeAnyChanges = true;
            } else {
                lastCumTime = cumTimes[index];
            }
        }
    };

    /**
    * Remove from the cumulative times given any individual times that cause
    * negative splits and whose removal leaves all of the remaining splits in
    * strictly-ascending order.
    *
    * This method does not compare the last two cumulative times, so if the
    * finish time is not after the last control time, no changes will be made.
    *
    * @sb-param {Array} cumTimes - Array of cumulative times.
    * @sb-return {Array} Array of cumulaive times with perhaps some cumulative
    *     times taken out.
    */
    Repairer.prototype.removeCumulativeTimesCausingNegativeSplits = function (cumTimes: Array<sbTime>): Array<sbTime> {

        let nonAscIndexes = getFirstNonAscendingIndexes(cumTimes);
        while (nonAscIndexes !== null && nonAscIndexes.second + 1 < cumTimes.length) {

            // So, we have a pair of cumulative times that are not in strict
            // ascending order, with the second one not being the finish.  If
            // the second time is not the finish cumulative time for a
            // completing competitor, try the following in order until we get a
            // list of cumulative times in ascending order:
            // * Remove the second cumulative time,
            // * Remove the first cumulative time.
            // If one of these allows us to push the next non-ascending indexes
            // beyond the second, remove the offending time and keep going.  By
            // 'remove' we mean 'replace with NaN'.
            //
            // We don't want to remove the finish time for a competitor as that
            // removes their total time as well.  If the competitor didn't
            // complete the course, then we're not so bothered; they've
            // mispunched so they don't have a total time anyway.

            const first = nonAscIndexes.first;
            const second = nonAscIndexes.second;

            let progress = false;

            for (let attempt = 1; attempt <= 3; attempt += 1) {
                // 1 = remove second, 2 = remove first, 3 = remove first and the one before.
                const adjustedCumTimes = cumTimes.slice();

                if (attempt === 3 && (first === 1 || !isNotNullNorNaN(cumTimes[first - 1]))) {
                    // Can't remove first and the one before because there
                    // isn't a time before or it's already blank.
                } else {
                    if (attempt === 1) {
                        adjustedCumTimes[second] = NaN;
                    } else if (attempt === 2) {
                        adjustedCumTimes[first] = NaN;
                    } else if (attempt === 3) {
                        adjustedCumTimes[first] = NaN;
                        adjustedCumTimes[first - 1] = NaN;
                    }

                    const nextNonAscIndexes = getFirstNonAscendingIndexes(adjustedCumTimes);
                    if (nextNonAscIndexes === null || nextNonAscIndexes.first > second) {
                        progress = true;
                        cumTimes = adjustedCumTimes;
                        this.madeAnyChanges = true;
                        nonAscIndexes = nextNonAscIndexes;
                        break;
                    }
                }
            }

            if (!progress) {
                break;
            }
        }

        return cumTimes;
    };

    /**
    * Removes the finish cumulative time from a competitor if it is absurd.
    *
    * It is absurd if it is less than the time at the previous control by at
    * least the maximum amount of time that can be added to finish splits.
    *
    * @sb-param {Array} cumTimes - The cumulative times to perhaps remove the
    *     finish split from.
    */
    Repairer.prototype.removeFinishTimeIfAbsurd = function (cumTimes: Array<sbTime>): void {
        const finishTime = cumTimes[cumTimes.length - 1];
        const lastControlTime = cumTimes[cumTimes.length - 2];
        if (isNotNullNorNaN(finishTime) &&
            isNotNullNorNaN(lastControlTime) &&
            finishTime <= lastControlTime - MAX_FINISH_SPLIT_MINS_ADDED * 60) {
            cumTimes[cumTimes.length - 1] = NaN;
            this.madeAnyChanges = true;
        }
    };

    /**
    * Attempts to repair the cumulative times for a competitor.  The repaired
    * cumulative times are written back into the competitor.
    *
    * @sb-param {Competitor} competitor - Competitor whose cumulative times we
    *     wish to repair.
    */
    Repairer.prototype.repairCompetitor = function (competitor: Competitor): void {
        let cumTimes = competitor.originalCumTimes.slice(0);

        this.removeCumulativeTimesEqualToPrevious(cumTimes);

        cumTimes = this.removeCumulativeTimesCausingNegativeSplits(cumTimes);

        if (!competitor.completed()) {
            this.removeFinishTimeIfAbsurd(cumTimes);
        }

        competitor.setRepairedCumulativeTimes(cumTimes);
    };

    /**
    * Attempt to repair all of the data within a course-class.
    * @sb-param {CourseClass} courseClass - The class whose data we wish to
    *     repair.
    */
    Repairer.prototype.repairCourseClass = function (courseClass: CourseClass): void {
        this.madeAnyChanges = false;
        courseClass.competitors.forEach(function (competitor) {
            this.repairCompetitor(competitor);
        }, this);

        if (this.madeAnyChanges) {
            courseClass.recordHasDubiousData();
        }
    };

    /**
    * Attempt to carry out repairs to the data in an event.
    * @sb-param {Results} eventData - The event data to repair.
    */
    Repairer.prototype.repairEventData = function (resultsData: Results): void {
        resultsData.classes.forEach(function (courseClass) {
            this.repairCourseClass(courseClass);
        }, this);
    };

    /**
    * Attempt to carry out repairs to the data in an event.
    * @sb-param {Results} eventData - The event data to repair.
    */
    function repairEventData(resultsData: Results): void {
        const repairer = new Repairer();
        repairer.repairEventData(resultsData);
    }

    /**
    * Transfer the 'original' data for each competitor to the 'final' data.
    *
    * This is used if the input data has been read in a format that requires
    * the data to be checked, but the user has opted not to perform any such
    * reparations and wishes to view the raw data
    * @sb-param {Event} eventData - The event data to repair.
    */
    function transferCompetitorData(resultsData: Results): void {
        resultsData.classes.forEach(function (courseClass) {
            courseClass.competitors.forEach(function (competitor) {
                competitor.setRepairedCumulativeTimes(competitor.getAllOriginalCumulativeTimes());
            });
        });
    }

    SplitsBrowser.DataRepair = {
        repairEventData: repairEventData,
        transferCompetitorData: transferCompetitorData
    };
})();

// file competitor-list.js
(function () {
    "use strict";

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
    const CompetitorList = function (parent: HTMLElement, alerter) {
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

        this.containerDiv = d3.select(parent).append("div")
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

        d3.select(document.body).on("mouseup", function () { outerThis.stopDrag(); });

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
        return this.lastVisibleDiv === null || d3.mouse(this.lastVisibleDiv)[1] >= $(this.lastVisibleDiv).height();
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
        if (d3.event.which === LEFT_BUTTON) {
            this.dragStartCompetitorIndex = index;
            this.currentDragCompetitorIndex = index;
            this.allCompetitorDivs = $("div.competitor");
            const visibleDivs = this.allCompetitorDivs.filter(":visible");
            this.lastVisibleDiv = (visibleDivs.length === 0) ? null : visibleDivs[visibleDivs.length - 1];
            this.inverted = d3.event.shiftKey;
            if (index === CONTAINER_COMPETITOR_INDEX) {
                // Drag not starting on one of the competitors.
                if (!this.isMouseOffBottomOfCompetitorList()) {
                    // User has started the drag in the scrollbar.  Ignore it.
                    return;
                }
            } else {
                d3.select(this.allCompetitorDivs[index]).classed(this.getDragClassName(), true);
            }

            d3.event.stopPropagation();
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
            d3.event.stopPropagation();
            if (dragIndex !== this.currentDragCompetitorIndex) {
                const dragClassName = this.getDragClassName();
                d3.selectAll("div.competitor." + dragClassName).classed(dragClassName, false);

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

                d3.selectAll(selectedCompetitors).classed(dragClassName, true);
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

        d3.selectAll("div.competitor." + dragClassName).classed(dragClassName, false);

        if (d3.event.currentTarget === document) {
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

        d3.event.stopPropagation();
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
        return d3.range(this.allCompetitorDetails.length).filter(function (index) {
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
            .data(d3.range(this.competitorSelection.count))
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

    SplitsBrowser.Controls.CompetitorList = CompetitorList;
})();

// file language-selector.js
(function () {
    "use strict";

    const getMessage = Lang.getMessage;
    const getLanguage = Lang.getLanguage;
    const getLanguageName = Lang.getLanguageName;
    const setLanguage = Lang.setLanguage;

    /**
    * A control that wraps a drop-down list used to choose the language to view.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    */
    function LanguageSelector(parent) {
        this.changeHandlers = [];
        this.label = null;
        this.dropDown = null;

        this.allLanguages = Lang.getAllLanguages();

        if (this.allLanguages.length < 2) {
            // User hasn't loaded multiple languages, so no point doing
            // anything further here.
            return;
        }

        d3.select(parent).append("div")
            .classed("topRowStartSpacer", true);

        const div = d3.select(parent).append("div")
            .classed("topRowStart", true);

        this.label = div.append("span");

        const outerThis = this;
        this.dropDown = div.append("select").node();
        $(this.dropDown).bind("change", function () { outerThis.onLanguageChanged(); });

        let optionsList = d3.select(this.dropDown).selectAll("option").data(this.allLanguages);
        optionsList.enter().append("option");

        optionsList = d3.select(this.dropDown).selectAll("option").data(this.allLanguages);
        optionsList.attr("value", function (language: string): string { return language; })
            .text(function (language: string) { return getLanguageName(language); });

        optionsList.exit().remove();

        this.setLanguage(getLanguage());
        this.setMessages();
    }

    /**
    * Sets the text of various messages in this control, following either its
    * creation or a change of language.
    */
    LanguageSelector.prototype.setMessages = function () {
        this.label.text(getMessage("LanguageSelectorLabel"));
    };

    /**
    * Add a change handler to be called whenever the selected language is changed.
    *
    * The handler function is called with no arguments.
    *
    * @sb-param {Function} handler - Handler function to be called whenever the
    *                             language changes.
    */
    LanguageSelector.prototype.registerChangeHandler = function (handler) {
        if (this.changeHandlers.indexOf(handler) === -1) {
            this.changeHandlers.push(handler);
        }
    };

    /**
    * Sets the language.  If the language given is not recognised, nothing
    * happens.
    * @sb-param {String} language - The language code.
    */
    LanguageSelector.prototype.setLanguage = function (language) {
        const index = this.allLanguages.indexOf(language);
        if (index >= 0) {
            this.dropDown.selectedIndex = index;
            this.onLanguageChanged();
        }
    };

    /**
    * Handle a change of the selected option in the drop-down list.
    */
    LanguageSelector.prototype.onLanguageChanged = function () {
        setLanguage(this.dropDown.options[this.dropDown.selectedIndex].value);
        this.changeHandlers.forEach(function (handler) { handler(); });
    };

    SplitsBrowser.Controls.LanguageSelector = LanguageSelector;
})();

// file class-selector.js
(function () {
    "use strict";

    const getMessage = Lang.getMessage;

    /**
    * A control that wraps a drop-down list used to choose between classes.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    */
    function ClassSelector(parent) {
        this.changeHandlers = [];
        this.otherClassesEnabled = true;

        const div = d3.select(parent).append("div")
            .classed("topRowStart", true);

        this.labelSpan = div.append("span");

        const outerThis = this;
        this.dropDown = div.append("select").node();
        $(this.dropDown).bind("change", function () {
            outerThis.updateOtherClasses(d3.set());
            outerThis.onSelectionChanged();
        });

        this.otherClassesContainer = d3.select(parent).append("div")
            .attr("id", "otherClassesContainer")
            .classed("topRowStart", true)
            .style("display", "none");

        this.otherClassesCombiningLabel = this.otherClassesContainer.append("span")
            .classed("otherClassCombining", true);

        this.otherClassesSelector = this.otherClassesContainer.append("div")
            .classed("otherClassSelector", true)
            .style("display", "inline-block");

        this.otherClassesSpan = this.otherClassesSelector.append("span");

        this.otherClassesList = d3.select(parent).append("div")
            .classed("otherClassList", true)
            .classed("transient", true)
            .style("position", "absolute")
            .style("display", "none");

        this.otherClassesSelector.on("click", function () { outerThis.showHideClassSelector(); });

        this.setClasses([]);

        // Indexes of the selected 'other classes'.
        this.selectedOtherClassIndexes = d3.set();

        // Ensure that a click outside of the drop-down list or the selector
        // box closes it.
        // Taken from http://stackoverflow.com/questions/1403615 and adjusted.
        $(document).click(function (e) {
            const listDiv = outerThis.otherClassesList.node();
            if (listDiv.style.display !== "none") {
                const container = $("div.otherClassList,div.otherClassSelector");
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    listDiv.style.display = "none";
                }
            }
        });

        this.setMessages();
    }

    /**
    * Sets some messages following either the creation of this control or a
    * change of selected language.
    */
    ClassSelector.prototype.setMessages = function () {
        this.labelSpan.text(getMessage("ClassSelectorLabel"));
        this.otherClassesCombiningLabel.text(getMessage("AdditionalClassSelectorLabel"));
    };

    /**
    * Sets whether the other-classes selector is enabled, if it is shown at
    * all.
    * @sb-param {boolean} otherClassesEnabled - true to enable the selector, false
    *      to disable it.
    */
    ClassSelector.prototype.setOtherClassesEnabled = function (otherClassesEnabled) {
        this.otherClassesCombiningLabel.classed("disabled", !otherClassesEnabled);
        this.otherClassesSelector.classed("disabled", !otherClassesEnabled);
        this.otherClassesEnabled = otherClassesEnabled;
    };

    /**
    * Sets the list of classes that this selector can choose between.
    *
    * If there are no classes, a 'dummy' entry is added
    * @sb-param {Array} classes - Array of CourseClass objects containing class
    *     data.
    */
    ClassSelector.prototype.setClasses = function (classes) {
        if ($.isArray(classes)) {
            this.classes = classes;
            let options;
            if (classes.length === 0) {
                this.dropDown.disabled = true;
                options = [getMessage("NoClassesLoadedPlaceholder")];
            } else {
                this.dropDown.disabled = false;
                options = classes.map(function (courseClass) { return courseClass.name; });
            }

            let optionsList = d3.select(this.dropDown).selectAll("option").data(options);
            optionsList.enter().append("option");

            optionsList = d3.select(this.dropDown).selectAll("option").data(options);
            optionsList.attr("value", function (_value, index) { return index.toString(); })
                .text(function (value: string): string { return value; });

            optionsList.exit().remove();

            this.updateOtherClasses(d3.set());
        } else {
            throw new InvalidData("ClassSelector.setClasses: classes is not an array");
        }
    };

    /**
    * Add a change handler to be called whenever the selected class or classes
    * is changed.
    *
    * An array containing the indexes of the newly-selected classes is passed to
    * each handler function.  This array is guaranteed to be non-empty.  The
    * first index in the array is the 'primary' class.
    *
    * @sb-param {Function} handler - Handler function to be called whenever the class
    *                   changes.
    */
    ClassSelector.prototype.registerChangeHandler = function (handler) {
        if (this.changeHandlers.indexOf(handler) === -1) {
            this.changeHandlers.push(handler);
        }
    };

    /**
    * Sets the selected classes.
    * @sb-param {Array} selectedIndexes - Array of indexes of classes.
    */
    ClassSelector.prototype.selectClasses = function (selectedIndexes) {
        if (selectedIndexes.length > 0 && selectedIndexes.every(function (index) { return 0 <= index && index < this.dropDown.options.length; }, this)) {
            this.dropDown.selectedIndex = selectedIndexes[0];
            this.updateOtherClasses(d3.set(selectedIndexes.slice(1)));
            this.onSelectionChanged();
        }
    };

    /**
    * Returns the indexes of the selected classes.
    * @sb-param {Array} Indexes of selected classes.
    */
    ClassSelector.prototype.getSelectedClasses = function () {
        if (this.dropDown.disabled) {
            return [];
        } else {
            const indexes = [this.dropDown.selectedIndex];
            this.selectedOtherClassIndexes.each(function (index) { indexes.push(parseInt(index, 10)); });
            return indexes;
        }
    };

    /**
    * Handle a change of the selected option in the drop-down list.
    */
    ClassSelector.prototype.onSelectionChanged = function () {
        const indexes = this.getSelectedClasses();
        this.changeHandlers.forEach(function (handler) { handler(indexes); });
    };

    /**
    * Updates the text in the other-class box at the top.
    *
    * This text contains either a list of the selected classes, or placeholder
    * text if none are selected.
    */
    ClassSelector.prototype.updateOtherClassText = function () {
        const classIdxs = this.selectedOtherClassIndexes.values();
        classIdxs.sort(d3.ascending);
        let text;
        if (classIdxs.length === 0) {
            text = getMessage("NoAdditionalClassesSelectedPlaceholder");
        } else {
            text = classIdxs.map(function (classIdx) { return this.classes[classIdx].name; }, this)
                .join(", ");
        }

        this.otherClassesSpan.text(text);
    };

    /**
    * Updates the other-classes selector div following a change of selected
    * 'main' class.
    * @sb-param {d3.set} selectedOtherClassIndexes - Array of selected other-class indexes.
    */
    ClassSelector.prototype.updateOtherClasses = function (selectedOtherClassIndexes) {
        this.otherClassesList.style("display", "none");
        this.selectedOtherClassIndexes = selectedOtherClassIndexes;
        this.updateOtherClassText();

        $("div.otherClassItem").off("click");

        const outerThis = this;
        let otherClasses;
        if (this.classes.length > 0) {
            const newClass = this.classes[this.dropDown.selectedIndex];
            otherClasses = newClass.course.getOtherClasses(newClass);
        } else {
            otherClasses = [];
        }

        const otherClassIndexes = otherClasses.map(function (cls) { return this.classes.indexOf(cls); }, this);

        let otherClassesSelection = this.otherClassesList.selectAll("div")
            .data(otherClassIndexes);

        otherClassesSelection.enter().append("div")
            .classed("otherClassItem", true);

        otherClassesSelection = this.otherClassesList.selectAll("div")
            .data(otherClassIndexes);

        otherClassesSelection.attr("id", function (classIdx) { return "courseClassIdx_" + classIdx; })
            .classed("selected", function (classIdx) { return selectedOtherClassIndexes.has(classIdx); })
            .text(function (classIdx) { return outerThis.classes[classIdx].name; });

        otherClassesSelection.exit().remove();

        if (otherClassIndexes.length > 0) {
            this.otherClassesContainer.style("display", null);
        } else {
            this.otherClassesContainer.style("display", "none");
        }

        const offset = $(this.otherClassesSelector.node()).offset();
        const height = $(this.otherClassesSelector.node()).outerHeight();
        this.otherClassesList.style("left", offset.left + "px")
            .style("top", offset.top + height + "px");

        $("div.otherClassItem").each(function (index, div) {
            $(div).on("click", function () { outerThis.toggleOtherClass(otherClassIndexes[index]); });
        });
    };

    /**
    * Shows or hides the other-class selector, if it is enabled.
    */
    ClassSelector.prototype.showHideClassSelector = function () {
        if (this.otherClassesEnabled) {
            this.otherClassesList.style("display", (this.otherClassesList.style("display") === "none") ? null : "none");
        }
    };

    /**
    * Toggles the selection of an other class.
    * @sb-param {Number} classIdx - Index of the class among the list of all classes.
    */
    ClassSelector.prototype.toggleOtherClass = function (classIdx) {
        if (this.selectedOtherClassIndexes.has(classIdx)) {
            this.selectedOtherClassIndexes.remove(classIdx);
        } else {
            this.selectedOtherClassIndexes.add(classIdx);
        }

        d3.select("div#courseClassIdx_" + classIdx).classed("selected", this.selectedOtherClassIndexes.has(classIdx));
        this.updateOtherClassText();
        this.onSelectionChanged();
    };

    /**
    * Retranslates this control following a change of selected language.
    */
    ClassSelector.prototype.retranslate = function () {
        this.setMessages();
        if (this.classes.length === 0) {
            d3.select(this.dropDown.options[0]).text(getMessage("NoClassesLoadedPlaceholder"));
        }
        if (this.selectedOtherClassIndexes.values().length === 0) {
            this.otherClassesSpan.text(getMessage("NoAdditionalClassesSelectedPlaceholder"));
        }
    };

    SplitsBrowser.Controls.ClassSelector = ClassSelector;
})();

// file comparison-selector.js
(function () {
    "use strict";

    const getMessage = Lang.getMessage;
    const getMessageWithFormatting = Lang.getMessageWithFormatting;

    const ALL_COMPARISON_OPTIONS = [
        {
            nameKey: "CompareWithWinner",
            selector: function (courseClassSet) { return courseClassSet.getWinnerCumTimes(); },
            requiresWinner: true,
            percentage: ""
        },
        {
            nameKey: "CompareWithFastestTime",
            selector: function (courseClassSet) { return courseClassSet.getFastestCumTimes(); },
            requiresWinner: false,
            percentage: ""
        }
    ];

    // All 'Fastest time + N %' values (not including zero).
    const FASTEST_PLUS_PERCENTAGES = [5, 25, 50, 100];

    FASTEST_PLUS_PERCENTAGES.forEach(function (percent) {
        ALL_COMPARISON_OPTIONS.push({
            nameKey: "CompareWithFastestTimePlusPercentage",
            selector: function (courseClassSet) { return courseClassSet.getFastestCumTimesPlusPercentage(percent); },
            requiresWinner: false,
            percentage: percent.toString()
        });
    });

    ALL_COMPARISON_OPTIONS.push({
        nameKey: "CompareWithAnyRunner",
        selector: null,
        requiresWinner: true,
        percentage: ""
    });

    // Default selected index of the comparison function.
    const DEFAULT_COMPARISON_INDEX = 1; // 1 = fastest time.

    // The id of the comparison selector.
    const COMPARISON_SELECTOR_ID = "comparisonSelector";

    // The id of the runner selector
    const RUNNER_SELECTOR_ID = "runnerSelector";

    /**
    * A control that wraps a drop-down list used to choose what to compare
    * times against.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    * @sb-param {Function} alerter - Function to call with any messages to show to
    *     the user.
    */
    function ComparisonSelector(parent, alerter) {
        this.changeHandlers = [];
        this.classes = null;
        this.currentRunnerIndex = null;
        this.previousCompetitorList = null;
        this.parent = parent;
        this.alerter = alerter;
        this.hasWinner = false;
        this.previousSelectedIndex = -1;

        const div = d3.select(parent).append("div")
            .classed("topRowStart", true);

        this.comparisonSelectorLabel = div.append("span")
            .classed("comparisonSelectorLabel", true);


        const outerThis = this;
        this.dropDown = div.append("select")
            .attr("id", COMPARISON_SELECTOR_ID)
            .node();

        $(this.dropDown).bind("change", function () { outerThis.onSelectionChanged(); });

        this.optionsList = d3.select(this.dropDown).selectAll("option")
            .data(ALL_COMPARISON_OPTIONS);
        this.optionsList.enter().append("option");

        this.optionsList = d3.select(this.dropDown).selectAll("option")
            .data(ALL_COMPARISON_OPTIONS);
        this.optionsList.attr("value", function (_opt, index) { return index.toString(); });

        this.optionsList.exit().remove();

        this.runnerDiv = d3.select(parent).append("div")
            .classed("topRowStart", true)
            .style("display", "none")
            .style("padding-left", "20px");

        this.runnerSpan = this.runnerDiv.append("span")
            .classed("comparisonSelectorLabel", true);

        this.runnerDropDown = this.runnerDiv.append("select")
            .attr("id", RUNNER_SELECTOR_ID)
            .node();

        $(this.runnerDropDown).bind("change", function () { outerThis.onSelectionChanged(); });

        this.dropDown.selectedIndex = DEFAULT_COMPARISON_INDEX;
        this.previousSelectedIndex = DEFAULT_COMPARISON_INDEX;

        this.setMessages();
    }

    /**
    * Sets the messages in this control, following its creation or a change of
    * selected language.
    */
    ComparisonSelector.prototype.setMessages = function () {
        this.comparisonSelectorLabel.text(getMessage("ComparisonSelectorLabel"));
        this.runnerSpan.text(getMessage("CompareWithAnyRunnerLabel"));
        this.optionsList.text(function (opt) { return getMessageWithFormatting(opt.nameKey, { "$$PERCENT$$": opt.percentage }); });
    };

    /**
    * Add a change handler to be called whenever the selected class is changed.
    *
    * The function used to return the comparison result is returned.
    *
    * @sb-param {Function} handler - Handler function to be called whenever the class
    *                   changes.
    */
    ComparisonSelector.prototype.registerChangeHandler = function (handler) {
        if (this.changeHandlers.indexOf(handler) === -1) {
            this.changeHandlers.push(handler);
        }
    };

    /**
    * Returns whether the 'Any Runner...' option is selected.
    * @sb-return {boolean} True if the 'Any Runner...' option is selected, false
    *     if any other option is selected.
    */
    ComparisonSelector.prototype.isAnyRunnerSelected = function () {
        return this.dropDown.selectedIndex === ALL_COMPARISON_OPTIONS.length - 1;
    };

    /**
    * Sets the course-class set to use.
    * @sb-param {CourseClassSet} courseClassSet - The course-class set to set.
    */
    ComparisonSelector.prototype.setCourseClassSet = function (courseClassSet) {
        this.courseClassSet = courseClassSet;
        this.setRunners();
    };

    /**
    * Populates the drop-down list of runners from a course-class set.
    */
    ComparisonSelector.prototype.setRunners = function () {
        const competitors = this.courseClassSet.allCompetitors;
        const completingCompetitorIndexes = d3.range(competitors.length).filter(function (idx) { return competitors[idx].completed(); });
        const completingCompetitors = competitors.filter(function (comp) { return comp.completed(); });

        this.hasWinner = (completingCompetitors.length > 0);

        let optionsList = d3.select(this.runnerDropDown).selectAll("option")
            .data(completingCompetitors);

        optionsList.enter().append("option");
        optionsList = d3.select(this.runnerDropDown).selectAll("option")
            .data(completingCompetitors);
        optionsList.attr("value", function (_comp, complCompIndex) { return completingCompetitorIndexes[complCompIndex].toString(); })
            .text(function (comp: any) { return comp.name; });
        optionsList.exit().remove();

        if (this.previousCompetitorList === null) {
            this.currentRunnerIndex = 0;
        } else if (this.hasWinner) {
            const oldSelectedRunner = this.previousCompetitorList[this.currentRunnerIndex];
            const newIndex = this.courseClassSet.allCompetitors.indexOf(oldSelectedRunner);
            this.currentRunnerIndex = Math.max(newIndex, 0);
        } else if (ALL_COMPARISON_OPTIONS[this.dropDown.selectedIndex].requiresWinner) {
            // We're currently viewing a comparison type that requires a
            // winner.  However, there is no longer a winner, presumably
            // because there was a winner but following the removal of a class
            // there isn't any more.  Switch back to the fastest time.
            this.setComparisonType(1, null);
        }

        this.runnerDropDown.selectedIndex = this.currentRunnerIndex;

        this.previousCompetitorList = this.courseClassSet.allCompetitors;
    };

    /**
    * Sets whether the control is enabled.
    * @sb-param {boolean} isEnabled - True if the control is enabled, false if
    *      disabled.
    */
    ComparisonSelector.prototype.setEnabled = function (isEnabled) {
        d3.select(this.parent).selectAll("span.comparisonSelectorLabel")
            .classed("disabled", !isEnabled);

        this.dropDown.disabled = !isEnabled;
        this.runnerDropDown.disabled = !isEnabled;
    };

    /**
    * Returns the function that compares a competitor's splits against some
    * reference data.
    * @sb-return {Function} Comparison function.
    */
    ComparisonSelector.prototype.getComparisonFunction = function () {
        if (this.isAnyRunnerSelected()) {
            const outerThis = this;
            return function (courseClassSet) { return courseClassSet.getCumulativeTimesForCompetitor(outerThis.currentRunnerIndex); };
        } else {
            return ALL_COMPARISON_OPTIONS[this.dropDown.selectedIndex].selector;
        }
    };

    /**
    * Returns the comparison type.
    * @sb-return {Object} Object containing the comparison type (type index and runner).
    */
    ComparisonSelector.prototype.getComparisonType = function () {
        const typeIndex = this.dropDown.selectedIndex;
        let runner;
        if (typeIndex === ALL_COMPARISON_OPTIONS.length - 1) {
            if (this.runnerDropDown.selectedIndex < 0) {
                this.runnerDropDown.selectedIndex = 0;
            }

            runner = this.courseClassSet.allCompetitors[this.runnerDropDown.selectedIndex];
        } else {
            runner = null;
        }

        return { index: typeIndex, runner: runner };
    };

    /**
    * Sets the comparison type.
    * @sb-param {Number} typeIndex - The index of the comparison type.
    * @sb-param {Competitor|null} runner - The selected 'Any runner', or null if
    *     Any Runner has not been selected.
    */
    ComparisonSelector.prototype.setComparisonType = function (typeIndex, runner) {
        if (0 <= typeIndex && typeIndex < ALL_COMPARISON_OPTIONS.length) {
            if (typeIndex === ALL_COMPARISON_OPTIONS.length - 1) {
                const runnerIndex = this.courseClassSet.allCompetitors.indexOf(runner);
                if (runnerIndex >= 0) {
                    this.dropDown.selectedIndex = typeIndex;
                    this.runnerDropDown.selectedIndex = runnerIndex;
                    this.onSelectionChanged();
                }
            } else {
                this.dropDown.selectedIndex = typeIndex;
                this.onSelectionChanged();
            }
        }
    };

    /**
    * Handle a change of the selected option in either drop-down list.
    */
    ComparisonSelector.prototype.onSelectionChanged = function () {
        const runnerDropdownSelectedIndex = Math.max(this.runnerDropDown.selectedIndex, 0);
        const option = ALL_COMPARISON_OPTIONS[this.dropDown.selectedIndex];
        if (!this.hasWinner && option.requiresWinner) {
            // No winner on this course means you can't select this option.
            this.alerter(getMessageWithFormatting("CannotCompareAsNoWinner", { "$$OPTION$$": getMessage(option.nameKey) }));
            this.dropDown.selectedIndex = this.previousSelectedIndex;
        } else {
            this.runnerDiv.style("display", (this.isAnyRunnerSelected()) ? null : "none");
            this.currentRunnerIndex = (this.runnerDropDown.options.length === 0) ? 0 : parseInt(this.runnerDropDown.options[runnerDropdownSelectedIndex].value, 10);
            this.previousSelectedIndex = this.dropDown.selectedIndex;
            this.changeHandlers.forEach(function (handler) { handler(this.getComparisonFunction()); }, this);
        }
    };

    SplitsBrowser.Controls.ComparisonSelector = ComparisonSelector;
})();

// file statistics-selector.js
(function () {
    "use strict";

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
    function StatisticsSelector(parent) {
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

    SplitsBrowser.Controls.StatisticsSelector = StatisticsSelector;
})();

// file chart-type-selector.js
(function () {
    "use strict";

    const getMessage = Lang.getMessage;

    /**
    * A control that wraps a drop-down list used to choose the types of chart to view.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    * @sb-param {Array} chartTypes - Array of types of chart to list.
    */
    function ChartTypeSelector(parent: HTMLElement, chartTypes: Array<ChartType>) {
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

    SplitsBrowser.Controls.ChartTypeSelector = ChartTypeSelector;
})();

// file original-data-selector.js
(function () {
    "use strict";

    // ID of the div used to contain the object.
    // Must match the name defined in styles.css.
    const CONTAINER_DIV_ID = "originalDataSelectorContainer";

    const getMessage = Lang.getMessage;

    /**
    * Constructs a new OriginalDataSelector object.
    * @constructor
    * @sb-param {d3.selection} parent - d3 selection containing the parent to
    *     insert the selector into.
    */
    function OriginalDataSelector(parent) {
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

    SplitsBrowser.Controls.OriginalDataSelector = OriginalDataSelector;

})();

// file chart-popup.js
(function () {
    "use strict";

    const formatTime = TimeUtilities.formatTime;

    /**
    * Creates a ChartPopup control.
    * @constructor
    * @sb-param {HTMLElement} parent - Parent HTML element.
    * @sb-param {Object} handlers - Object that maps mouse event names to handlers.
    */
    function ChartPopup(parent, handlers) {

        this.shown = false;
        this.mouseIn = false;
        this.popupDiv = d3.select(parent).append("div");
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

    SplitsBrowser.Controls.ChartPopup = ChartPopup;
})();

// file chart.js

import { FastestSplitsPopupData, SplitsPopupData } from "./splitspopupdata";

(function () {
    "use strict";

    // 'Imports'.
    const formatTime = TimeUtilities.formatTime;
    const getMessage = Lang.getMessage;
    const ChartPopup = SplitsBrowser.Controls.ChartPopup;

    // ID of the hidden text-size element.
    // Must match that used in styles.css.
    const TEXT_SIZE_ELEMENT_ID = "sb-text-size-element";

    // ID of the chart.
    // Must match that used in styles.css
    const CHART_SVG_ID = "chart";

    // X-offset in pixels between the mouse and the popup that opens.
    const CHART_POPUP_X_OFFSET = 10;

    // Margins on the four sides of the chart.
    const MARGIN = {
        top: 18, // Needs to be high enough not to obscure the upper X-axis.
        right: 0,
        bottom: 18, // Needs to be high enough not to obscure the lower X-axis.
        left: 53 // Needs to be wide enough for times on the race graph.
    };

    const LEGEND_LINE_WIDTH = 10;

    // Minimum distance between a Y-axis tick label and a competitor's start
    // time, in pixels.
    const MIN_COMPETITOR_TICK_MARK_DISTANCE = 10;

    // The number that identifies the left mouse button in a jQuery event.
    const JQUERY_EVENT_LEFT_BUTTON = 1;

    // The number that identifies the right mouse button in a jQuery event.
    const JQUERY_EVENT_RIGHT_BUTTON = 3;

    const SPACER = "\xa0\xa0\xa0\xa0";

    const colours = [
        "#FF0000", "#4444FF", "#00FF00", "#000000", "#CC0066", "#000099",
        "#FFCC00", "#884400", "#9900FF", "#CCCC00", "#888800", "#CC6699",
        "#00DD00", "#3399FF", "#BB00BB", "#00DDDD", "#FF00FF", "#0088BB",
        "#888888", "#FF99FF", "#55BB33"
    ];

   // The maximum number of fastest splits to show when the popup is open.
   const MAX_FASTEST_SPLITS = 10;

    // Width of the time interval, in seconds, when viewing nearby competitors
    // at a control on the race graph.
    const RACE_GRAPH_COMPETITOR_WINDOW = 240;

    /**
    * Format a time and a rank as a string, with the split time in mm:ss or h:mm:ss
    * as appropriate.
    * @sb-param {?Number} time - The time, in seconds, or null.
    * @sb-param {?Number} rank - The rank, or null.
    * @sb-returns Time and rank formatted as a string.
    */
    function formatTimeAndRank(time, rank) {
        let rankStr;
        if (rank === null) {
            rankStr = "-";
        } else if (isNaNStrict(rank)) {
            rankStr = "?";
        } else {
            rankStr = rank.toString();
        }

        return SPACER + formatTime(time) + " (" + rankStr + ")";
    }

    /**
    * Formats and returns a competitor's name and optional suffix.
    * @sb-param {String} name - The name of the competitor.
    * @sb-param {String} suffix - The optional suffix of the competitor (may be an
    *      empty string to indicate no suffix).
    * @sb-return Competitor name and suffix, formatted.
    */
    function formatNameAndSuffix(name: string, suffix: string): string {
        return (suffix === "") ? name : name + " (" + suffix + ")";
    }

    /**
    * Returns the 'suffix' to use with the given competitor.
    * The suffix indicates whether they are non-competitive or a mispuncher,
    * were disqualified or did not finish.  If none of the above apply, an
    * empty string is returned.
    * @sb-return {String} Suffix to use with the given competitor.
    */
    function getSuffix(competitor: Competitor): string {
        // Non-starters are not catered for here, as this is intended to only
        // be used on the chart and non-starters shouldn't appear on the chart.
        if (competitor.completed() && competitor.isNonCompetitive) {
            return getMessage("NonCompetitiveShort");
        } else if (competitor.isNonFinisher) {
            return getMessage("DidNotFinishShort");
        } else if (competitor.isDisqualified) {
            return getMessage("DisqualifiedShort");
        } else if (competitor.isOverMaxTime) {
            return getMessage("OverMaxTimeShort");
        } else if (competitor.completed()) {
            return "";
        } else {
            return getMessage("MispunchedShort");
        }
    }

    /**
    * A chart object in a window.
    * @constructor
    * @sb-param {HTMLElement} parent - The parent object to create the element within.
    */
    function Chart(parent: HTMLElement) {
        this.parent = parent;

        this.xScale = null;
        this.yScale = null;
        this.hasData = false;
        this.overallWidth = -1;
        this.overallHeight = -1;
        this.contentWidth = -1;
        this.contentHeight = -1;
        this.numControls = -1;
        this.selectedIndexes = [];
        this.currentCompetitorData = null;
        this.isPopupOpen = false;
        this.popupUpdateFunc = null;
        this.maxStartTimeLabelWidth = 0;

        this.mouseOutTimeout = null;

        this.popupData = new SplitsPopupData(MAX_FASTEST_SPLITS, RACE_GRAPH_COMPETITOR_WINDOW);

        // Indexes of the currently-selected competitors, in the order that
        // they appear in the list of labels.
        this.selectedIndexesOrderedByLastYValue = [];
        this.referenceCumTimes = [];
        this.referenceCumTimesSorted = [];
        this.referenceCumTimeIndexes = [];
        this.fastestCumTimes = [];

        this.isMouseIn = false;

        // The position the mouse cursor is currently over, or null for not over
        // the charts.  This index is constrained by the minimum control that a
        // chart type specifies.
        this.currentControlIndex = null;

        // The position the mouse cursor is currently over, or null for not over
        // the charts.  Unlike this.currentControlIndex, this index is not
        // constrained by the minimum control that a chart type specifies.
        this.actualControlIndex = null;

        this.controlLine = null;

        this.currentChartTime = null;

        this.svg = d3.select(this.parent).append("svg")
            .attr("id", CHART_SVG_ID);

        this.svgGroup = this.svg.append("g");
        this.setLeftMargin(MARGIN.left);

        const outerThis = this;
        const mousemoveHandler = function (event) { outerThis.onMouseMove(event); };
        const mouseupHandler = function (event) { outerThis.onMouseUp(event); };
        const mousedownHandler = function (event) { outerThis.onMouseDown(event); };
        $(this.svg.node()).mouseenter(function (event) { outerThis.onMouseEnter(event); })
            .mousemove(mousemoveHandler)
            .mouseleave(function (event) { outerThis.onMouseLeave(event); })
            .mousedown(mousedownHandler)
            .mouseup(mouseupHandler);

        // Disable the context menu on the chart, so that it doesn't open when
        // showing the right-click popup.
        $(this.svg.node()).contextmenu(function (e) { e.preventDefault(); });

        // Add an invisible text element used for determining text size.
        this.textSizeElement = this.svg.append("text").attr("fill", "transparent")
            .attr("id", TEXT_SIZE_ELEMENT_ID);

        const handlers = { "mousemove": mousemoveHandler, "mousedown": mousedownHandler, "mouseup": mouseupHandler };
        this.popup = new ChartPopup(parent, handlers);

        $(document).mouseup(function () { outerThis.popup.hide(); });
    }

    /**
    * Sets the left margin of the chart.
    * @sb-param {Number} leftMargin - The left margin of the chart.
    */
    Chart.prototype.setLeftMargin = function (leftMargin: number) {
        this.currentLeftMargin = leftMargin;
        this.svgGroup.attr("transform", "translate(" + this.currentLeftMargin + "," + MARGIN.top + ")");
    };

    /**
    * Gets the location the chart popup should be at following a mouse-button
    * press or a mouse movement.
    * @sb-param {jQuery.event} event - jQuery mouse-down or mouse-move event.
    * @sb-return {Object} Location of the popup.
    */
    Chart.prototype.getPopupLocation = function (event) {
        return {
            x: event.pageX + CHART_POPUP_X_OFFSET,
            y: Math.max(event.pageY - this.popup.height() / 2, 0)
        };
    };

    /**
    * Returns the fastest splits to the current control.
    * @sb-return {Array} Array of fastest-split data.
    */
    Chart.prototype.getFastestSplitsPopupData = function (): Array<any> {
        return this.popupData.getFastestSplitsPopupData(this.courseClassSet, this.currentControlIndex);
    };

    /**
    * Returns the fastest splits for the currently-shown leg.  The list
    * returned contains the fastest splits for the current leg for each class.
    * @sb-return {Object} Object that contains the title for the popup and the
    *     array of data to show within it.
    */
    Chart.prototype.getFastestSplitsForCurrentLegPopupData = function () {
        return this.popupData.getFastestSplitsForLegPopupData(this.courseClassSet, this.eventData, this.currentControlIndex);
    };

    /**
    * Stores the current time the mouse is at, on the race graph.
    * @sb-param {jQuery.event} event - The mouse-down or mouse-move event.
    */
    Chart.prototype.setCurrentChartTime = function (event) {
        const yOffset = event.pageY - $(this.svg.node()).offset().top - MARGIN.top;
        this.currentChartTime = Math.round(this.yScale.invert(yOffset) * 60) + this.referenceCumTimes[this.currentControlIndex];
    };

    /**
    * Returns an array of the competitors visiting the current control at the
    * current time.
    * @sb-return {Array} Array of competitor data.
    */
    Chart.prototype.getCompetitorsVisitingCurrentControlPopupData = function () {
        return this.popupData.getCompetitorsVisitingCurrentControlPopupData(this.courseClassSet,
                                                                            this.eventData,
                                                                            this.currentControlIndex,
                                                                            this.currentChartTime);
    };

    /**
    * Returns next-control data to show on the chart popup.
    * @sb-return {Array} Array of next-control data.
    */
    Chart.prototype.getNextControlData = function () {
        return this.popupData.getNextControlData(this.courseClassSet.getCourse(), this.eventData, this.actualControlIndex);
    };

    /**
    * Handle the mouse entering the chart.
    * @sb-param {jQuery.event} event - jQuery event object.
    */
    Chart.prototype.onMouseEnter = function (event) {
        if (this.mouseOutTimeout !== null) {
            clearTimeout(this.mouseOutTimeout);
            this.mouseOutTimeout = null;
        }

        this.isMouseIn = true;
        if (this.hasData) {
            this.updateControlLineLocation(event);
        }
    };

    /**
    * Handle a mouse movement.
    * @sb-param {jQuery.event} event - jQuery event object.
    */
    Chart.prototype.onMouseMove = function (event) {
        if (this.hasData && this.isMouseIn && this.xScale !== null) {
            this.updateControlLineLocation(event);
        }
    };

    /**
    * Handle the mouse leaving the chart.
    */
    Chart.prototype.onMouseLeave = function () {
        const outerThis = this;
        // Check that the mouse hasn't entered the popup.
        // It seems that the mouseleave event for the chart is sent before the
        // mouseenter event for the popup, so we use a timeout to check a short
        // time later whether the mouse has left the chart and the popup.
        // This is only necessary for IE9 and IE10; other browsers support
        // "pointer-events: none" in CSS so the popup never gets any mouse
        // events.

        // Note that we keep a reference to the 'timeout', so that we can
        // clear it if the mouse subsequently re-enters.  This happens a lot
        // more often than might be expected for a function with a timeout of
        // only a single millisecond.
        this.mouseOutTimeout = setTimeout(function () {
            if (!outerThis.popup.isMouseIn()) {
                outerThis.isMouseIn = false;
                outerThis.removeControlLine();
            }
        }, 1);
    };

    /**
    * Handles a mouse button being pressed over the chart.
    * @sb-param {jQuery.Event} event - jQuery event object.
    */
    Chart.prototype.onMouseDown = function (event) {
        const outerThis = this;
        // Use a timeout to open the dialog as we require other events
        // (mouseover in particular) to be processed first, and the precise
        // order of these events is not consistent between browsers.
        setTimeout(function () { outerThis.showPopupDialog(event); }, 1);
    };

    /**
    * Handles a mouse button being pressed over the chart.
    * @sb-param {jQuery.event} event - The jQuery onMouseUp event.
    */
    Chart.prototype.onMouseUp = function (event) {
        this.popup.hide();
        event.preventDefault();
    };

    /**
    * Shows the popup window, populating it with data as necessary
    * @sb-param {jQuery.event} event - The jQuery onMouseDown event that triggered
    *     the popup.
    */
    Chart.prototype.showPopupDialog = function (event) {
        if (this.isMouseIn && this.currentControlIndex !== null) {
            let showPopup = false;
            const outerThis = this;
            if (this.isRaceGraph && (event.which === JQUERY_EVENT_LEFT_BUTTON || event.which === JQUERY_EVENT_RIGHT_BUTTON)) {
                if (this.hasControls) {
                    this.setCurrentChartTime(event);
                    // tslint:disable-next-line:max-line-length
                    this.popupUpdateFunc = function () { outerThis.popup.setData(outerThis.getCompetitorsVisitingCurrentControlPopupData(), true); };
                    showPopup = true;
                }
            } else if (event.which === JQUERY_EVENT_LEFT_BUTTON) {
                this.popupUpdateFunc = function () { outerThis.popup.setData(outerThis.getFastestSplitsPopupData(), false); };
                showPopup = true;
            } else if (event.which === JQUERY_EVENT_RIGHT_BUTTON) {
                if (this.hasControls) {
                    // tslint:disable-next-line:max-line-length
                    this.popupUpdateFunc = function () { outerThis.popup.setData(outerThis.getFastestSplitsForCurrentLegPopupData(), true); };
                    showPopup = true;
                }
            }

            if (showPopup) {
                this.updatePopupContents(event);
                this.popup.show(this.getPopupLocation(event));
            }
        }
    };

    /**
    * Updates the chart popup with the contents it should contain.
    *
    * If the current course has control data, and the cursor is above the top
    * X-axis, control information is shown instead of whatever other data would
    * be being shown.
    *
    * @sb-param {jQuery.event} event - jQuery mouse-move event.
    */
    Chart.prototype.updatePopupContents = function (event) {
        const yOffset = event.pageY - $(this.svg.node()).offset().top;
        const showNextControls = this.hasControls && yOffset < MARGIN.top;
        if (showNextControls) {
            this.updateNextControlInformation();
        } else {
            this.popupUpdateFunc();
        }
    };

    /**
    * Updates the next-control information.
    */
    Chart.prototype.updateNextControlInformation = function () {
        if (this.hasControls) {
            this.popup.setNextControlData(this.getNextControlData());
        }
    };

    /**
    * Draw a 'control line'.  This is a vertical line running the entire height of
    * the chart, at one of the controls.
    * @sb-param {Number} controlIndex - The index of the control at which to draw the
    *                                control line.
    */
    Chart.prototype.drawControlLine = function (controlIndex: number) {
        this.currentControlIndex = controlIndex;
        this.updateCompetitorStatistics();
        const xPosn = this.xScale(this.referenceCumTimes[controlIndex]);
        this.controlLine = this.svgGroup.append("line")
            .attr("x1", xPosn)
            .attr("y1", 0)
            .attr("x2", xPosn)
            .attr("y2", this.contentHeight)
            .attr("class", "controlLine")
            .node();
    };

    /**
    * Updates the location of the control line from the given mouse event.
    * @sb-param {jQuery.event} event - jQuery mousedown or mousemove event.
    */
    Chart.prototype.updateControlLineLocation = function (event) {

        const svgNodeAsJQuery = $(this.svg.node());
        const offset = svgNodeAsJQuery.offset();
        const xOffset = event.pageX - offset.left;
        const yOffset = event.pageY - offset.top;

        if (this.currentLeftMargin <= xOffset && xOffset < svgNodeAsJQuery.width() - MARGIN.right &&
            yOffset < svgNodeAsJQuery.height() - MARGIN.bottom) {
            // In the chart.
            // Get the time offset that the mouse is currently over.
            const chartX = this.xScale.invert(xOffset - this.currentLeftMargin);
            const bisectIndex = d3.bisect(this.referenceCumTimesSorted, chartX);

            // bisectIndex is the index at which to insert chartX into
            // referenceCumTimes in order to keep the array sorted.  So if
            // this index is N, the mouse is between N - 1 and N.  Find
            // which is nearer.
            let sortedControlIndex;
            if (bisectIndex >= this.referenceCumTimesSorted.length) {
                // Off the right-hand end, use the last control (usually the
                // finish).
                sortedControlIndex = this.referenceCumTimesSorted.length - 1;
            } else {
                const diffToNext = Math.abs(this.referenceCumTimesSorted[bisectIndex] - chartX);
                const diffToPrev = Math.abs(chartX - this.referenceCumTimesSorted[bisectIndex - 1]);
                sortedControlIndex = (diffToPrev < diffToNext) ? bisectIndex - 1 : bisectIndex;
            }

            const controlIndex = this.referenceCumTimeIndexes[sortedControlIndex];

            if (this.actualControlIndex === null || this.actualControlIndex !== controlIndex) {
                // The control line has appeared for the first time or has moved, so redraw it.
                this.removeControlLine();
                this.actualControlIndex = controlIndex;
                this.drawControlLine(Math.max(this.minViewableControl, controlIndex));
            }

            if (this.popup.isShown() && this.currentControlIndex !== null) {
                if (this.isRaceGraph) {
                    this.setCurrentChartTime(event);
                }

                this.updatePopupContents(event);
                this.popup.setLocation(this.getPopupLocation(event));
            }

        } else {
            // In the SVG element but outside the chart area.
            this.removeControlLine();
            this.popup.hide();
        }
    };

    /**
    * Remove any previously-drawn control line.  If no such line existed, nothing
    * happens.
    */
    Chart.prototype.removeControlLine = function () {
        this.currentControlIndex = null;
        this.actualControlIndex = null;
        this.updateCompetitorStatistics();
        if (this.controlLine !== null) {
            d3.select(this.controlLine).remove();
            this.controlLine = null;
        }
    };

    /**
    * Returns an array of the the times that the selected competitors are
    * behind the fastest time at the given control.
    * @sb-param {Number} controlIndex - Index of the given control.
    * @sb-param {Array} indexes - Array of indexes of selected competitors.
    * @sb-return {Array} Array of times in seconds that the given competitors are
    *     behind the fastest time.
    */
    Chart.prototype.getTimesBehindFastest = function (controlIndex: number, indexes: Array<number>) {
        const selectedCompetitors = indexes.map(function (index) { return this.courseClassSet.allCompetitors[index]; }, this);
        const fastestSplit = this.fastestCumTimes[controlIndex] - this.fastestCumTimes[controlIndex - 1];
        const timesBehind = selectedCompetitors.map(function (comp) { const compSplit = comp.getSplitTimeTo(controlIndex); return (compSplit === null) ? null : compSplit - fastestSplit; });
        return timesBehind;
    };

    /**
    * Returns an array of the the time losses of the selected competitors at
    * the given control.
    * @sb-param {Number} controlIndex - Index of the given control.
    * @sb-param {Array} indexes - Array of indexes of selected competitors.
    * @sb-return {Array} Array of times in seconds that the given competitors are
    *     deemed to have lost at the given control.
    */
    Chart.prototype.getTimeLosses = function (controlIndex: number, indexes: Array<number>) {
        const selectedCompetitors = indexes.map(function (index) { return this.courseClassSet.allCompetitors[index]; }, this);
        const timeLosses = selectedCompetitors.map(function (comp) { return comp.getTimeLossAt(controlIndex); });
        return timeLosses;
    };

    /**
    * Updates the statistics text shown after the competitors.
    */
    Chart.prototype.updateCompetitorStatistics = function (): void {
        const selectedCompetitors = this.selectedIndexesOrderedByLastYValue.map(function (index) { return this.courseClassSet.allCompetitors[index]; }, this);
        let labelTexts = selectedCompetitors.map(function (comp) { return formatNameAndSuffix(comp.name, getSuffix(comp)); });

        if (this.currentControlIndex !== null && this.currentControlIndex > 0) {
            if (this.visibleStatistics.TotalTime) {
                const cumTimes = selectedCompetitors.map(function (comp) { return comp.getCumulativeTimeTo(this.currentControlIndex); }, this);
                const cumRanks = selectedCompetitors.map(function (comp) { return comp.getCumulativeRankTo(this.currentControlIndex); }, this);
                labelTexts = d3.zip(labelTexts, cumTimes, cumRanks)
                    .map(function (triple) { return triple[0] + formatTimeAndRank(triple[1], triple[2]); });
            }

            if (this.visibleStatistics.SplitTime) {
                const splitTimes = selectedCompetitors.map(function (comp) { return comp.getSplitTimeTo(this.currentControlIndex); }, this);
                const splitRanks = selectedCompetitors.map(function (comp) { return comp.getSplitRankTo(this.currentControlIndex); }, this);
                labelTexts = d3.zip(labelTexts, splitTimes, splitRanks)
                    .map(function (triple) { return triple[0] + formatTimeAndRank(triple[1], triple[2]); });
            }

            if (this.visibleStatistics.BehindFastest) {
                const timesBehind = this.getTimesBehindFastest(this.currentControlIndex, this.selectedIndexesOrderedByLastYValue);
                labelTexts = d3.zip(labelTexts, timesBehind)
                    .map(function (pair) { return pair[0] + SPACER + formatTime(pair[1] as number); });
            }

            if (this.visibleStatistics.TimeLoss) {
                const timeLosses = this.getTimeLosses(this.currentControlIndex, this.selectedIndexesOrderedByLastYValue);
                labelTexts = d3.zip(labelTexts, timeLosses)
                    .map(function (pair) { return pair[0] + SPACER + formatTime(pair[1] as number); });
            }
        }

        // Update the current competitor data.
        if (this.hasData) {
            this.currentCompetitorData.forEach(function (data, index) { data.label = labelTexts[index]; });
        }

        // This data is already joined to the labels; just update the text.
        d3.selectAll("text.competitorLabel").text(function (data: any) { return data.label; });
    };

    /**
    * Returns a tick-formatting function that formats the label of a tick on the
    * top X-axis.
    *
    * The function returned is suitable for use with the D3 axis.tickFormat method.
    *
    * @sb-returns {function} Tick-formatting function.
    */
    Chart.prototype.getTickFormatter = function () {
        const outerThis = this;
        return function (value, idx) {
            return (idx === 0) ? getMessage("StartNameShort") : ((idx === outerThis.numControls + 1) ? getMessage("FinishNameShort") : idx.toString());
        };
    };

    /**
    * Get the width of a piece of text.
    * @sb-param {string} text - The piece of text to measure the width of.
    * @sb-returns {Number} The width of the piece of text, in pixels.
    */
    Chart.prototype.getTextWidth = function (text: string): number {
        return this.textSizeElement.text(text).node().getBBox().width;
    };

    /**
    * Gets the height of a piece of text.
    *
    * @sb-param {string} text - The piece of text to measure the height of.
    * @sb-returns {Number} The height of the piece of text, in pixels.
    */
    Chart.prototype.getTextHeight = function (text) {
        return this.textSizeElement.text(text).node().getBBox().height;
    };

    /**
    * Return the maximum width of the end-text shown to the right of the graph.
    *
    * This function considers only the competitors whose indexes are in the
    * list given.  This method returns zero if the list is empty.
    * @sb-returns {Number} Maximum width of text, in pixels.
    */
    Chart.prototype.getMaxGraphEndTextWidth = function () {
        if (this.selectedIndexes.length === 0) {
            // No competitors selected.  Avoid problems caused by trying to
            // find the maximum of an empty array.
            return 0;
        } else {
            const nameWidths = this.selectedIndexes.map(function (index) {
                const comp = this.courseClassSet.allCompetitors[index];
                return this.getTextWidth(formatNameAndSuffix(comp.name, getSuffix(comp)));
            }, this);
            return d3.max(nameWidths) + this.determineMaxStatisticTextWidth();
        }
    };

    /**
    * Returns the maximum value from the given array, not including any null or
    * NaN values.  If the array contains no non-null, non-NaN values, zero is
    * returned.
    * @sb-param {Array} values - Array of values.
    * @sb-return {Number} Maximum non-null or NaN value.
    */
    function maxNonNullNorNaNValue(values) {
        const nonNullNorNaNValues: Array<number> = values.filter(isNotNullNorNaN);
        return (nonNullNorNaNValues.length > 0) ? d3.max(nonNullNorNaNValues) : 0;
    }

    /**
    * Return the maximum width of a piece of time and rank text shown to the right
    * of each competitor
    * @sb-param {string} timeFuncName - Name of the function to call to get the time
                                     data.
    * @sb-param {string} rankFuncName - Name of the function to call to get the rank
                                     data.
    * @sb-returns {Number} Maximum width of split-time and rank text, in pixels.
    */
    Chart.prototype.getMaxTimeAndRankTextWidth = function (timeFuncName, rankFuncName) {
        let maxTime = 0;
        let maxRank = 0;

        const selectedCompetitors = this.selectedIndexes.map(function (index) { return this.courseClassSet.allCompetitors[index]; }, this);

        d3.range(1, this.numControls + 2).forEach(function (controlIndex) {
            const times: Array<number> = selectedCompetitors.map(function (comp): number { return comp[timeFuncName](controlIndex); });
            maxTime = Math.max(maxTime, maxNonNullNorNaNValue(times));

            const ranks = selectedCompetitors.map(function (comp) { return comp[rankFuncName](controlIndex); });
            maxRank = Math.max(maxRank, maxNonNullNorNaNValue(ranks));
        });

        const text = formatTimeAndRank(maxTime, maxRank);
        return this.getTextWidth(text);
    };

    /**
    * Return the maximum width of the split-time and rank text shown to the right
    * of each competitor
    * @sb-returns {Number} Maximum width of split-time and rank text, in pixels.
    */
    Chart.prototype.getMaxSplitTimeAndRankTextWidth = function () {
        return this.getMaxTimeAndRankTextWidth("getSplitTimeTo", "getSplitRankTo");
    };

    /**
    * Return the maximum width of the cumulative time and cumulative-time rank text
    * shown to the right of each competitor
    * @sb-returns {Number} Maximum width of cumulative time and cumulative-time rank text, in
    *                   pixels.
    */
    Chart.prototype.getMaxCumulativeTimeAndRankTextWidth = function () {
        return this.getMaxTimeAndRankTextWidth("getCumulativeTimeTo", "getCumulativeRankTo");
    };

    /**
    * Return the maximum width of the behind-fastest time shown to the right of
    * each competitor
    * @sb-returns {Number} Maximum width of behind-fastest time rank text, in pixels.
    */
    Chart.prototype.getMaxTimeBehindFastestWidth = function () {
        let maxTime = 0;

        for (let controlIndex = 1; controlIndex <= this.numControls + 1; controlIndex += 1) {
            const times = this.getTimesBehindFastest(controlIndex, this.selectedIndexes);
            maxTime = Math.max(maxTime, maxNonNullNorNaNValue(times));
        }

        return this.getTextWidth(SPACER + formatTime(maxTime));
    };

    /**
    * Return the maximum width of the behind-fastest time shown to the right of
    * each competitor
    * @sb-returns {Number} Maximum width of behind-fastest time rank text, in pixels.
    */
    Chart.prototype.getMaxTimeLossWidth = function () {
        let maxTimeLoss = 0;
        let minTimeLoss = 0;
        for (let controlIndex = 1; controlIndex <= this.numControls + 1; controlIndex += 1) {
            const timeLosses = this.getTimeLosses(controlIndex, this.selectedIndexes);
            const nonNullTimeLosses: Array<number> = timeLosses.filter(isNotNullNorNaN);
            if (nonNullTimeLosses.length > 0) {
                maxTimeLoss = Math.max(maxTimeLoss, d3.max(nonNullTimeLosses));
                minTimeLoss = Math.min(minTimeLoss, d3.min(nonNullTimeLosses));
            }
        }

        return Math.max(this.getTextWidth(SPACER + formatTime(maxTimeLoss)),
            this.getTextWidth(SPACER + formatTime(minTimeLoss)));
    };

    /**
    * Determines the maximum width of the statistics text at the end of the competitor.
    * @sb-returns {Number} Maximum width of the statistics text, in pixels.
    */
    Chart.prototype.determineMaxStatisticTextWidth = function () {
        let maxWidth = 0;
        if (this.visibleStatistics.TotalTime) {
            maxWidth += this.getMaxCumulativeTimeAndRankTextWidth();
        }
        if (this.visibleStatistics.SplitTime) {
            maxWidth += this.getMaxSplitTimeAndRankTextWidth();
        }
        if (this.visibleStatistics.BehindFastest) {
            maxWidth += this.getMaxTimeBehindFastestWidth();
        }
        if (this.visibleStatistics.TimeLoss) {
            maxWidth += this.getMaxTimeLossWidth();
        }

        return maxWidth;
    };

    /**
    * Determines the maximum width of all of the visible start time labels.
    * If none are presently visible, zero is returned.
    * @sb-param {object} chartData - Object containing the chart data.
    * @sb-return {Number} Maximum width of a start time label.
    */
    Chart.prototype.determineMaxStartTimeLabelWidth = function (chartData) {
        let maxWidth;
        if (chartData.competitorNames.length > 0) {
            maxWidth = d3.max(chartData.competitorNames.map(function (name) { return this.getTextWidth("00:00:00 " + name); }, this));
        } else {
            maxWidth = 0;
        }

        return maxWidth;
    };

    /**
    * Creates the X and Y scales necessary for the chart and its axes.
    * @sb-param {object} chartData - Chart data object.
    */
    Chart.prototype.createScales = function (chartData) {
        this.xScale = d3.scaleLinear().domain(chartData.xExtent).range([0, this.contentWidth]);
        this.yScale = d3.scaleLinear().domain(chartData.yExtent).range([0, this.contentHeight]);
        this.xScaleMinutes = d3.scaleLinear().domain([chartData.xExtent[0] / 60, chartData.xExtent[1] / 60]).range([0, this.contentWidth]);
    };

    /**
    * Draw the background rectangles that indicate sections of the course
    * between controls.
    */
    Chart.prototype.drawBackgroundRectangles = function (): void {

        // We can't guarantee that the reference cumulative times are in
        // ascending order, but we need such a list of times in order to draw
        // the rectangles.  So, sort the reference cumulative times.
        const refCumTimesSorted = this.referenceCumTimes.slice(0);
        refCumTimesSorted.sort(d3.ascending);

        // Now remove any duplicate times.
        let index = 1;
        while (index < refCumTimesSorted.length) {
            if (refCumTimesSorted[index] === refCumTimesSorted[index - 1]) {
                refCumTimesSorted.splice(index, 1);
            } else {
                index += 1;
            }
        }

        const outerThis = this;

        let rects = this.svgGroup.selectAll("rect")
            .data(d3.range(refCumTimesSorted.length - 1));

        rects.enter().append("rect");

        rects = this.svgGroup.selectAll("rect")
            .data(d3.range(refCumTimesSorted.length - 1));
        rects.attr("x", function (i) { return outerThis.xScale(refCumTimesSorted[i]); })
            .attr("y", 0)
            .attr("width", function (i) { return outerThis.xScale(refCumTimesSorted[i + 1]) - outerThis.xScale(refCumTimesSorted[i]); })
            .attr("height", this.contentHeight)
            .attr("class", function (i) { return (i % 2 === 0) ? "background1" : "background2"; });

        rects.exit().remove();
    };

    /**
    * Returns a function used to format tick labels on the Y-axis.
    *
    * If start times are to be shown (i.e. for the race graph), then the Y-axis
    * values are start times.  We format these as times, as long as there isn't
    * a competitor's start time too close to it.
    *
    * For other graph types, this method returns null, which tells d3 to use
    * its default tick formatter.
    *
    * @sb-param {object} chartData - The chart data to read start times from.
    * @sb-return {?Function} Tick formatter function, or null to use the default
    *     d3 formatter.
    */
    Chart.prototype.determineYAxisTickFormatter = function (chartData) {
        if (this.isRaceGraph) {
            // Assume column 0 of the data is the start times.
            // However, beware that there might not be any data.
            const startTimes = (chartData.dataColumns.length === 0) ? [] : chartData.dataColumns[0].ys;
            if (startTimes.length === 0) {
                // No start times - draw all tick marks.
                return function (time) { return formatTime(time * 60); };
            } else {
                // Some start times are to be drawn - only draw tick marks if
                // they are far enough away from competitors.

                const yScale = this.yScale;
                return function (time) {
                    const yarray: Array<number> = startTimes.map(function (startTime) { return Math.abs(yScale(startTime) - yScale(time)); });
                    const nearestOffset = d3.min(yarray);
                    return (nearestOffset >= MIN_COMPETITOR_TICK_MARK_DISTANCE) ? formatTime(Math.round(time * 60)) : "";
                };
            }
        } else {
            // Use the default d3 tick formatter.
            return null;
        }
    };

    /**
    * Draw the chart axes.
    * @sb-param {String} yAxisLabel - The label to use for the Y-axis.
    * @sb-param {object} chartData - The chart data to use.
    */
    Chart.prototype.drawAxes = function (yAxisLabel: number, chartData) {

        const tickFormatter = this.determineYAxisTickFormatter(chartData);

        const xAxis = d3.axisTop(d3.scaleLinear())
            .scale(this.xScale)
            .tickFormat(this.getTickFormatter())
            .tickValues(this.referenceCumTimes);

        const yAxis = d3.axisLeft(d3.scaleLinear())
            .scale(this.yScale)
            .tickFormat(tickFormatter);

        const lowerXAxis = d3.axisBottom(d3.scaleLinear())
            .scale(this.xScaleMinutes);

        this.svgGroup.selectAll("g.axis").remove();

        this.svgGroup.append("g")
            .attr("class", "x axis")
            .call(xAxis);

        this.svgGroup.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("x", -(this.contentHeight - 6))
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "start")
            .style("fill", "black")
            .text(yAxisLabel);

        this.svgGroup.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + this.contentHeight + ")")
            .call(lowerXAxis)
            .append("text")
            .attr("x", 60)
            .attr("y", -5)
            .style("text-anchor", "start")
            .style("fill", "black")
            .text(getMessage("LowerXAxisChartLabel"));
    };

    /**
    * Draw the lines on the chart.
    * @sb-param {Array} chartData - Array of chart data.
    */
    Chart.prototype.drawChartLines = function (chartData) {
        const outerThis = this;
        const lineFunctionGenerator = function (selCompIdx) {
            if (!chartData.dataColumns.some(function (col) { return isNotNullNorNaN(col.ys[selCompIdx]); })) {
                // This competitor's entire row is null/NaN, so there's no data
                // to draw.  WebKit will report an error ('Error parsing d=""')
                // if no points on the line are defined, as will happen in this
                // case, so we substitute a single zero point instead.
                return d3.line()
                    .x(0)
                    .y(0)
                    .defined(function (d, i) { return i === 0; });
            } else {
                return d3.line<any>()
                    .x(function (d) { return outerThis.xScale(d.x); })
                    .y(function (d) { return outerThis.yScale(d.ys[selCompIdx]); })
                    .defined(function (d) { return isNotNullNorNaN(d.ys[selCompIdx]); });
            }
        };

        this.svgGroup.selectAll("path.graphLine").remove();

        this.svgGroup.selectAll("line.aroundDubiousTimes").remove();

        d3.range(this.numLines).forEach(function (selCompIdx) {
            const strokeColour = colours[this.selectedIndexes[selCompIdx] % colours.length];
            const highlighter = function () { outerThis.highlight(outerThis.selectedIndexes[selCompIdx]); };
            const unhighlighter = function () { outerThis.unhighlight(); };

            this.svgGroup.append("path")
                .attr("d", lineFunctionGenerator(selCompIdx)(chartData.dataColumns))
                .attr("stroke", strokeColour)
                .attr("class", "graphLine competitor" + this.selectedIndexes[selCompIdx])
                .on("mouseenter", highlighter)
                .on("mouseleave", unhighlighter)
                .append("title")
                .text(chartData.competitorNames[selCompIdx]);

            chartData.dubiousTimesInfo[selCompIdx].forEach(function (dubiousTimeInfo) {
                this.svgGroup.append("line")
                    .attr("x1", this.xScale(chartData.dataColumns[dubiousTimeInfo.start].x))
                    .attr("y1", this.yScale(chartData.dataColumns[dubiousTimeInfo.start].ys[selCompIdx]))
                    .attr("x2", this.xScale(chartData.dataColumns[dubiousTimeInfo.end].x))
                    .attr("y2", this.yScale(chartData.dataColumns[dubiousTimeInfo.end].ys[selCompIdx]))
                    .attr("stroke", strokeColour)
                    .attr("class", "aroundDubiousTimes competitor" + this.selectedIndexes[selCompIdx])
                    .on("mouseenter", highlighter)
                    .on("mouseleave", unhighlighter)
                    .append("title")
                    .text(chartData.competitorNames[selCompIdx]);
            }, this);
        }, this);
    };

    /**
    * Highlights the competitor with the given index.
    * @sb-param {Number} competitorIdx - The index of the competitor to highlight.
    */
    Chart.prototype.highlight = function (competitorIdx: number): void {
        this.svg.selectAll("path.graphLine.competitor" + competitorIdx).classed("selected", true);
        this.svg.selectAll("line.competitorLegendLine.competitor" + competitorIdx).classed("selected", true);
        this.svg.selectAll("text.competitorLabel.competitor" + competitorIdx).classed("selected", true);
        this.svg.selectAll("text.startLabel.competitor" + competitorIdx).classed("selected", true);
        this.svg.selectAll("line.aroundDubiousTimes.competitor" + competitorIdx).classed("selected", true);
    };

    /**
    * Removes any competitor-specific higlighting.
    */
    Chart.prototype.unhighlight = function (): void {
        this.svg.selectAll("path.graphLine.selected").classed("selected", false);
        this.svg.selectAll("line.competitorLegendLine.selected").classed("selected", false);
        this.svg.selectAll("text.competitorLabel.selected").classed("selected", false);
        this.svg.selectAll("text.startLabel.selected").classed("selected", false);
        this.svg.selectAll("line.aroundDubiousTimes.selected").classed("selected", false);
    };

    /**
    * Draws the start-time labels for the currently-selected competitors.
    * @sb-param {object} chartData - The chart data that contains the start offsets.
    */
    Chart.prototype.drawCompetitorStartTimeLabels = function (chartData) {
        const startColumn = chartData.dataColumns[0];
        const outerThis = this;

        let startLabels = this.svgGroup.selectAll("text.startLabel").data(this.selectedIndexes);

        startLabels.enter().append("text")
            .classed("startLabel", true);

        startLabels = this.svgGroup.selectAll("text.startLabel").data(this.selectedIndexes);
        startLabels.attr("x", -7)
            .attr("y", function (_compIndex, selCompIndex) { return outerThis.yScale(startColumn.ys[selCompIndex]) + outerThis.getTextHeight(chartData.competitorNames[selCompIndex]) / 4; })
            .attr("class", function (compIndex) { return "startLabel competitor" + compIndex; })
            .on("mouseenter", function (compIndex) { outerThis.highlight(compIndex); })
            .on("mouseleave", function () { outerThis.unhighlight(); })
            .text(function (_compIndex, selCompIndex) { return formatTime(Math.round(startColumn.ys[selCompIndex] * 60)) + " " + chartData.competitorNames[selCompIndex]; });

        startLabels.exit().remove();
    };

    /**
    * Removes all of the competitor start-time labels from the chart.
    */
    Chart.prototype.removeCompetitorStartTimeLabels = function (): void {
        this.svgGroup.selectAll("text.startLabel").remove();
    };

    /**
    * Adjust the locations of the legend labels downwards so that two labels
    * do not overlap.
    */
    Chart.prototype.adjustCompetitorLegendLabelsDownwardsIfNecessary = function (): void {
        for (let i = 1; i < this.numLines; i += 1) {
            const prevComp = this.currentCompetitorData[i - 1];
            const thisComp = this.currentCompetitorData[i];
            if (thisComp.y < prevComp.y + prevComp.textHeight) {
                thisComp.y = prevComp.y + prevComp.textHeight;
            }
        }
    };

    /**
    * Adjusts the locations of the legend labels upwards so that as many as
    * possible can fit on the chart.  If all competitor labels are already on
    * the chart, then this method does nothing.
    *
    * This method does not move off the chart any label that is currently on
    * the chart.
    *
    * @sb-param {Number} minLastY - The minimum Y-coordinate of the lowest label.
    */
    Chart.prototype.adjustCompetitorLegendLabelsUpwardsIfNecessary = function (minLastY: number): void {
        if (this.numLines > 0 && this.currentCompetitorData[this.numLines - 1].y > this.contentHeight) {
            // The list of competitors runs off the bottom.
            // Put the last competitor at the bottom, or at its minimum
            // Y-offset, whichever is larger, and move all labels up as
            // much as we can.
            this.currentCompetitorData[this.numLines - 1].y = Math.max(minLastY, this.contentHeight);
            for (let i = this.numLines - 2; i >= 0; i -= 1) {
                const nextComp = this.currentCompetitorData[i + 1];
                const thisComp = this.currentCompetitorData[i];
                if (thisComp.y + thisComp.textHeight > nextComp.y) {
                    thisComp.y = nextComp.y - thisComp.textHeight;
                } else {
                    // No more adjustments need to be made.
                    break;
                }
            }
        }
    };

    /**
    * Draw legend labels to the right of the chart.
    * @sb-param {object} chartData - The chart data that contains the final time offsets.
    */
    Chart.prototype.drawCompetitorLegendLabels = function (chartData): void {

        let minLastY = 0;
        if (chartData.dataColumns.length === 0) {
            this.currentCompetitorData = [];
        } else {
            const finishColumn = chartData.dataColumns[chartData.dataColumns.length - 1];
            this.currentCompetitorData = d3.range(this.numLines).map(function (i) {
                const competitorIndex = this.selectedIndexes[i];
                const name = this.courseClassSet.allCompetitors[competitorIndex].name;
                const textHeight = this.getTextHeight(name);
                minLastY += textHeight;
                return {
                    label: formatNameAndSuffix(name, getSuffix(this.courseClassSet.allCompetitors[competitorIndex])),
                    textHeight: textHeight,
                    y: (isNotNullNorNaN(finishColumn.ys[i])) ? this.yScale(finishColumn.ys[i]) : null,
                    colour: colours[competitorIndex % colours.length],
                    index: competitorIndex
                };
            }, this);

            minLastY -= this.currentCompetitorData[this.numLines - 1].textHeight;

            // Draw the mispunchers at the bottom of the chart, with the last
            // one of them at the bottom.
            let lastMispuncherY = null;
            for (let selCompIdx = this.numLines - 1; selCompIdx >= 0; selCompIdx -= 1) {
                if (this.currentCompetitorData[selCompIdx].y === null) {
                    this.currentCompetitorData[selCompIdx].y = (lastMispuncherY === null) ? this.contentHeight : lastMispuncherY - this.currentCompetitorData[selCompIdx].textHeight;
                    lastMispuncherY = this.currentCompetitorData[selCompIdx].y;
                }
            }
        }

        // Sort by the y-offset values, which doesn't always agree with the end
        // positions of the competitors.
        this.currentCompetitorData.sort(function (a, b) { return a.y - b.y; });

        this.selectedIndexesOrderedByLastYValue = this.currentCompetitorData.map(function (comp) { return comp.index; });

        this.adjustCompetitorLegendLabelsDownwardsIfNecessary();

        this.adjustCompetitorLegendLabelsUpwardsIfNecessary(minLastY);

        let legendLines = this.svgGroup.selectAll("line.competitorLegendLine").data(this.currentCompetitorData);
        legendLines.enter().append("line").classed("competitorLegendLine", true);

        const outerThis = this;
        legendLines = this.svgGroup.selectAll("line.competitorLegendLine").data(this.currentCompetitorData);
        legendLines.attr("x1", this.contentWidth + 1)
            .attr("y1", function (data) { return data.y; })
            .attr("x2", this.contentWidth + LEGEND_LINE_WIDTH + 1)
            .attr("y2", function (data) { return data.y; })
            .attr("stroke", function (data) { return data.colour; })
            .attr("class", function (data) { return "competitorLegendLine competitor" + data.index; })
            .on("mouseenter", function (data) { outerThis.highlight(data.index); })
            .on("mouseleave", function () { outerThis.unhighlight(); });

        legendLines.exit().remove();

        let labels = this.svgGroup.selectAll("text.competitorLabel").data(this.currentCompetitorData);
        labels.enter().append("text").classed("competitorLabel", true);

        labels = this.svgGroup.selectAll("text.competitorLabel").data(this.currentCompetitorData);
        labels.attr("x", this.contentWidth + LEGEND_LINE_WIDTH + 2)
            .attr("y", function (data) { return data.y + data.textHeight / 4; })
            .attr("class", function (data) { return "competitorLabel competitor" + data.index; })
            .on("mouseenter", function (data) { outerThis.highlight(data.index); })
            .on("mouseleave", function () { outerThis.unhighlight(); })
            .text(function (data) { return data.label; });

        labels.exit().remove();
    };

    /**
    * Adjusts the computed values for the content size of the chart.
    *
    * This method should be called after any of the following occur:
    * (1) the overall size of the chart changes.
    * (2) the currently-selected set of indexes changes
    * (3) the chart data is set.
    * If you find part of the chart is missing sometimes, chances are you've
    * omitted a necessary call to this method.
    */
    Chart.prototype.adjustContentSize = function (): void {
        // Extra length added to the maximum start-time label width to
        // include the lengths of the Y-axis ticks.
        const EXTRA_MARGIN = 8;
        const maxTextWidth = this.getMaxGraphEndTextWidth();
        this.setLeftMargin(Math.max(this.maxStartTimeLabelWidth + EXTRA_MARGIN, MARGIN.left));
        this.contentWidth = Math.max(this.overallWidth - this.currentLeftMargin - MARGIN.right - maxTextWidth - (LEGEND_LINE_WIDTH + 2), 100);
        this.contentHeight = Math.max(this.overallHeight - MARGIN.top - MARGIN.bottom, 100);
    };

    /**
    * Sets the overall size of the chart control, including margin, axes and legend labels.
    * @sb-param {Number} overallWidth - Overall width
    * @sb-param {Number} overallHeight - Overall height
    */
    Chart.prototype.setSize = function (overallWidth: number, overallHeight: number) {
        this.overallWidth = overallWidth;
        this.overallHeight = overallHeight;
        $(this.svg.node()).width(overallWidth).height(overallHeight);
        this.adjustContentSize();
    };

    /**
    * Clears the graph by removing all controls from it.
    */
    Chart.prototype.clearGraph = function () {
        this.svgGroup.selectAll("*").remove();
    };

    /**
    * Sorts the reference cumulative times, and creates a list of the sorted
    * reference cumulative times and their indexes into the actual list of
    * reference cumulative times.
    *
    * This sorted list is used by the chart to find which control the cursor
    * is closest to.
    */
    Chart.prototype.sortReferenceCumTimes = function (): void {
        // Put together a map that maps cumulative times to the first split to
        // register that time.
        const cumTimesToControlIndex = d3.map();
        this.referenceCumTimes.forEach(function (cumTime, index) {
            if (!cumTimesToControlIndex.has(cumTime)) {
                cumTimesToControlIndex.set(cumTime, index);
            }
        });

        // Sort and deduplicate the reference cumulative times.
        this.referenceCumTimesSorted = this.referenceCumTimes.slice(0);
        this.referenceCumTimesSorted.sort(d3.ascending);
        for (let index = this.referenceCumTimesSorted.length - 1; index > 0; index -= 1) {
            if (this.referenceCumTimesSorted[index] === this.referenceCumTimesSorted[index - 1]) {
                this.referenceCumTimesSorted.splice(index, 1);
            }
        }

        this.referenceCumTimeIndexes = this.referenceCumTimesSorted.map(function (cumTime) { return cumTimesToControlIndex.get(cumTime); });
    };

    /**
    * Draws the chart.
    * @sb-param {object} data - Object that contains various chart data.  This
    *     must contain the following properties:
    *     * chartData {Object} - the data to plot on the chart
    *     * eventData {Event} - the overall Event object.
    *     * courseClassSet {Event} - the course-class set.
    *     * referenceCumTimes {Array} - Array of cumulative split times of the
    *       'reference'.
    *     * fastestCumTimes {Array} - Array of cumulative times of the
    *       imaginary 'fastest' competitor.
    * @sb-param {Array} selectedIndexes - Array of indexes of selected competitors
    *                (0 in this array means the first competitor is selected, 1
    *                means the second is selected, and so on.)
    * @sb-param {Array} visibleStatistics - Array of boolean flags indicating whether
    *                                    certain statistics are visible.
    * @sb-param {Object} chartType - The type of chart being drawn.
    */
    Chart.prototype.drawChart = function (data, selectedIndexes: Array<number>, visibleStatistics: Array<boolean>, chartType: ChartType) {
        const chartData = data.chartData;
        this.numControls = chartData.numControls;
        this.numLines = chartData.competitorNames.length;
        this.selectedIndexes = selectedIndexes;
        this.referenceCumTimes = data.referenceCumTimes;
        this.fastestCumTimes = data.fastestCumTimes;
        this.eventData = data.eventData;
        this.courseClassSet = data.courseClassSet;
        this.hasControls = data.courseClassSet.getCourse().hasControls();
        this.isRaceGraph = chartType.isRaceGraph;
        this.minViewableControl = chartType.minViewableControl;
        this.visibleStatistics = visibleStatistics;
        this.hasData = true;

        this.maxStatisticTextWidth = this.determineMaxStatisticTextWidth();
        this.maxStartTimeLabelWidth = (this.isRaceGraph) ? this.determineMaxStartTimeLabelWidth(chartData) : 0;
        this.sortReferenceCumTimes();
        this.adjustContentSize();
        this.createScales(chartData);
        this.drawBackgroundRectangles();
        this.drawAxes(getMessage(chartType.yAxisLabelKey), chartData);
        this.drawChartLines(chartData);
        this.drawCompetitorLegendLabels(chartData);
        this.removeControlLine();
        if (this.isRaceGraph) {
            this.drawCompetitorStartTimeLabels(chartData);
        } else {
            this.removeCompetitorStartTimeLabels();
        }
    };

    SplitsBrowser.Controls.Chart = Chart;
})();

// file results-table.js
(function () {
    "use strict";

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
    function ResultsTable(parent) {
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
        this.div = d3.select(this.parent).append("div")
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
                    while (maxPrecision < MAX_PERMITTED_PRECISION && Math.abs(cumTime - Math.round(cumTime * maxPrecisionFactor) / maxPrecisionFactor) > 1e-7 * cumTime) {
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
            headerCellData = headerCellData.concat(d3.range(1, this.courseClass.numControls + 1).toString());
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

            d3.range(1, this.courseClass.numControls + 2).forEach(function (controlNum) {
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

    SplitsBrowser.Controls.ResultsTable = ResultsTable;
})();

// file query-string.js
(function () {
    "use strict";

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
    function readSelectedClasses(queryString: string, eventData: Results) {
        const classNameMatch = CLASS_NAME_REGEXP.exec(queryString);
        if (classNameMatch === null) {
            // No class name specified in the URL.
            return null;
        } else {
            const classesByName = <any>d3.map();
            for (let index = 0; index < eventData.classes.length; index += 1) {
                classesByName.set(eventData.classes[index].name, eventData.classes[index]);
            }

            let classNames = decodeURIComponent(classNameMatch[1]).split(";");
            classNames = d3.set(classNames).values();
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
    * @sb-return {Object|null} Selected chart type, or null if not recognised.
    */
    function readChartType(queryString: string) {
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

    const BUILTIN_COMPARISON_TYPES = ["Winner", "FastestTime", "FastestTimePlus5", "FastestTimePlus25", "FastestTimePlus50", "FastestTimePlus100"];

    /**
    * Reads what to compare against.
    * @sb-param {String} queryString - The query string to read the comparison
    *     type from.
    * @sb-param {CourseClassSet|null} courseClassSet - Course-class set containing
    *     selected course-classes, or null if none are selected.
    * @sb-return {Object|null} Selected comparison type, or null if not
    *     recognised.
    */
    function readComparison(queryString: string, courseClassSet: CourseClassSet) {
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
    function formatComparison(queryString: string, index: number, runner) {
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
    function readSelectedCompetitors(queryString: string, courseClassSet: CourseClassSet) {
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
                    return d3.range(0, courseClassSet.allCompetitors.length);
                }

                competitorNames = d3.set(competitorNames).values();
                const allCompetitorNames = courseClassSet.allCompetitors.map(function (competitor) { return competitor.name; });
                const selectedCompetitorIndexes = [];
                competitorNames.forEach(function (competitorName) {
                    const index = allCompetitorNames.indexOf(competitorName);
                    if (index >= 0) {
                        selectedCompetitorIndexes.push(index);
                    }
                });

                selectedCompetitorIndexes.sort(d3.ascending);
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
    function formatSelectedCompetitors(queryString, courseClassSet, selected) {
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
    function readSelectedStatistics(queryString) {
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
    function formatSelectedStatistics(queryString, stats) {
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
    function readShowOriginal(queryString) {
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
    function formatShowOriginal(queryString, showOriginal) {
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
    function readFilterText(queryString) {
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
    function formatFilterText(queryString, filterText) {
        queryString = removeAll(queryString, FILTER_TEXT_REGEXP);
        return (filterText === "") ? queryString : queryString + "&filterText=" + encodeURIComponent(filterText);
    }

    /**
    * Attempts to parse the given query string.
    * @sb-param {String} queryString - The query string to parse.
    * @sb-param {Event} eventData - The parsed event data.
    * @sb-return {Object} The data parsed from the given query string.
    */
    function parseQueryString(queryString, eventData) {
        const courseClassSet = readSelectedClasses(queryString, eventData);
        const classIndexes = (courseClassSet === null) ? null : courseClassSet.classes.map(function (courseClass) { return eventData.classes.indexOf(courseClass); });
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
    function formatQueryString(queryString, eventData, courseClassSet, data) {
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

    SplitsBrowser.parseQueryString = parseQueryString;
    SplitsBrowser.formatQueryString = formatQueryString;
})();

// file warning-viewer.js
(function () {
    "use strict";

    const getMessage = Lang.getMessage;

    const CONTAINER_DIV_ID = "warningViewerContainer";

    /**
    * Constructs a new WarningViewer object.
    * @constructor
    * @sb-param {d3.selection} parent - d3 selection containing the parent to
    *     insert the selector into.
    */
    function WarningViewer(parent) {
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
                if (!container.is(e.target) && container.has(e.target).length === 0) {
                    outerThis.warningList.style("display", "none");
                }
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

    SplitsBrowser.Controls.WarningViewer = WarningViewer;
})();


// file viewer.js
export interface SplitsbrowserOptions {
    topBar?: string;
    containerElement?: string;
    defaultLanguage?: string;
}

(function () {
    "use strict";
    // Delay in milliseconds between a resize event being triggered and the
    // page responding to it.
    // (Resize events tend to come more than one at a time; if a resize event
    // comes in while a previous event is waiting, the previous event is
    // cancelled.)
    const RESIZE_DELAY_MS = 100;

    const Version = SplitsBrowser.Version;

    const getMessage = Lang.getMessage;
    const tryGetMessage = Lang.tryGetMessage;
    const getMessageWithFormatting = Lang.getMessageWithFormatting;
    const initialiseMessages = Lang.initialiseMessages;

    const ChartTypes = ChartTypeClass.chartTypes;

    const repairEventData = SplitsBrowser.DataRepair.repairEventData;
    const transferCompetitorData = SplitsBrowser.DataRepair.transferCompetitorData;
    const parseQueryString = SplitsBrowser.parseQueryString;
    const formatQueryString = SplitsBrowser.formatQueryString;

    const Controls = SplitsBrowser.Controls;
    const LanguageSelector = Controls.LanguageSelector;
    const ClassSelector = Controls.ClassSelector;
    const ChartTypeSelector = Controls.ChartTypeSelector;
    const ComparisonSelector = Controls.ComparisonSelector;
    const OriginalDataSelector = Controls.OriginalDataSelector;
    const StatisticsSelector = Controls.StatisticsSelector;
    const WarningViewer = Controls.WarningViewer;
    const CompetitorList = Controls.CompetitorList;
    const Chart = Controls.Chart;
    const ResultsTable = Controls.ResultsTable;

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
    function Viewer(options: SplitsbrowserOptions) {
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
    function alerter(message) {
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
    Viewer.prototype.setEvent = function (eventData) {
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
        let body: any;
        // DKR Attach the D3 output to a div with ID of SB container
        if (options && options.containerElement) {
            body = d3.select(options.containerElement);
        } else {
            body = d3.select("body");
        }

        body.style("overflow", "hidden");

        this.container = body.append("div")
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
    Viewer.prototype.getHorizontalMargin = function () {
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
    Viewer.prototype.getVerticalMargin = function () {
        const body = $("app-graph");
        const container = $(this.container.node());
        return (body.outerHeight(true) - body.height()) + (container.outerHeight() - container.height());
    };

    /**
    * Gets the usable height of the window, i.e. the height of the window minus
    * margin and the height of the top bar, if any.  This height is used for
    * the competitor list and the chart.
    * @sb-return {Number} Usable height of the window.
    */
    Viewer.prototype.getUsableHeight = function () {
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
    Viewer.prototype.setClasses = function (classIndexes) {
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
    Viewer.prototype.initClasses = function (classIndexes) {
        this.classSelector.selectClasses(classIndexes);
        this.setClasses(classIndexes);
        this.competitorList.setCompetitorList(this.courseClassSet.allCompetitors, (this.currentClasses.length > 1));
        this.selection = new CompetitorSelection(this.courseClassSet.allCompetitors.length);
        this.competitorList.setSelection(this.selection);
        this.previousCompetitorList = this.courseClassSet.allCompetitors;
    };

    /**
    * Change the graph to show the classes with the given indexes.
    * @sb-param {Number} classIndexes - The (zero-based) indexes of the classes.
    */
    Viewer.prototype.selectClasses = function (classIndexes) {
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
    Viewer.prototype.selectChartType = function (chartType) {
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
    Viewer.prototype.selectChartTypeAndRedraw = function (chartType) {
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
    Viewer.prototype.selectOriginalOrRepairedData = function (showOriginalData) {
        if (showOriginalData) {
            transferCompetitorData(this.eventData);
        } else {
            repairEventData(this.eventData);
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

    SplitsBrowser.Viewer = Viewer;

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
    SplitsBrowser.readEvent = function (data: string, options: SplitsbrowserOptions) {
        if (!checkD3Version4()) {
            return;
        }

        let eventData;
        try {
            eventData = parseEventData(data);
        } catch (e) {
            if (e.name === "InvalidData") {
                showLoadFailureMessage("LoadFailedInvalidData", { "$$MESSAGE$$": e.message });
                return;
            } else {
                throw e;
            }
        }

        if (eventData === null) {
            showLoadFailureMessage("LoadFailedUnrecognisedData", new Object);
        } else {
            if (eventData.needsRepair()) {
                repairEventData(eventData);
            }

            if (typeof options === "string") {
                // Deprecated; support the top-bar specified only as a
                // string.
                options = { topBar: options };
            }

            eventData.determineTimeLosses();

            if (options && options.defaultLanguage) {
                initialiseMessages(options.defaultLanguage);
            }

            const viewer = new Viewer(options);
            viewer.buildUi(options);
            viewer.setEvent(eventData);

            const queryString = document.location.search;
            if (queryString !== null && queryString.length > 0) {
                const parsedQueryString = parseQueryString(queryString, eventData);
                viewer.updateFromQueryString(parsedQueryString);
            } else {
                viewer.setDefaultSelectedClass();
            }

            viewer.setCompetitorListHeight();
            viewer.setChartSize();
            viewer.drawChart();
            viewer.registerChangeHandlers();
        }
    };

    /**
    * Handles an asynchronous callback that fetched event data, by parsing the
    * data and starting SplitsBrowser.
    * @sb-param {String} data - The data returned from the AJAX request.
    * @sb-param {String} status - The status of the request.
    * @sb-param {Object|String|HTMLElement|undefined} options - Optional object
    *     containing various options to SplitsBrowser.  It can also be used for
    *     an HTML element that forms a 'banner' across the top of the page.
    *     This element can be specified by a CSS selector for the element, or
    *     the HTML element itself, although this behaviour is deprecated.
    */
    function readEventData(data: string, status: string, options: SplitsbrowserOptions): void {
        if (status === "success") {
            SplitsBrowser.readEvent(data, options);
        } else {
            showLoadFailureMessage("LoadFailedStatusNotSuccess", { "$$STATUS$$": status });
        }
    }

    /**
    * Handles the failure to read an event.
    * @sb-param {jQuery.jqXHR} jqXHR - jQuery jqXHR object.
    * @sb-param {String} textStatus - The text status of the request.
    * @sb-param {String} errorThrown - The error message returned from the server.
    */
    function readEventDataError(jqXHR, textStatus: string, errorThrown: string): void {
        showLoadFailureMessage("LoadFailedReadError", { "$$ERROR$$": errorThrown });
    }

    /**
    * Loads the event data in the given URL and starts SplitsBrowser.
    * @sb-param {String} eventUrl - The URL that points to the event data to load.
    * @sb-param {Object|String|HTMLElement|undefined} options - Optional object
    *     containing various options to SplitsBrowser.  It can also be used for
    *     an HTML element that forms a 'banner' across the top of the page.
    *     This element can be specified by a CSS selector for the element, or
    *     the HTML element itself, although this behaviour is deprecated.
    */
    SplitsBrowser.loadEvent = function (eventUrl: string,
        options: SplitsbrowserOptions) {
        if (!checkD3Version4()) {
            return;
        }

        // Load the event data
        $.ajax({
            url: eventUrl,
            data: "",
            success: function (data, status) { readEventData(data, status, options); },
            dataType: "text",
            error: readEventDataError
        });
    };
})();
