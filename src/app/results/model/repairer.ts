import { Competitor } from "./competitor";
import { CourseClass } from "./course-class";
import { InvalidData } from "./exception";
import { Results } from "./results";
import { sbTime } from "./time";
import { isNotNullNorNaN } from "./util";

interface FirstNonAssendingIndices {
    first: number;
    second: number;
}

// Maximum number of minutes added to finish splits to ensure that all
// competitors have sensible finish splits.
const MAX_FINISH_SPLIT_MINS_ADDED = 5;

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

export class Repairer {

    madeAnyChanges = false;

    /**
    * Attempt to carry out repairs to the data in an event.
    * @sb-param {Results} eventData - The event data to repair.
    */
    static repairEventData(resultsData: Results): void {
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
    static transferCompetitorData(resultsData: Results): void {
        for ( const courseClass of resultsData.classes ) {
            for (const competitor of courseClass.competitors ) {
                competitor.setRepairedCumulativeTimes(competitor.getAllOriginalCumulativeTimes());
            }
        }
    }

    /**
     * Construct a Repairer, for repairing some data.
     * @constructor
    */
    private constructor() { }

    /**
     * Remove, by setting to NaN, any cumulative time that is equal to the
     * previous cumulative time.
     * @sb-param {Array} cumTimes - Array of cumulative times.
     */
    private removeCumulativeTimesEqualToPrevious(cumTimes: Array<number>) {
        let lastCumTime = cumTimes[0];
        for (let index = 1; index + 1 < cumTimes.length; index += 1) {
            if (cumTimes[index] !== null && cumTimes[index] === lastCumTime) {
                cumTimes[index] = NaN;
                this.madeAnyChanges = true;
            } else {
                lastCumTime = cumTimes[index];
            }
        }
    }

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
    private removeCumulativeTimesCausingNegativeSplits(cumTimes: Array<sbTime>): Array<sbTime> {

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
    }

    /**
    * Removes the finish cumulative time from a competitor if it is absurd.
    *
    * It is absurd if it is less than the time at the previous control by at
    * least the maximum amount of time that can be added to finish splits.
    *
    * @sb-param {Array} cumTimes - The cumulative times to perhaps remove the
    *     finish split from.
    */
    private removeFinishTimeIfAbsurd(cumTimes: Array<sbTime>): void {
        const finishTime = cumTimes[cumTimes.length - 1];
        const lastControlTime = cumTimes[cumTimes.length - 2];
        if (isNotNullNorNaN(finishTime) &&
            isNotNullNorNaN(lastControlTime) &&
            finishTime <= lastControlTime - MAX_FINISH_SPLIT_MINS_ADDED * 60) {
            cumTimes[cumTimes.length - 1] = NaN;
            this.madeAnyChanges = true;
        }
    }

    /**
    * Attempts to repair the cumulative times for a competitor.  The repaired
    * cumulative times are written back into the competitor.
    *
    * @sb-param {Competitor} competitor - Competitor whose cumulative times we
    *     wish to repair.
    */
    private repairCompetitor(competitor: Competitor): void {
        let cumTimes = competitor.originalCumTimes.slice(0);

        this.removeCumulativeTimesEqualToPrevious(cumTimes);

        cumTimes = this.removeCumulativeTimesCausingNegativeSplits(cumTimes);

        if (!competitor.completed()) {
            this.removeFinishTimeIfAbsurd(cumTimes);
        }

        competitor.setRepairedCumulativeTimes(cumTimes);
    }

    /**
    * Attempt to repair all of the data within a course-class.
    * @sb-param {CourseClass} courseClass - The class whose data we wish to
    *     repair.
    */
    private repairCourseClass(courseClass: CourseClass): void {
        this.madeAnyChanges = false;

        for (const competitor of courseClass.competitors) {
            this.repairCompetitor(competitor);
        }

        if (this.madeAnyChanges) {
            courseClass.recordHasDubiousData();
        }
    }

    /**
    * Attempt to carry out repairs to the data in an event.
    * @sb-param {Results} eventData - The event data to repair.
    */
    private repairEventData(resultsData: Results): void {

        for (const courseClass of resultsData.classes) {
            this.repairCourseClass(courseClass);
        }
    }
}


