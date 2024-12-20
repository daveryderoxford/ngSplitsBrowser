import { ascending as d3_ascending } from "d3-array";
import { CourseClass } from "./course-class";
import { InvalidData } from "./exception";
import { sbTime } from "./time";
import { isNaNStrict, isNotNull } from "./util";

export type Genre = "M" | "F";

export interface DubiousTimeInfo {
    start: number;
    end: number;
}

export interface FirstnameSurname {
    firstname: string;
    surname: string;
}

const NUMBER_TYPE = typeof 0;

/**
* Returns the difference of two numbers, or null if either is null.
* @sb-param {?Number} a - One number, or null, to add.
* @sb-param {?Number} b - The other number, or null, to add.
* @sb-return {?Number} null if at least one of a or b is null,
*      otherwise a - b.
*/
function subtractIfNotNull(a: number | null, b: number | null) {
    return (a === null || b === null) ? null : (a - b);
}

/**
* Convert an array of cumulative times into an array of split times.
* If any null cumulative splits are given, the split times to and from that
* control are null also.
*
* The input array should begin with a zero, for the cumulative time to the
* start.
* @sb-param {Array} cumTimes - Array of cumulative split times.
* @sb-return {Array} Corresponding array of split times.
*/
function splitTimesFromCumTimes(cumTimes: Array<number>): Array<number> {
    if (!Array.isArray(cumTimes)) {
        throw new TypeError("Cumulative times must be an array - got " + typeof cumTimes + " instead");
    } else if (cumTimes.length === 0) {
        throw new InvalidData("Array of cumulative times must not be empty");
    } else if (cumTimes[0] !== 0) {
        throw new InvalidData("Array of cumulative times must have zero as its first item");
    } else if (cumTimes.length === 1) {
        throw new InvalidData("Array of cumulative times must contain more than just a single zero");
    }

    const splitTimes = [];
    for (let i = 0; i + 1 < cumTimes.length; i += 1) {
        splitTimes.push(subtractIfNotNull(cumTimes[i + 1], cumTimes[i]));
    }

    return splitTimes;
}

/**
* Object that represents the data for a single competitor.
*
* The first parameter (order) merely stores the order in which the competitor
* appears in the given list of results.  Its sole use is to stabilise sorts of
* competitors, as JavaScript's sort() method is not guaranteed to be a stable
* sort.  However, it is not strictly the finishing order of the competitors,
* as it has been known for them to be given not in the correct order.
*
* The split and cumulative times passed here should be the 'original' times,
* before any attempt is made to repair the data.
*
* It is not recommended to use this constructor directly.  Instead, use one of
* the factory methods fromSplitTimes, fromCumTimes or fromOriginalCumTimes to
* pass in either the split or cumulative times and have the other calculated.
*
*/

export class Competitor {

    firstname: string;
    surname: string;

    isNonCompetitive = false;
    isNonStarter = false;
    isNonFinisher = false;
    isDisqualified = false;
    isOverMaxTime = false;

    courseClass: CourseClass | null = null;
    yearOfBirth: number | null = null;
    gender: Genre | null = null; // "M" or "F" for male or female.
    birthDate: string = '';
    ecardId: string | null = null;
    route: string | null = null;
    nationalID: string | null = null;

    splitTimes: Array<sbTime> | null = null;
    cumTimes: Array<sbTime> | null = null;
    splitRanks: Array<sbTime> | null = null;
    cumRanks: Array<sbTime> | null = null;
    timeLosses: Array<sbTime> | null = null;
    totalTime: sbTime = 0;

