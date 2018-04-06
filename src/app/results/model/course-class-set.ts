import d3 = require("d3");
import { isNotNullNorNaN, isNaNStrict, isNotNull } from "./util";
import { InvalidData } from "./exception";

import { Competitor } from "./competitor";
import { sbTime } from "./time";

/**
* Utility function to merge the lists of all competitors in a number of
* classes.  All classes must contain the same number of controls.
* @sb-param {Array} classes - Array of CourseClass objects.
* @sb-return {Array} Merged array of competitors.
*/
function mergeCompetitors(classes: Array<any>) {
    if (classes.length === 0) {
        return [];
    }

    const allCompetitors = [];
    const expectedControlCount = classes[0].numControls;
    classes.forEach( (courseClass) =>  {
        if (courseClass.numControls !== expectedControlCount) {
            throw new InvalidData("Cannot merge classes with " + expectedControlCount + " and " + courseClass.numControls + " controls");
        }

        courseClass.competitors.forEach( (comp) => {
            if (!comp.isNonStarter) {
                allCompetitors.push(comp);
            }
        });
    });

    allCompetitors.sort(Competitor.compareCompetitors);
    return allCompetitors;
}

/**
* Given an array of numbers, return a list of the corresponding ranks of those
* numbers.
* @sb-param {Array} sourceData - Array of number values.
* @sb-returns Array of corresponding ranks.
*/
function getRanks(sourceData: Array<number>): Array<number> {
    // First, sort the source data, removing nulls.
    const sortedData = sourceData.filter(isNotNullNorNaN);
    sortedData.sort(d3.ascending);

    // Now construct a map that maps from source value to rank.
    // TODO - Check this section DKR was  var rankMap = new d3.map();
    const rankMap = d3.map() as d3.Map<number>;
    sortedData.forEach( (value: number, index: number) => {
        if (!rankMap.has(value.toString())) {
            rankMap.set(value.toString(), index + 1);
        }
    });

    // Finally, build and return the list of ranks.
    const ranks = sourceData.map( (value) => {
        return isNotNullNorNaN(value) ? rankMap.get(value.toString()) : value;
    });

    return ranks;
}

export interface FatestSplitsData {
    name: string;  // full name of competitor
    split: sbTime;  // Split time
}

export class CourseClassSet {
    allCompetitors: Array<Competitor>;
    numControls: number;

    /**
    * An object that represents the currently-selected classes.
    * @constructor
    * @sb-param {Array} classes - Array of currently-selected classes.
    */
    constructor(public classes) {
        this.allCompetitors = mergeCompetitors(this.classes);
        this.numControls = (classes.length > 0) ? classes[0].numControls : null;
        this.computeRanks();
    }

    /**
    * Returns whether this course-class set is empty, i.e. whether it has no
    * competitors at all.
    * @sb-return {boolean} True if the course-class set is empty, false if it is not
    *     empty.
    */
    public isEmpty(): boolean {
        return this.allCompetitors.length === 0;
    };

    /**
    * Returns the course used by all of the classes that make up this set.  If
    * there are no classes, null is returned instead.
    * @sb-return {?Course} The course used by all classes.
    */
    public getCourse() {
        return (this.classes.length > 0) ? this.classes[0].course : null;
    };

    /**
    * Returns the name of the 'primary' class, i.e. that that has been
    * chosen in the drop-down list.  If there are no classes, null is returned
    * instead.
    * @sb-return {?String} Name of the primary class.
    */
    public getPrimaryClassName() {
        return (this.classes.length > 0) ? this.classes[0].name : null;
    };

    /**
    * Returns the number of classes that this course-class set is made up of.
    * @sb-return {Number} The number of classes that this course-class set is
    *     made up of.
    */
    public getNumClasses(): number {
        return this.classes.length;
    };

