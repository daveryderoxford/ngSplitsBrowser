// file chart.js

// import * as d3 from "d3";
import { ascending as d3_ascending, bisect as d3_bisect, max as d3_max, min as d3_min, range as d3_range, zip as d3_zip } from "d3-array";
import { axisBottom, axisLeft, axisTop } from "d3-axis";
import { map as d3_map } from "d3-collection";
import { scaleLinear } from "d3-scale";
import { select, selectAll } from "d3-selection";
import { line } from "d3-shape";
import * as $ from "jquery";
import { Competitor, CourseClassSet, Results, sbTime, TimeUtilities } from "../../model";
import { isNaNStrict, isNotNullNorNaN } from "../../model/util";
import { ChartPopup } from "./chart-popup";
import { ChartType } from "./chart-types";
import { Lang } from "./lang";
import { FastestSplitsPopupData, SplitsPopupData } from "./splits-popup-data";


export interface ChartDisplayData {
   chartData: ChartData;
   eventData: Results;
   courseClassSet: CourseClassSet;
   referenceCumTimes: sbTime[];
   fastestCumTimes: sbTime[];
}

export interface ChartData {
   chartData: ChartType;
   eventData: Results;
   courseClassSet: CourseClassSet;
   referenceCumTimes: sbTime[];
   fastestCumTimes: sbTime[];
   numControls?: number;
   competitorNames?: Array<string>;
   datacolumns?: any;
   dubiousTimesInfo?: any;
}