    classPosition = 999;
    coursePosition = 999;
    /**
    * Create and return a Competitor object where the competitor's times are given
    * as a list of cumulative times.
    *
    * The first parameter (order) merely stores the order in which the competitor
    * appears in the given list of results.  Its sole use is to stabilise sorts of
    * competitors, as JavaScript's sort() method is not guaranteed to be a stable
    * sort.  However, it is not strictly the finishing order of the competitors,
    * as it has been known for them to be given not in the correct order.
    *
    * This method does not assume that the data given has been 'repaired'.  This
    * function should therefore be used to create a competitor if the data may
    * later need to be repaired.
    *
    * @sb-param {Number} order - The position of the competitor within the list of results.
    * @sb-param {String} name - The name of the competitor.  Either the fullname or firstname/surname
    * @sb-param {String} club - The name of the competitor's club.
    * @sb-param {Number} startTime - The competitor's start time, as seconds past midnight.
    * @sb-param {Array} cumTimes - Array of cumulative split times, as numbers, with nulls for missed controls.
    * @sb-return {Competitor} Created competitor.
    */
    public static fromOriginalCumTimes(order: number,
        name: string | FirstnameSurname,
        club: string,
        startTime: sbTime,
        cumTimes: Array<sbTime>): Competitor {
        const splitTimes = splitTimesFromCumTimes(cumTimes);
        return new Competitor(order, name, club, startTime, splitTimes, cumTimes);
    }

    /**
    * Create and return a Competitor object where the competitor's times are given
    * as a list of cumulative times.
    *
    * The first parameter (order) merely stores the order in which the competitor
    * appears in the given list of results.  Its sole use is to stabilise sorts of
    * competitors, as JavaScript's sort() method is not guaranteed to be a stable
    * sort.  However, it is not strictly the finishing order of the competitors,
    * as it has been known for them to be given not in the correct order.
    *
    * This method assumes that the data given has been repaired, so it is ready
    * to be viewed.
    *
    * @sb-param {Number} order - The position of the competitor within the list of results.
    * @sb-param {String} name - The name of the competitor.  Either the fullname or firstname/surname
    * @sb-param {String} club - The name of the competitor's club.
    * @sb-param {Number} startTime - The competitor's start time, as seconds past midnight.
    * @sb-param {Array} cumTimes - Array of cumulative split times, as numbers, with nulls for missed controls.
    * @sb-return {Competitor} Created competitor.
    */
    public static fromCumTimes(order: number,
        name: string | FirstnameSurname,
        club: string,
        startTime: sbTime,
        cumTimes: Array<sbTime>): Competitor {
        const competitor = Competitor.fromOriginalCumTimes(order, name, club, startTime, cumTimes);
        competitor.splitTimes = competitor.originalSplitTimes;
        competitor.cumTimes = competitor.originalCumTimes;
        return competitor;
    }

    /**
    * Function used with the JavaScript sort method to sort competitors in order
    * by finishing time.  Used as asort function for competitors
    *
    * Competitors that mispunch are sorted to the end of the list.
    *
    * The return value of this method will be:
    * (1) a negative number if competitor a comes before competitor b,
    * (2) a positive number if competitor a comes after competitor a,
    * (3) zero if the order of a and b makes no difference (i.e. they have the
    *     same total time, or both mispunched.)
    *
    * @sb-param {Competitor} a - One competitor to compare.
    * @sb-param {Competitor} b - The other competitor to compare.
    * @sb-returns {Number} Result of comparing two competitors.
    */
    public static compareCompetitors(a: Competitor, b: Competitor): number {
        if (a.isDisqualified !== b.isDisqualified) {
            return (a.isDisqualified) ? 1 : -1;
        } else if (a.totalTime === b.totalTime) {
            return a.order - b.order;
        } else if (a.totalTime === null) {
            return (b.totalTime === null) ? 0 : 1;
        } else {
            return (b.totalTime === null) ? -1 : a.totalTime - b.totalTime;
        }
    }

    protected constructor(public order: number,
        name: string | FirstnameSurname,
        public club: string,
        public startTime: number,
        public originalSplitTimes: Array<sbTime>,
        public originalCumTimes: Array<sbTime>) {

        if (typeof name === "string") {
            // If a single name is provided split the last word as surname and rest as firstname
            name = name.trim();
            const index = name.lastIndexOf(" ");
            if (index === -1) {
                this.firstname = "";
                this.surname = name;
            } else {
                this.firstname = name.slice(0, index).trim();
                this.surname = name.slice(index).trim();
            }
        } else {
            this.firstname = name.firstname.trim();
            this.surname = name.surname.trim();
        }

        // eslint-disable-next-line max-len
        this.totalTime = (originalCumTimes === null || originalCumTimes.indexOf(null) > -1) ? null : originalCumTimes[originalCumTimes.length - 1];
    }