    /**
    * Returns whether any of the classes within this set have data that
    * SplitsBrowser can identify as dubious.
    * @sb-return {boolean} True if any of the classes within this set contain
    *     dubious data, false if none of them do.
    */
    public hasDubiousData(): boolean {
        return this.classes.some( (courseClass) => { return courseClass.hasDubiousData; });
    };

    /**
    * Return a list of objects that describe when the given array of times has
    * null or NaN values.  This does not include trailing null or NaN values.
    * @sb-param {Array} times - Array of times, which may include NaNs and nulls.
    * @sb-param {boolean} includeEnd - Whether to include a blank range that ends
    *    at the end of the array
    * @sb-return {Array} Array of objects that describes when the given array has
    *    ranges of null and/or NaN values.
    */
    private getBlankRanges(times: Array<sbTime>, includeEnd: boolean): Array<any> {
        const blankRangeInfo = [];
        let startIndex = 1;
        while (startIndex + 1 < times.length) {
            if (isNotNullNorNaN(times[startIndex])) {
                startIndex += 1;
            } else {
                let endIndex = startIndex;
                while (endIndex + 1 < times.length && !isNotNullNorNaN(times[endIndex + 1])) {
                    endIndex += 1;
                }

                if (endIndex + 1 < times.length || includeEnd) {
                    blankRangeInfo.push({ start: startIndex - 1, end: endIndex + 1 });
                }

                startIndex = endIndex + 1;
            }
        }

        return blankRangeInfo;
    }

    /**
    * Fill in any NaN values in the given list of cumulative times by doing
    * a linear interpolation on the missing values.
    * @sb-param {Array} cumTimes - Array of cumulative times.
    * @sb-return {Array} Array of cumulative times with NaNs replaced.
    */
    private fillBlankRangesInCumulativeTimes(cumTimes: Array<sbTime>): Array<number> {
        cumTimes = cumTimes.slice(0);
        const blankRanges = this.getBlankRanges(cumTimes, false);
        for (let rangeIndex = 0; rangeIndex < blankRanges.length; rangeIndex += 1) {
            const range = blankRanges[rangeIndex];
            const timeBefore = cumTimes[range.start];
            const timeAfter = cumTimes[range.end];
            const avgTimePerControl = (timeAfter - timeBefore) / (range.end - range.start);
            for (let index = range.start + 1; index < range.end; index += 1) {
                cumTimes[index] = timeBefore + (index - range.start) * avgTimePerControl;
            }
        }

        let lastNaNTimeIndex = cumTimes.length;
        while (lastNaNTimeIndex >= 0 && isNaNStrict(cumTimes[lastNaNTimeIndex - 1])) {
            lastNaNTimeIndex -= 1;
        }

        if (lastNaNTimeIndex > 0) {
            for (let timeIndex = lastNaNTimeIndex; timeIndex < cumTimes.length; timeIndex += 1) {
                cumTimes[timeIndex] = cumTimes[timeIndex - 1] + ((timeIndex === cumTimes.length - 1) ? 60 : 180);
            }
        }

        return cumTimes;
    }

    /**
    * Returns an array of the cumulative times of the winner of the set of
    * classes.
    * @sb-return {Array} Array of the winner's cumulative times.
    */
    public getWinnerCumTimes(): Array<sbTime> {
        if (this.allCompetitors.length === 0) {
            return null;
        }

        const firstCompetitor = this.allCompetitors[0];
        return (firstCompetitor.completed()) ? this.fillBlankRangesInCumulativeTimes(firstCompetitor.cumTimes) : null;
    };

    /**
    * Return the imaginary competitor who recorded the fastest time on each leg
    * of the class.
    * If at least one control has no competitors recording a time for it, null
    * is returned.  If there are no classes at all, null is returned.
    * @sb-returns {?Array} Cumulative splits of the imaginary competitor with
    *           fastest time, if any.
    */
    public getFastestCumTimes(): Array<any> | null {
        return this.getFastestCumTimesPlusPercentage(0);
    };