// Local shorthand functions.
const formatTime = TimeUtilities.formatTime;
const getMessage = Lang.getMessage;

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
function formatTimeAndRank(time, rank): string {
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
* Returns the maximum value from the given array, not including any null or
* NaN values.  If the array contains no non-null, non-NaN values, zero is
* returned.
* @sb-param {Array} values - Array of values.
* @sb-return {Number} Maximum non-null or NaN value.
*/
function maxNonNullNorNaNValue(values: Array<number | null>): number {
   const nonNullNorNaNValues: Array<number> = values.filter(isNotNullNorNaN);
   return (nonNullNorNaNValues.length > 0) ? d3_max(nonNullNorNaNValues) : 0;
}

/**
* A chart object in a window.
* @constructor
* @sb-param {HTMLElement} parent - The parent object to create the element within.
*/
export class Chart {

   parent: HTMLElement;
   svg;
   svgGroup;
   textSizeElement;

   xScale = null;
   yScale = null;
   overallWidth = -1;
   overallHeight = -1;
   contentWidth = -1;
   contentHeight = -1;

   popup; // ChartPopup object. Chart popup is currently implemenetd as a function
   popupData: SplitsPopupData = new SplitsPopupData(MAX_FASTEST_SPLITS, RACE_GRAPH_COMPETITOR_WINDOW);
   isPopupOpen = false;
   popupUpdateFunc = null;

   mouseOutTimeout = null; // Mouse timeout function
   isMouseIn = false;

   // The position the mouse cursor is currently over, or null for not over
   // the charts.  This index is constrained by the minimum control that a
   // chart type specifies.
   currentControlIndex: number | null = null;

   // The position the mouse cursor is currently over, or null for not over
   // the charts.  Unlike currentControlIndex, this index is not
   // constrained by the minimum control that a chart type specifies.
   actualControlIndex: number | null = null;

   controlLine = null;  // SVG line running the lenght of the control

   currentChartTime: number = null;

   hasData = false;
   numControls = -1;
   selectedIndexes: number[] = [];
   currentCompetitorData = null;

   maxStartTimeLabelWidth = 0;
   maxStatisticTextWidth: number;

   // Indexes of the currently-selected competitors, in the order that
   // they appear in the list of labels.
   selectedIndexesOrderedByLastYValue: number[] = [];
   referenceCumTimes: sbTime[] = [];
   referenceCumTimesSorted: sbTime[] = [];
   referenceCumTimeIndexes: sbTime[] = [];
   fastestCumTimes: sbTime[] = [];

   // Chart data
   numLines: number;
   eventData: Results;
   courseClassSet: CourseClassSet;
   hasControls: boolean;
   isRaceGraph: boolean;
   minViewableControl;
   visibleStatistics;
   currentLeftMargin: number;
   xScaleMinutes: d3.ScaleLinear<number, number>;

   constructor(parent: HTMLElement) {
      this.parent = parent;

      this.svg = select(this.parent).append("svg").attr("id", CHART_SVG_ID);

      this.svgGroup = this.svg.append("g");
      this.setLeftMargin(MARGIN.left);

      const mousemoveHandler = event => this.onMouseMove(event);
      const mouseupHandler = event => this.onMouseUp(event);
      const mousedownHandler = event => this.onMouseDown(event);
      $(this.svg.node()).mouseenter(event => this.onMouseEnter(<JQueryEventObject>event))
         .mousemove(mousemoveHandler)
         .mouseleave(() => this.onMouseLeave())
         .mousedown(mousedownHandler)
         .mouseup(mouseupHandler);

      // Disable the context menu on the chart, so that it doesn't open when
      // showing the right-click popup.
      $(this.svg.node()).contextmenu( e =>  e.preventDefault() );

      // Add an invisible text element used for determining text size.
      this.textSizeElement = this.svg.append("text").attr("fill", "transparent")
         .attr("id", TEXT_SIZE_ELEMENT_ID);

      const handlers = { "mousemove": mousemoveHandler, "mousedown": mousedownHandler, "mouseup": mouseupHandler };
      this.popup = new ChartPopup(parent, handlers);

      $(document).mouseup(() => { this.popup.hide(); });
   }

   /**
   * Sets the left margin of the chart.
   * @sb-param {Number} leftMargin - The left margin of the chart.
   */
   setLeftMargin(leftMargin: number) {
      this.currentLeftMargin = leftMargin;
      this.svgGroup.attr("transform", "translate(" + this.currentLeftMargin + "," + MARGIN.top + ")");
   }

   /**
   * Gets the location the chart popup should be at following a mouse-button
   * press or a mouse movement.
   * @sb-param {jQuery.event} event - jQuery mouse-down or mouse-move event.
   * @sb-return {Object} Location of the popup.
   */
   getPopupLocation(event: JQueryEventObject) {
      return {
         x: event.pageX + CHART_POPUP_X_OFFSET,
         y: Math.max(event.pageY - this.popup.height() / 2, 0)
      };
   }

   /**
   * Returns the fastest splits to the current control.
   * @sb-return {Array} Array of fastest-split data.
   */
   getFastestSplitsPopupData(): FastestSplitsPopupData {
      return this.popupData.getFastestSplitsPopupData(this.courseClassSet, this.currentControlIndex);
   }

   /**
   * Returns the fastest splits for the currently-shown leg.  The list
   * returned contains the fastest splits for the current leg for each class.
   * @sb-return {Object} Object that contains the title for the popup and the
   *     array of data to show within it.
   */
   getFastestSplitsForCurrentLegPopupData() {
      return this.popupData.getFastestSplitsForLegPopupData(this.courseClassSet, this.eventData, this.currentControlIndex);
   }

   /**
   * Stores the current time the mouse is at, on the race graph.
   * @sb-param {jQuery.event} event - The mouse-down or mouse-move event.
   */
   setCurrentChartTime(event: JQueryEventObject) {
      const yOffset = event.pageY - $(this.svg.node()).offset().top - MARGIN.top;
      this.currentChartTime = Math.round(this.yScale.invert(yOffset) * 60) + this.referenceCumTimes[this.currentControlIndex];
   }

   /**
   * Returns an array of the competitors visiting the current control at the
   * current time.
   * @sb-return {Array} Array of competitor data.
   */
   getCompetitorsVisitingCurrentControlPopupData() {
      return this.popupData.getCompetitorsVisitingCurrentControlPopupData(this.courseClassSet,
         this.eventData,
         this.currentControlIndex,
         this.currentChartTime);
   }

   /**
   * Returns next-control data to show on the chart popup.
   * @sb-return {Array} Array of next-control data.
   */
   getNextControlData() {
      return this.popupData.getNextControlData(this.courseClassSet.getCourse(), this.eventData, this.actualControlIndex);
   }

   /**
   * Handle the mouse entering the chart.
   * @sb-param {jQuery.event} event - jQuery event object.
   */
   onMouseEnter(event: JQueryEventObject) {
      if (this.mouseOutTimeout !== null) {
         clearTimeout(this.mouseOutTimeout);
         this.mouseOutTimeout = null;
      }

      this.isMouseIn = true;
      if (this.hasData) {
         this.updateControlLineLocation(event);
      }
   }

   /**
   * Handle a mouse movement.
   * @sb-param {jQuery.event} event - jQuery event object.
   */
   onMouseMove(event: JQueryEventObject) {
      if (this.hasData && this.isMouseIn && this.xScale !== null) {
         this.updateControlLineLocation(event);
      }
   }

   /**
   * Handle the mouse leaving the chart.
   */
   onMouseLeave() {
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
   }

   /**
   * Handles a mouse button being pressed over the chart.
   * @sb-param {jQuery.Event} event - jQuery event object.
   */
   onMouseDown(event: JQueryEventObject) {
      const outerThis = this;
      // Use a timeout to open the dialog as we require other events
      // (mouseover in particular) to be processed first, and the precise
      // order of these events is not consistent between browsers.
      setTimeout(function () { outerThis.showPopupDialog(event); }, 1);
   }

   /**
   * Handles a mouse button being pressed over the chart.
   * @sb-param {jQuery.event} event - The jQuery onMouseUp event.
   */
   onMouseUp(even: JQueryEventObject) {
      this.popup.hide();
      event.preventDefault();
   }

   /**
   * Shows the popup window, populating it with data as necessary
   * @sb-param {jQuery.event} event - The jQuery onMouseDown event that triggered
   *     the popup.
   */
   showPopupDialog(event: JQueryEventObject) {
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
   }

   /**
   * Updates the chart popup with the contents it should contain.
   *
   * If the current course has control data, and the cursor is above the top
   * X-axis, control information is shown instead of whatever other data would
   * be being shown.
   *
   * @sb-param {jQuery.event} event - jQuery mouse-move event.
   */
   updatePopupContents(event: JQueryEventObject) {
      const yOffset = event.pageY - $(this.svg.node()).offset().top;
      const showNextControls = this.hasControls && yOffset < MARGIN.top;
      if (showNextControls) {
         this.updateNextControlInformation();
      } else {
         this.popupUpdateFunc();
      }
   }

   /**
   * Updates the next-control information.
   */
   updateNextControlInformation() {
      if (this.hasControls) {
         this.popup.setNextControlData(this.getNextControlData());
      }
   }

   /**
   * Draw a 'control line'.  This is a vertical line running the entire height of
   * the chart, at one of the controls.
   * @sb-param {Number} controlIndex - The index of the control at which to draw the
   *                                control line.
   */
   drawControlLine(controlIndex: number) {
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
   }

   /**
   * Updates the location of the control line from the given mouse event.
   * @sb-param {jQuery.event} event - jQuery mousedown or mousemove event.
   */
   updateControlLineLocation(event: JQueryEventObject) {

      const svgNodeAsJQuery = $(this.svg.node());
      const offset = svgNodeAsJQuery.offset();
      const xOffset = event.pageX - offset.left;
      const yOffset = event.pageY - offset.top;

      if (this.currentLeftMargin <= xOffset && xOffset < svgNodeAsJQuery.width() - MARGIN.right &&
         yOffset < svgNodeAsJQuery.height() - MARGIN.bottom) {
         // In the chart.
         // Get the time offset that the mouse is currently over.
         const chartX = this.xScale.invert(xOffset - this.currentLeftMargin);
         const bisectIndex = d3_bisect(this.referenceCumTimesSorted, chartX);

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
   }

   /**
   * Remove any previously-drawn control line.  If no such line existed, nothing
   * happens.
   */
   removeControlLine() {
      this.currentControlIndex = null;
      this.actualControlIndex = null;
      this.updateCompetitorStatistics();
      if (this.controlLine !== null) {
         select(this.controlLine).remove();
         this.controlLine = null;
      }
   }

   /**
   * Returns an array of the the times that the selected competitors are
   * behind the fastest time at the given control.
   * @sb-param {Number} controlIndex - Index of the given control.
   * @sb-param {Array} indexes - Array of indexes of selected competitors.
   * @sb-return {Array} Array of times in seconds that the given competitors are
   *     behind the fastest time.
   */
   getTimesBehindFastest(controlIndex: number, indexes: Array<number>): Array<number | null> {
      const selectedCompetitors = indexes.map( index => this.courseClassSet.allCompetitors[index] );
      const fastestSplit = this.fastestCumTimes[controlIndex] - this.fastestCumTimes[controlIndex - 1];
      const timesBehind = selectedCompetitors.map( comp => {
         const compSplit = comp.getSplitTimeTo(controlIndex);
         return (compSplit === null) ? null : compSplit - fastestSplit;
      });
      return timesBehind;
   }

   /**
   * Returns an array of the the time losses of the selected competitors at
   * the given control.
   * @sb-param {Number} controlIndex - Index of the given control.
   * @sb-param {Array} indexes - Array of indexes of selected competitors.
   * @sb-return {Array} Array of times in seconds that the given competitors are
   *     deemed to have lost at the given control.
   */
   getTimeLosses(controlIndex: number, indexes: Array<number>): Array<number | null> {
      const selectedCompetitors = indexes.map( index => this.courseClassSet.allCompetitors[index] );
      const timeLosses = selectedCompetitors.map( comp => comp.getTimeLossAt(controlIndex) );
      return timeLosses;
   }

   /**
   * Updates the statistics text shown after the competitors.
   */
   updateCompetitorStatistics(): void {
      const selectedCompetitors = this.selectedIndexesOrderedByLastYValue.map(function (index) {
         return this.courseClassSet.allCompetitors[index];
      }, this);
      let labelTexts = selectedCompetitors.map(comp => formatNameAndSuffix(comp.name, getSuffix(comp)));

      if (this.currentControlIndex !== null && this.currentControlIndex > 0) {
         if (this.visibleStatistics.TotalTime) {
            const cumTimes = selectedCompetitors.map( comp => comp.getCumulativeTimeTo(this.currentControlIndex) );
            const cumRanks = selectedCompetitors.map( comp => comp.getCumulativeRankTo(this.currentControlIndex) );
            labelTexts = d3_zip(labelTexts, cumTimes, cumRanks)
               .map( (lab, time, rank) => lab + formatTimeAndRank(time, rank) );
         }

         if (this.visibleStatistics.SplitTime) {
            const splitTimes = selectedCompetitors.map( comp => comp.getSplitTimeTo(this.currentControlIndex) );
            const splitRanks = selectedCompetitors.map(comp => comp.getSplitRankTo(this.currentControlIndex) );
            labelTexts = d3_zip(labelTexts, splitTimes, splitRanks)
               .map( (lab, split, rank) =>  lab + formatTimeAndRank(split, rank) );
         }

         if (this.visibleStatistics.BehindFastest) {
            const timesBehind = this.getTimesBehindFastest(this.currentControlIndex, this.selectedIndexesOrderedByLastYValue);
            labelTexts = d3_zip<any>(labelTexts, timesBehind)
               .map( (lab, behind) => lab + SPACER + formatTime(behind) );
         }

         if (this.visibleStatistics.TimeLoss) {
            const timeLosses = this.getTimeLosses(this.currentControlIndex, this.selectedIndexesOrderedByLastYValue);
            labelTexts = d3_zip<any>(labelTexts, timeLosses)
               .map( (lab, loss) =>  lab + SPACER + formatTime(loss) );
         }
      }

      // Update the current competitor data.
      if (this.hasData) {
         this.currentCompetitorData.forEach( (data, index: number) =>  data.label = labelTexts[index] );
      }

      // This data is already joined to the labels; just update the text.
      selectAll("text.competitorLabel").text( (data: any) => data.label );
   }

   /**
   * Returns a tick-formatting function that formats the label of a tick on the
   * top X-axis.
   *
   * The function returned is suitable for use with the D3 axis.tickFormat method.
   *
   * @sb-returns {function} Tick-formatting function.
   */
   getTickFormatter() {
      const outerThis = this;
      return function (value, idx) {
         return (idx === 0) ? getMessage("StartNameShort") :
            ((idx === outerThis.numControls + 1) ? getMessage("FinishNameShort") : idx.toString());
      };
   }

   /**
   * Get the width of a piece of text.
   * @sb-param {string} text - The piece of text to measure the width of.
   * @sb-returns {Number} The width of the piece of text, in pixels.
   */
   getTextWidth(text: string): number {
      return this.textSizeElement.text(text).node().getBBox().width;
   }

   /**
   * Gets the height of a piece of text.
   *
   * @sb-param {string} text - The piece of text to measure the height of.
   * @sb-returns {Number} The height of the piece of text, in pixels.
   */
   getTextHeight(text: string): number {
      return this.textSizeElement.text(text).node().getBBox().height;
   }

   /**
   * Return the maximum width of the end-text shown to the right of the graph.
   *
   * This function considers only the competitors whose indexes are in the
   * list given.  This method returns zero if the list is empty.
   * @sb-returns {Number} Maximum width of text, in pixels.
   */
   getMaxGraphEndTextWidth(): number {
      if (this.selectedIndexes.length === 0) {
         // No competitors selected.  Avoid problems caused by trying to
         // find the maximum of an empty array.
         return 0;
      } else {
         const nameWidths = this.selectedIndexes.map(function (index: number) {
            const comp = this.courseClassSet.allCompetitors[index];
            return this.getTextWidth(formatNameAndSuffix(comp.name, getSuffix(comp)));
         }, this);
         return d3_max<number>(nameWidths) + this.determineMaxStatisticTextWidth();
      }
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
   getMaxTimeAndRankTextWidth(timeFuncName, rankFuncName): number {
      let maxTime = 0;
      let maxRank = 0;

      const selectedCompetitors = this.selectedIndexes.map( index => this.courseClassSet.allCompetitors[index] );

      d3_range(1, this.numControls + 2).forEach( controlIndex => {
         const times: Array<number> = selectedCompetitors.map(function (comp): number { return comp[timeFuncName](controlIndex); });
         maxTime = Math.max(maxTime, maxNonNullNorNaNValue(times));

         const ranks = selectedCompetitors.map(function (comp) { return comp[rankFuncName](controlIndex); });
         maxRank = Math.max(maxRank, maxNonNullNorNaNValue(ranks));
      });

      const text = formatTimeAndRank(maxTime, maxRank);
      return this.getTextWidth(text);
   }

   /**
   * Return the maximum width of the split-time and rank text shown to the right
   * of each competitor
   * @sb-returns {Number} Maximum width of split-time and rank text, in pixels.
   */
   getMaxSplitTimeAndRankTextWidth(): number {
      return this.getMaxTimeAndRankTextWidth("getSplitTimeTo", "getSplitRankTo");
   }

   /**
   * Return the maximum width of the cumulative time and cumulative-time rank text
   * shown to the right of each competitor
   * @sb-returns {Number} Maximum width of cumulative time and cumulative-time rank text, in
   *                   pixels.
   */
   getMaxCumulativeTimeAndRankTextWidth(): number {
      return this.getMaxTimeAndRankTextWidth("getCumulativeTimeTo", "getCumulativeRankTo");
   }

   /**
   * Return the maximum width of the behind-fastest time shown to the right of
   * each competitor
   * @sb-returns {Number} Maximum width of behind-fastest time rank text, in pixels.
   */
   getMaxTimeBehindFastestWidth(): number {
      let maxTime = 0;

      for (let controlIndex = 1; controlIndex <= this.numControls + 1; controlIndex += 1) {
         const times = this.getTimesBehindFastest(controlIndex, this.selectedIndexes);
         maxTime = Math.max(maxTime, maxNonNullNorNaNValue(times));
      }

      return this.getTextWidth(SPACER + formatTime(maxTime));
   }

   /**
   * Return the maximum width of the behind-fastest time shown to the right of
   * each competitor
   * @sb-returns {Number} Maximum width of behind-fastest time rank text, in pixels.
   */
   getMaxTimeLossWidth(): number {
      let maxTimeLoss = 0;
      let minTimeLoss = 0;
      for (let controlIndex = 1; controlIndex <= this.numControls + 1; controlIndex += 1) {
         const timeLosses = this.getTimeLosses(controlIndex, this.selectedIndexes);
         const nonNullTimeLosses: Array<number> = timeLosses.filter(isNotNullNorNaN);
         if (nonNullTimeLosses.length > 0) {
            maxTimeLoss = Math.max(maxTimeLoss, d3_max(nonNullTimeLosses));
            minTimeLoss = Math.min(minTimeLoss, d3_min(nonNullTimeLosses));
         }
      }

      return Math.max(this.getTextWidth(SPACER + formatTime(maxTimeLoss)),
         this.getTextWidth(SPACER + formatTime(minTimeLoss)));
   }

   /**
   * Determines the maximum width of the statistics text at the end of the competitor.
   * @sb-returns {Number} Maximum width of the statistics text, in pixels.
   */
   determineMaxStatisticTextWidth(): number {
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
   }

   /**
   * Determines the maximum width of all of the visible start time labels.
   * If none are presently visible, zero is returned.
   * @sb-param {object} chartData - Object containing the chart data.
   * @sb-return {Number} Maximum width of a start time label.
   */
   determineMaxStartTimeLabelWidth(chartData): number {
      let maxWidth;
      if (chartData.competitorNames.length > 0) {
         maxWidth = d3_max(chartData.competitorNames.map( name => this.getTextWidth("00:00:00 " + name) ));
      } else {
         maxWidth = 0;
      }

      return maxWidth;
   }

   /**
   * Creates the X and Y scales necessary for the chart and its axes.
   * @sb-param {object} chartData - Chart data object.
   */
   createScales(chartData) {
      this.xScale = scaleLinear().domain(chartData.xExtent).range([0, this.contentWidth]);
      this.yScale = scaleLinear().domain(chartData.yExtent).range([0, this.contentHeight]);
      this.xScaleMinutes = scaleLinear().domain([chartData.xExtent[0] / 60, chartData.xExtent[1] / 60]).range([0, this.contentWidth]);
   }

   /**
   * Draw the background rectangles that indicate sections of the course
   * between controls.
   */
   drawBackgroundRectangles(): void {

      // We can't guarantee that the reference cumulative times are in
      // ascending order, but we need such a list of times in order to draw
      // the rectangles.  So, sort the reference cumulative times.
      const refCumTimesSorted = this.referenceCumTimes.slice(0);
      refCumTimesSorted.sort(d3_ascending);

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
         .data(d3_range(refCumTimesSorted.length - 1));

      rects.enter().append("rect");

      rects = this.svgGroup.selectAll("rect")
         .data(d3_range(refCumTimesSorted.length - 1));
      rects.attr("x", (i) => outerThis.xScale(refCumTimesSorted[i]) )
         .attr("y", 0)
         .attr("width", (i) => outerThis.xScale(refCumTimesSorted[i + 1]) - outerThis.xScale(refCumTimesSorted[i]) )
         .attr("height", this.contentHeight)
         .attr("class",  (i) => { return (i % 2 === 0) ? "background1" : "background2"; });

      rects.exit().remove();
   }

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
   determineYAxisTickFormatter(chartData) {
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
            return  (time) => {
               const yarray: Array<number> = startTimes.map( (startTime) => {
                  return Math.abs(yScale(startTime) - yScale(time));
               });
               const nearestOffset = d3_min(yarray);
               return (nearestOffset >= MIN_COMPETITOR_TICK_MARK_DISTANCE) ? formatTime(Math.round(time * 60)) : "";
            };
         }
      } else {
         // Use the default d3 tick formatter.
         return null;
      }
   }

   /**
   * Draw the chart axes.
   * @sb-param {String} yAxisLabel - The label to use for the Y-axis.
   * @sb-param {object} chartData - The chart data to use.
   */
   drawAxes(yAxisLabel: string, chartData) {

      const tickFormatter = this.determineYAxisTickFormatter(chartData);

      const xAxis = axisTop(scaleLinear())
         .scale(this.xScale)
         .tickFormat(this.getTickFormatter())
         .tickValues(this.referenceCumTimes);

      const yAxis = axisLeft(scaleLinear())
         .scale(this.yScale)
         .tickFormat(tickFormatter);

      const lowerXAxis = axisBottom(scaleLinear())
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
   }

   /**
   * Draw the lines on the chart.
   * @sb-param {Array} chartData - Array of chart data.
   */
   drawChartLines(chartData) {
      const outerThis = this;
      const lineFunctionGenerator = selCompIdx => {
         if (!chartData.dataColumns.some(col => isNotNullNorNaN(col.ys[selCompIdx]) )) {
            // This competitor's entire row is null/NaN, so there's no data
            // to draw.  WebKit will report an error ('Error parsing d=""')
            // if no points on the line are defined, as will happen in this
            // case, so we substitute a single zero point instead.
            return line()
               .x(0)
               .y(0)
               .defined(function (d, i) { return i === 0; });
         } else {
            return line<any>()
               .x(function (d) { return outerThis.xScale(d.x); })
               .y(function (d) { return outerThis.yScale(d.ys[selCompIdx]); })
               .defined(function (d) { return isNotNullNorNaN(d.ys[selCompIdx]); });
         }
      };

      this.svgGroup.selectAll("path.graphLine").remove();

      this.svgGroup.selectAll("line.aroundDubiousTimes").remove();

      d3_range(this.numLines).forEach(function (selCompIdx) {
         const strokeColour = colours[this.selectedIndexes[selCompIdx] % colours.length];
         const highlighter = () => { outerThis.highlight(outerThis.selectedIndexes[selCompIdx]); };
         const unhighlighter = function () { outerThis.unhighlight(); };

         this.svgGroup.append("path")
            .attr("d", lineFunctionGenerator(selCompIdx)(chartData.dataColumns))
            .attr("stroke", strokeColour)
            .attr("class", "graphLine competitor" + this.selectedIndexes[selCompIdx])
            .on("mouseenter", highlighter)
            .on("mouseleave", unhighlighter)
            .append("title")
            .text(chartData.competitorNames[selCompIdx]);

         chartData.dubiousTimesInfo[selCompIdx].forEach( dubiousTimeInfo => {
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
         });
      });
   }

   /**
   * Highlights the competitor with the given index.
   * @sb-param {Number} competitorIdx - The index of the competitor to highlight.
   */
   highlight(competitorIdx: number): void {
      this.svg.selectAll("path.graphLine.competitor" + competitorIdx).classed("selected", true);
      this.svg.selectAll("line.competitorLegendLine.competitor" + competitorIdx).classed("selected", true);
      this.svg.selectAll("text.competitorLabel.competitor" + competitorIdx).classed("selected", true);
      this.svg.selectAll("text.startLabel.competitor" + competitorIdx).classed("selected", true);
      this.svg.selectAll("line.aroundDubiousTimes.competitor" + competitorIdx).classed("selected", true);
   }

   /**
   * Removes any competitor-specific higlighting.
   */
   unhighlight(): void {
      this.svg.selectAll("path.graphLine.selected").classed("selected", false);
      this.svg.selectAll("line.competitorLegendLine.selected").classed("selected", false);
      this.svg.selectAll("text.competitorLabel.selected").classed("selected", false);
      this.svg.selectAll("text.startLabel.selected").classed("selected", false);
      this.svg.selectAll("line.aroundDubiousTimes.selected").classed("selected", false);
   }

   /**
   * Draws the start-time labels for the currently-selected competitors.
   * @sb-param {object} chartData - The chart data that contains the start offsets.
   */
   drawCompetitorStartTimeLabels(chartData) {
      const startColumn = chartData.dataColumns[0];
      const outerThis = this;

      let startLabels = this.svgGroup.selectAll("text.startLabel").data(this.selectedIndexes);

      startLabels.enter().append("text")
         .classed("startLabel", true);

      startLabels = this.svgGroup.selectAll("text.startLabel").data(this.selectedIndexes);
      startLabels.attr("x", -7)
         .attr("y", function (_compIndex, selCompIndex) {
            return outerThis.yScale(startColumn.ys[selCompIndex])
               + outerThis.getTextHeight(chartData.competitorNames[selCompIndex]) / 4;
         })
         .attr("class", function (compIndex) { return "startLabel competitor" + compIndex; })
         .on("mouseenter", function (compIndex) { outerThis.highlight(compIndex); })
         .on("mouseleave", function () { outerThis.unhighlight(); })
         .text(function (_compIndex, selCompIndex) {
            return formatTime(Math.round(startColumn.ys[selCompIndex] * 60)) + " "
               + chartData.competitorNames[selCompIndex];
         });

      startLabels.exit().remove();
   }

   /**
   * Removes all of the competitor start-time labels from the chart.
   */
   removeCompetitorStartTimeLabels(): void {
      this.svgGroup.selectAll("text.startLabel").remove();
   }

   /**
   * Adjust the locations of the legend labels downwards so that two labels
   * do not overlap.
   */
   adjustCompetitorLegendLabelsDownwardsIfNecessary(): void {
      for (let i = 1; i < this.numLines; i += 1) {
         const prevComp = this.currentCompetitorData[i - 1];
         const thisComp = this.currentCompetitorData[i];
         if (thisComp.y < prevComp.y + prevComp.textHeight) {
            thisComp.y = prevComp.y + prevComp.textHeight;
         }
      }
   }

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
   adjustCompetitorLegendLabelsUpwardsIfNecessary(minLastY: number): void {
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
   }

   /**
   * Draw legend labels to the right of the chart.
   * @sb-param {object} chartData - The chart data that contains the final time offsets.
   */
   drawCompetitorLegendLabels(chartData): void {

      let minLastY = 0;
      if (chartData.dataColumns.length === 0) {
         this.currentCompetitorData = [];
      } else {
         const finishColumn = chartData.dataColumns[chartData.dataColumns.length - 1];
         this.currentCompetitorData = d3_range(this.numLines).map(function (i) {
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
               this.currentCompetitorData[selCompIdx].y = (lastMispuncherY === null) ?
                  this.contentHeight : lastMispuncherY - this.currentCompetitorData[selCompIdx].textHeight;
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
   }

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
   adjustContentSize(): void {
      // Extra length added to the maximum start-time label width to
      // include the lengths of the Y-axis ticks.
      const EXTRA_MARGIN = 8;
      const maxTextWidth = this.getMaxGraphEndTextWidth();
      this.setLeftMargin(Math.max(this.maxStartTimeLabelWidth + EXTRA_MARGIN, MARGIN.left));
      this.contentWidth = Math.max(this.overallWidth - this.currentLeftMargin
         - MARGIN.right - maxTextWidth - (LEGEND_LINE_WIDTH + 2), 100);
      this.contentHeight = Math.max(this.overallHeight - MARGIN.top - MARGIN.bottom, 100);
   }

   /**
   * Sets the overall size of the chart control, including margin, axes and legend labels.
   * @sb-param {Number} overallWidth - Overall width
   * @sb-param {Number} overallHeight - Overall height
   */
   setSize(overallWidth: number, overallHeight: number) {
      this.overallWidth = overallWidth;
      this.overallHeight = overallHeight;
      $(this.svg.node()).width(overallWidth).height(overallHeight);
      this.adjustContentSize();
   }

   /**
   * Clears the graph by removing all controls from it.
   */
   clearGraph() {
      this.svgGroup.selectAll("*").remove();
   }

   /**
   * Sorts the reference cumulative times, and creates a list of the sorted
   * reference cumulative times and their indexes into the actual list of
   * reference cumulative times.
   *
   * This sorted list is used by the chart to find which control the cursor
   * is closest to.
   */
   sortReferenceCumTimes(): void {
      // Put together a map that maps cumulative times to the first split to
      // register that time.
      const cumTimesToControlIndex = d3_map<number>();
      this.referenceCumTimes.forEach((cumTime, index) => {
         const cumTimeKey = cumTime.toString();
         if (!cumTimesToControlIndex.has(cumTimeKey)) {
            cumTimesToControlIndex.set(cumTimeKey, index);
         }
      });

      // Sort and deduplicate the reference cumulative times.
      this.referenceCumTimesSorted = this.referenceCumTimes.slice(0);
      this.referenceCumTimesSorted.sort(d3_ascending);
      for (let index = this.referenceCumTimesSorted.length - 1; index > 0; index -= 1) {
         if (this.referenceCumTimesSorted[index] === this.referenceCumTimesSorted[index - 1]) {
            this.referenceCumTimesSorted.splice(index, 1);
         }
      }

      this.referenceCumTimeIndexes = this.referenceCumTimesSorted.map(cumTime => cumTimesToControlIndex.get(cumTime.toString()));
   }

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
   drawChart(data: ChartDisplayData, selectedIndexes: Array<number>, visibleStatistics: Array<boolean>, chartType: ChartType) {
      const chartData: ChartData = data.chartData;
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
   }
}