    /** Returns a key to uniquly identify a competitor
     * This is the ecardId if present or class and position concateranted if not
     */
    get key(): string {
        if (this.ecardId) {
            return this.ecardId;
        } else {
            return this.courseClass!.name + '-' + this.order.toString();
        }
    }

    /** Full name of competitor (readonly) */
    get name() {
        return ((this.firstname + " " + this.surname).trim());
    }

    /**
    * Marks this competitor as being non-competitive.
    */
    public setNonCompetitive(): void {
        this.isNonCompetitive = true;
    }

    /**
    * Marks this competitor as not starting.
    */
    setNonStarter(): void {
        this.isNonStarter = true;
    }

    /**
    * Marks this competitor as not finishing.
    */
    public setNonFinisher(): void {
        this.isNonFinisher = true;
    }

    /**
    * Marks this competitor as disqualified, for reasons other than a missing
    * punch.
    */
    public disqualify(): void {
        this.isDisqualified = true;
    }

    /**
    * Marks this competitor as over maximum time.
    */
    public setOverMaxTime(): void {
        this.isOverMaxTime = true;
    }

    /**
    * Sets the name of the class that the competitor belongs to.
    * This is the course-class, not the competitor's age class.
    * @sb-param {String} className - The name of the class.
    */
    public setClass(courseClass: CourseClass) {
        this.courseClass = courseClass;
    }

    /**
    * Sets the competitor's year of birth.
    * @sb-param {Number} yearOfBirth - The competitor's year of birth.
    */
    public setYearOfBirth(yearOfBirth: number) {
        this.yearOfBirth = yearOfBirth;
    }

    /**
    * Sets the competitor's gender.  This should be "M" or "F".
    * @sb-param {String} gender - The competitor's gender, "M" or "F".
    */
    public setGender(gender: Genre) {
        this.gender = gender;
    }

    /**
    * Sets the 'repaired' cumulative times for a competitor.  This also
    * calculates the repaired split times.
    * @sb-param {Array} cumTimes - The 'repaired' cumulative times.
    */
    public setRepairedCumulativeTimes(cumTimes: Array<sbTime>) {
        this.cumTimes = cumTimes;
        this.splitTimes = splitTimesFromCumTimes(cumTimes);
    }

    /**
    * Returns whether this competitor completed the course and did not get
    * disqualified.
    * @sb-return {boolean} True if the competitor completed the course and did not
    *     get disqualified, false if the competitor did not complete the course
    *     or got disqualified.
    */
    public completed(): boolean {
        return this.totalTime !== null && !this.isDisqualified && !this.isOverMaxTime;
    }

    /**
    * Returns whether the competitor has any times recorded at all.
    * @sb-return {boolean} True if the competitor has recorded at least one time,
    *     false if the competitor has recorded no times.
    */
    public hasAnyTimes(): boolean {
        // Trim the leading zero
        return this.originalCumTimes.slice(1).some(isNotNull);
    }

    /**
    * Returns the competitor's split to the given control.  If the control
    * index given is zero (i.e. the start), zero is returned.  If the
    * competitor has no time recorded for that control, null is returned.
    * If the value is missing, because the value read from the file was
    * invalid, NaN is returned.
    *
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {?Number} The split time in seconds for the competitor to the
    *      given control.
    */
    public getSplitTimeTo(controlIndex: number): number | null {
        return (controlIndex === 0) ? 0 : this.splitTimes[controlIndex - 1];
    }

    /**
    * Returns the competitor's 'original' split to the given control.  This is
    * always the value read from the source data file, or derived directly from
    * this data, before any attempt was made to repair the competitor's data.
    *
    * If the control index given is zero (i.e. the start), zero is returned.
    * If the competitor has no time recorded for that control, null is
    * returned.
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {?Number} The split time in seconds for the competitor to the
    *      given control.
    */
    public getOriginalSplitTimeTo(controlIndex: number): number | null {
        return (controlIndex === 0) ? 0 : this.originalSplitTimes[controlIndex - 1];
    }

    /**
    * Returns whether the control with the given index is deemed to have a
    * dubious split time.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-return {boolean} True if the split time to the given control is dubious,
    *     false if not.
    */
    public isSplitTimeDubious(controlIndex: number): boolean {
        return (controlIndex > 0 && this.originalSplitTimes[controlIndex - 1] !== this.splitTimes[controlIndex - 1]);
    }