    /**
    * Return the imaginary competitor who recorded the fastest time on each leg
    * of the given classes, with a given percentage of their time added.
    * If at least one control has no competitors recording a time for it, null
    * is returned.  If there are no classes at all, null is returned.
    * @sb-param {Number} percent - The percentage of time to add.
    * @sb-returns {?Array} Cumulative splits of the imaginary competitor with
    *           fastest time, if any, after adding a percentage.
    */
    public getFastestCumTimesPlusPercentage(percent: number): Array<sbTime> {
        if (this.numControls === null) {
            return null;
        }

        const ratio = 1 + percent / 100;

        const fastestSplits = new Array<sbTime>(this.numControls + 1);
        fastestSplits[0] = 0;

        for (let controlIdx = 1; controlIdx <= this.numControls + 1; controlIdx += 1) {
            let fastestForThisControl = null;
            for (let competitorIdx = 0; competitorIdx < this.allCompetitors.length; competitorIdx += 1) {
                const thisTime = this.allCompetitors[competitorIdx].getSplitTimeTo(controlIdx);
                if (isNotNullNorNaN(thisTime) && (fastestForThisControl === null || thisTime < fastestForThisControl)) {
                    fastestForThisControl = thisTime;
                }
            }

            fastestSplits[controlIdx] = fastestForThisControl;
        }

        if (!fastestSplits.every(isNotNull)) {
            // We don't have fastest splits for every control, so there was one
            // control that either nobody punched or everybody had a dubious
            // split for.

            // Find the blank-ranges of the fastest times.  Include the end
            // of the range in case there are no cumulative times at the last
            // control but there is to the finish.
            const fastestBlankRanges = this.getBlankRanges(fastestSplits, true);

            // Find all blank-ranges of competitors.
            const allCompetitorBlankRanges = [];
            this.allCompetitors.forEach( (competitor) => {
                const competitorBlankRanges = this.getBlankRanges(competitor.getAllCumulativeTimes(), false);
                competitorBlankRanges.forEach( (range) => {
                    allCompetitorBlankRanges.push({
                        start: range.start,
                        end: range.end,
                        size: range.end - range.start,
                        overallSplit: competitor.getCumulativeTimeTo(range.end) - competitor.getCumulativeTimeTo(range.start)
                    });
                });
            });

            // Now, for each blank range of the fastest times, find the
            // size of the smallest competitor blank range that covers it,
            // and then the fastest split among those competitors.
            fastestBlankRanges.forEach( (fastestRange) => {
                const coveringCompetitorRanges = allCompetitorBlankRanges.filter( (compRange) => {
                    return compRange.start <= fastestRange.start && fastestRange.end <= compRange.end + 1;
                });

                let minSize = null;
                let minOverallSplit = null;
                coveringCompetitorRanges.forEach( (coveringRange) => {
                    if (minSize === null || coveringRange.size < minSize) {
                        minSize = coveringRange.size;
                        minOverallSplit = null;
                    }

                    if (minOverallSplit === null || coveringRange.overallSplit < minOverallSplit) {
                        minOverallSplit = coveringRange.overallSplit;
                    }
                });

                // Assume that the fastest competitor across the range had
                // equal splits for all controls on the range.  This won't
                // always make sense but it's the best we can do.
                if (minSize !== null && minOverallSplit !== null) {
                    for (let index = fastestRange.start + 1; index < fastestRange.end; index += 1) {
                        fastestSplits[index] = minOverallSplit / minSize;
                    }
                }
            });
        }

        if (!fastestSplits.every(isNotNull)) {
            // Could happen if the competitors are created from split times and
            // the splits are not complete, and also if nobody punches the
            // final few controls.  Set any remaining missing splits to 3
            // minutes for intermediate controls and 1 minute for the finish.
            for (let index = 0; index < fastestSplits.length; index += 1) {
                if (fastestSplits[index] === null) {
                    fastestSplits[index] = (index === fastestSplits.length - 1) ? 60 : 180;
                }
            }
        }

        const fastestCumTimes = new Array(this.numControls + 1);
        fastestSplits.forEach( (fastestSplit, index) => {
            fastestCumTimes[index] = (index === 0) ? 0 : fastestCumTimes[index - 1] + fastestSplit * ratio;
        });

        return fastestCumTimes;
    };