    /**
    * Returns the competitor's cumulative split to the given control.  If the
    * control index given is zero (i.e. the start), zero is returned.   If the
    * competitor has no cumulative time recorded for that control, null is
    * returned.  If the competitor recorded a time, but the time was deemed to
    * be invalid, NaN will be returned.
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {Number} The cumulative split time in seconds for the competitor
    *      to the given control.
    */
    public getCumulativeTimeTo(controlIndex: number): number {
        return this.cumTimes[controlIndex];
    }

    /**
    * Returns the 'original' cumulative time the competitor took to the given
    * control.  This is always the value read from the source data file, before
    * any attempt was made to repair the competitor's data.
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {Number} The cumulative split time in seconds for the competitor
    *      to the given control.
    */
    public getOriginalCumulativeTimeTo(controlIndex: number): number {
        return this.originalCumTimes[controlIndex];
    }

    /**
    * Returns whether the control with the given index is deemed to have a
    * dubious cumulative time.
    * @sb-param {Number} controlIndex - The index of the control.
    * @sb-return {boolean} True if the cumulative time to the given control is
    *     dubious, false if not.
    */
    public isCumulativeTimeDubious(controlIndex: number): boolean {
        return this.originalCumTimes[controlIndex] !== this.cumTimes[controlIndex];
    }

    /**
    * Returns the rank of the competitor's split to the given control.  If the
    * control index given is zero (i.e. the start), or if the competitor has no
    * time recorded for that control, or the ranks have not been set on this
    * competitor, null is returned.
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {Number} The split time in seconds for the competitor to the
    *      given control.
    */
    public getSplitRankTo(controlIndex: number): number {
        return (this.splitRanks === null || controlIndex === 0) ? null : this.splitRanks[controlIndex - 1];
    }

    /**
    * Returns the rank of the competitor's cumulative split to the given
    * control.  If the control index given is zero (i.e. the start), or if the
    * competitor has no time recorded for that control, or if the ranks have
    * not been set on this competitor, null is returned.
    * @sb-param {Number} controlIndex - Index of the control (0 = start).
    * @sb-return {Number} The split time in seconds for the competitor to the
    *      given control.
    */
    public getCumulativeRankTo(controlIndex: number): number {
        return (this.cumRanks === null || controlIndex === 0) ? null : this.cumRanks[controlIndex - 1];
    }

    /**
    * Returns the time loss of the competitor at the given control, or null if
    * time losses cannot be calculated for the competitor or have not yet been
    * calculated.
    * @sb-param {Number} controlIndex - Index of the control.
    * @sb-return {?Number} Time loss in seconds, or null.
    */
    public getTimeLossAt(controlIndex: number): number | null {
        return (controlIndex === 0 || this.timeLosses === null) ? null : this.timeLosses[controlIndex - 1];
    }

    /**
    * Returns all of the competitor's cumulative time splits.
    * @sb-return {Array} The cumulative split times in seconds for the competitor.
    */
    public getAllCumulativeTimes(): Array<sbTime> {
        return this.cumTimes;
    }

    /**
    * Returns all of the competitor's cumulative time splits.
    * @sb-return {Array} The cumulative split times in seconds for the competitor.
    */
    public getAllOriginalCumulativeTimes(): Array<sbTime> {
        return this.originalCumTimes;
    }

    /**
    * Returns whether this competitor is missing a start time.
    *
    * The competitor is missing its start time if it doesn't have a start time
    * and it also has at least one split.  (A competitor that has no start time
    * and no splits either didn't start the race.)
    *
    * @sb-return {boolean} True if the competitor doesn't have a start time, false
    *     if they do, or if they have no other splits.
    */
    public lacksStartTime(): boolean {
        return this.startTime === null && this.splitTimes.some(isNotNull);
    }

    /**
    * Sets the split and cumulative-split ranks for this competitor.
    * @sb-param {Array} splitRanks - Array of split ranks for this competitor.
    * @sb-param {Array} cumRanks - Array of cumulative-split ranks for this competitor.
    */
    public setSplitAndCumulativeRanks(splitRanks: Array<sbTime>, cumRanks: Array<number>) {
        this.splitRanks = splitRanks;
        this.cumRanks = cumRanks;
    }

    /**
    * Return this competitor's cumulative times after being adjusted by a 'reference' competitor.
    * @sb-param {Array} referenceCumTimes - The reference cumulative-split-time data to adjust by.
    * @sb-return {Array} The array of adjusted data.
    */
    public getCumTimesAdjustedToReference(referenceCumTimes: Array<sbTime>): Array<sbTime> {
        if (referenceCumTimes.length !== this.cumTimes.length) {
            // eslint-disable-next-line max-len
            throw new InvalidData("Cannot adjust competitor times because the numbers of times are different (" + this.cumTimes.length + " and " + referenceCumTimes.length + ")");
        } else if (referenceCumTimes.indexOf(null) > -1) {
            throw new InvalidData("Cannot adjust competitor times because a null value is in the reference data");
        }

        const adjustedTimes = this.cumTimes.map((time, idx) => subtractIfNotNull(time, referenceCumTimes[idx]));
        return adjustedTimes;
    }

        /**
    * Returns the sum of two numbers, or null if either is null.
    * @sb-param {?Number} a - One number, or null, to add.
    * @sb-param {?Number} b - The other number, or null, to add.
    * @sb-return {?Number} null if at least one of a or b is null,
    *      otherwise a + b.
    */
    private _addIfNotNull(a: number | null, b: number | null): number | null {
        return (a === null || b === null) ? null : (a + b);
    }