    /**
    * Returns the cumulative times for the competitor with the given index,
    * with any runs of blanks filled in.
    * @sb-param {Number} competitorIndex - The index of the competitor.
    * @sb-return {Array} Array of cumulative times.
    */
    public getCumulativeTimesForCompetitor(competitorIndex: number): Array<sbTime> {
        return this.fillBlankRangesInCumulativeTimes(this.allCompetitors[competitorIndex].getAllCumulativeTimes());
    };

    /**
    * Compute the ranks of each competitor within their class.
    */
    public computeRanks() {
        if (this.allCompetitors.length === 0) {
            // Nothing to compute.
            return;
        }

        const splitRanksByCompetitor = [];
        const cumRanksByCompetitor = [];

        this.allCompetitors.forEach( () => {
            splitRanksByCompetitor.push([]);
            cumRanksByCompetitor.push([]);
        });

        d3.range(1, this.numControls + 2).forEach( (control) => {
            const splitsByCompetitor = this.allCompetitors.map( (comp) => {
                return comp.getSplitTimeTo(control);
            });
            const splitRanksForThisControl = getRanks(splitsByCompetitor);
            this.allCompetitors.forEach( (_comp, idx) => {
                splitRanksByCompetitor[idx].push(splitRanksForThisControl[idx]);
            });
        }, this);

        d3.range(1, this.numControls + 2).forEach( (control) => {
            // We want to null out all subsequent cumulative ranks after a
            // competitor mispunches.
            const cumSplitsByCompetitor = this.allCompetitors.map( (comp, idx) => {
                // -1 for previous control, another -1 because the cumulative
                // time to control N is cumRanksByCompetitor[idx][N - 1].
                if (control > 1 && cumRanksByCompetitor[idx][control - 1 - 1] === null) {
                    // This competitor has no cumulative rank for the previous
                    // control, so either they mispunched it or mispunched a
                    // previous one.  Give them a null time here, so that they
                    // end up with another null cumulative rank.
                    return null;
                } else {
                    return comp.getCumulativeTimeTo(control);
                }
            });
            const cumRanksForThisControl = getRanks(cumSplitsByCompetitor);
            this.allCompetitors.forEach( (_comp, idx) => { cumRanksByCompetitor[idx].push(cumRanksForThisControl[idx]); });
        }, this);

        this.allCompetitors.forEach( (comp, idx) => {
            comp.setSplitAndCumulativeRanks(splitRanksByCompetitor[idx], cumRanksByCompetitor[idx]);
        });
    };

    /**
    * Returns the best few splits to a given control.
    *
    * The number of splits returned may actually be fewer than that asked for,
    * if there are fewer than that number of people on the class or who punch
    * the control.
    *
    * The results are returned in an array of 2-element arrays, with each child
    * array containing the split time and the name.  The array is returned in
    * ascending order of split time.
    *
    * @sb-param {Number} numSplits - Maximum number of split times to return.
    * @sb-param {Number} controlIdx - Index of the control.
    * @sb-return {Array} Array of the fastest splits to the given control.
    */
    public getFastestSplitsTo(numSplits: number, controlIdx: number): Array<FatestSplitsData> {
        if (typeof numSplits !== "number" || numSplits <= 0) {
            throw new InvalidData("The number of splits must be a positive integer");
        } else if (typeof controlIdx !== "number" || controlIdx <= 0 || controlIdx > this.numControls + 1) {
            throw new InvalidData("Control " + controlIdx + " out of range");
        } else {
            // Compare competitors by split time at this control, and, if those
            // are equal, total time.
            const comparator =  (compA: Competitor, compB: Competitor) => {
                const compASplit = compA.getSplitTimeTo(controlIdx);
                const compBSplit = compB.getSplitTimeTo(controlIdx);
                return (compASplit === compBSplit) ? d3.ascending(compA.totalTime, compB.totalTime) : d3.ascending(compASplit, compBSplit);
            };

            const competitors = this.allCompetitors.filter( (comp) => {
                return comp.completed() && !isNaNStrict(comp.getSplitTimeTo(controlIdx));
            });
            competitors.sort(comparator);
            const results = [];
            for (let i = 0; i < competitors.length && i < numSplits; i += 1) {
                results.push({ name: competitors[i].name, split: competitors[i].getSplitTimeTo(controlIdx) });
            }

            return results;
        }
    };