    /**
    * Returns the cumulative times of this competitor with the start time added on.
    * @sb-param {Array} referenceCumTimes - The reference cumulative-split-time data to adjust by.
    * @sb-return {Array} The array of adjusted data.
    */
    public getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes: Array<sbTime>): Array<sbTime> {
        const adjustedTimes = this.getCumTimesAdjustedToReference(referenceCumTimes);
        const startTime = this.startTime;
        return adjustedTimes.map((adjTime) => this._addIfNotNull(adjTime, startTime));
    }

    /**
    * Returns an array of percentages that this competitor's splits were behind
    * those of a reference competitor.
    * @sb-param {Array} referenceCumTimes - The reference cumulative split times
    * @sb-return {Array} The array of percentages.
    */
    public getSplitPercentsBehindReferenceCumTimes(referenceCumTimes: Array<sbTime>): Array<sbTime> {
        if (referenceCumTimes.length !== this.cumTimes.length) {
            // eslint-disable-next-line max-len
            throw new InvalidData("Cannot determine percentages-behind because the numbers of times are different (" + this.cumTimes.length + " and " + referenceCumTimes.length + ")");
        } else if (referenceCumTimes.indexOf(null) > -1) {
            throw new InvalidData("Cannot determine percentages-behind because a null value is in the reference data");
        }

        const percentsBehind = [0];
        this.splitTimes.forEach((splitTime, index) => {
            if (splitTime === null) {
                percentsBehind.push(null);
            } else {
                const referenceSplit = referenceCumTimes[index + 1] - referenceCumTimes[index];
                if (referenceSplit > 0) {
                    percentsBehind.push(100 * (splitTime - referenceSplit) / referenceSplit);
                } else {
                    percentsBehind.push(null);
                }
            }
        });

        return percentsBehind;
    }

    /**
    * Determines the time losses for this competitor.
    * @sb-param {Array} fastestSplitTimes - Array of fastest split times.
    */
    public determineTimeLosses(fastestSplitTimes: Array<sbTime>): void {
        if (this.completed()) {
            if (fastestSplitTimes.length !== this.splitTimes.length) {
                // eslint-disable-next-line max-len
                throw new InvalidData("Cannot determine time loss of competitor with " + this.splitTimes.length + " split times using " + fastestSplitTimes.length + " fastest splits");
            } else if (fastestSplitTimes.some(isNaNStrict)) {
                throw new InvalidData("Cannot determine time loss of competitor when there is a NaN value in the fastest splits");
            }

            if (fastestSplitTimes.some((split) => split === 0)) {
                // Someone registered a zero split on this course.  In this
                // situation the time losses don't really make sense.
                this.timeLosses = this.splitTimes.map(() => NaN);
            } else if (this.splitTimes.some(isNaNStrict)) {
                // Competitor has some dubious times.  Unfortunately this
                // means we cannot sensibly calculate the time losses.
                this.timeLosses = this.splitTimes.map(() => NaN);
            } else {
                // We use the same algorithm for calculating time loss as the
                // original, with a simplification: we calculate split ratios
                // (split[i] / fastest[i]) rather than time loss rates
                // (split[i] - fastest[i])/fastest[i].  A control's split ratio
                // is its time loss rate plus 1.  Not subtracting one at the start
                // means that we then don't have to add it back on at the end.

                const splitRatios = this.splitTimes.map((splitTime, index) => {
                    return splitTime / fastestSplitTimes[index];
                });

                splitRatios.sort(d3_ascending);

                let medianSplitRatio;
                if (splitRatios.length % 2 === 1) {
                    medianSplitRatio = splitRatios[(splitRatios.length - 1) / 2];
                } else {
                    const midpt = splitRatios.length / 2;
                    medianSplitRatio = (splitRatios[midpt - 1] + splitRatios[midpt]) / 2;
                }

                this.timeLosses = this.splitTimes.map((splitTime, index) => {
                    return Math.round(splitTime - fastestSplitTimes[index] * medianSplitRatio);
                });
            }
        }
    }

    /**
    * Returns whether this competitor 'crosses' another.  Two competitors are
    * considered to have crossed if their chart lines on the Race Graph cross.
    * @sb-param {Competitor} other - The competitor to compare against.
    * @sb-return {Boolean} true if the competitors cross, false if they don't.
    */
    public crosses(other: Competitor): boolean {
        if (other.cumTimes.length !== this.cumTimes.length) {
            throw new InvalidData("Two competitors with different numbers of controls cannot cross");
        }

        // We determine whether two competitors cross by keeping track of
        // whether this competitor is ahead of other at any point, and whether
        // this competitor is behind the other one.  If both, the competitors
        // cross.
        let beforeOther = false;
        let afterOther = false;

        for (let controlIdx = 0; controlIdx < this.cumTimes.length; controlIdx += 1) {
            if (this.cumTimes[controlIdx] !== null && other.cumTimes[controlIdx] !== null) {
                const thisTotalTime = this.startTime + this.cumTimes[controlIdx];
                const otherTotalTime = other.startTime + other.cumTimes[controlIdx];
                if (thisTotalTime < otherTotalTime) {
                    beforeOther = true;
                } else if (thisTotalTime > otherTotalTime) {
                    afterOther = true;
                }
            }
        }

        return beforeOther && afterOther;
    }

    /**
    * Returns an array of objects that record the indexes around which times in
    * the given array are NaN.
    * @sb-param {Array} times - Array of time values.
    * @sb-return {Array} Array of objects that record indexes around dubious times.
    */
    private getIndexesAroundDubiousTimes(times: Array<sbTime>): Array<DubiousTimeInfo> {
        const dubiousTimeInfo = [] as Array<DubiousTimeInfo>;
        let startIndex = 1;
        while (startIndex + 1 < times.length) {
            if (isNaNStrict(times[startIndex])) {
                let endIndex = startIndex;
                while (endIndex + 1 < times.length && isNaNStrict(times[endIndex + 1])) {
                    endIndex += 1;
                }

                if (endIndex + 1 < times.length && times[startIndex - 1] !== null && times[endIndex + 1] !== null) {
                    dubiousTimeInfo.push({ start: startIndex - 1, end: endIndex + 1 });
                }

                startIndex = endIndex + 1;

            } else {
                startIndex += 1;
            }
        }

        return dubiousTimeInfo;
    }

    /**
    * Returns an array of objects that list the controls around those that have
    * dubious cumulative times.
    * @sb-return {Array} Array of objects that detail the start and end indexes
    *     around dubious cumulative times.
    */
    public getControlIndexesAroundDubiousCumulativeTimes(): Array<DubiousTimeInfo> {
        return this.getIndexesAroundDubiousTimes(this.cumTimes);
    }

    /**
    * Returns an array of objects that list the controls around those that have
    * dubious cumulative times.
    * @sb-return {Array} Array of objects that detail the start and end indexes
    *     around dubious cumulative times.
    */
    public getControlIndexesAroundDubiousSplitTimes(): Array<DubiousTimeInfo> {
        return this.getIndexesAroundDubiousTimes([0].concat(this.splitTimes));
    }

}