    /**
    * Return data from the current classes in a form suitable for plotting in a chart.
    * @sb-param {Array} referenceCumTimes - 'Reference' cumulative time data, such
    *            as that of the winner, or the fastest time.
    * @sb-param {Array} currentIndexes - Array of indexes that indicate which
    *           competitors from the overall list are plotted.
    * @sb-param {Object} chartType - The type of chart to draw.
    * @sb-returns {Object} Array of data.
    */
    public getChartData(referenceCumTimes, currentIndexes, chartType) {
        if (typeof referenceCumTimes === "undefined") {
            throw new TypeError("referenceCumTimes undefined or missing");
        } else if (typeof currentIndexes === "undefined") {
            throw new TypeError("currentIndexes undefined or missing");
        } else if (typeof chartType === "undefined") {
            throw new TypeError("chartType undefined or missing");
        }

        const competitorData = this.allCompetitors.map( (comp) => {
            return chartType.dataSelector(comp, referenceCumTimes);
        });
        const selectedCompetitorData = currentIndexes.map( (index) => {
            return competitorData[index];
         });

        const xMin = d3.min(referenceCumTimes);
        const xMax = d3.max(referenceCumTimes);
        let yMin;
        let yMax;
        if (currentIndexes.length === 0) {
            // No competitors selected.
            if (this.isEmpty()) {
                // No competitors at all.  Make up some values.
                yMin = 0;
                yMax = 60;
            } else {
                // Set yMin and yMax to the boundary values of the first competitor.
                const firstCompetitorTimes = competitorData[0];
                yMin = d3.min(firstCompetitorTimes);
                yMax = d3.max(firstCompetitorTimes);
            }
        } else {
            yMin = d3.min(selectedCompetitorData.map( (values) => { return d3.min(values); }));
            yMax = d3.max(selectedCompetitorData.map( (values) => { return d3.max(values); }));
        }

        if (yMax === yMin) {
            // yMin and yMax will be used to scale a y-axis, so we'd better
            // make sure that they're not equal.
            yMax = yMin + 1;
        }

        const controlIndexAdjust = (chartType.skipStart) ? 1 : 0;
        const dubiousTimesInfo = currentIndexes.map( (competitorIndex) => {
            const indexPairs = chartType.indexesAroundDubiousTimesFunc(this.allCompetitors[competitorIndex]);
            return indexPairs.filter( (indexPair) => { return indexPair.start >= controlIndexAdjust; })
                .map( (indexPair) => {
                    return {
                        start: indexPair.start - controlIndexAdjust, end: indexPair.end - controlIndexAdjust
                    };
                });
        }, this);

        const cumulativeTimesByControl = d3.transpose(selectedCompetitorData);
        const xData = (chartType.skipStart) ? referenceCumTimes.slice(1) : referenceCumTimes;
        const zippedData = d3.zip(xData, cumulativeTimesByControl);
        const competitorNames = currentIndexes.map( (index) => { return this.allCompetitors[index].name; }, this);
        return {
            dataColumns: zippedData.map( (data) => { return { x: data[0], ys: data[1] }; }),
            competitorNames: competitorNames,
            numControls: this.numControls,
            xExtent: [xMin, xMax],
            yExtent: [yMin, yMax],
            dubiousTimesInfo: dubiousTimesInfo
        };
    };

}
