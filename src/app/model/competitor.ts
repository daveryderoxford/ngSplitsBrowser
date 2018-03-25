export interface DubiousTimeInfo {
    start: number;
    end: number;
}

export type Gender = 'M' | 'F';

export type sbTime = number;

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
* @constructor
* @param {Number} order - The position of the competitor within the list of
* results.
* @param {String} name - The name of the competitor.
* @param {String} club - The name of the competitor's club.
* @param {String} startTime - The competitor's start time.
* @param {Array} originalSplitTimes - Array of split times, as numbers,
*  with nulls for missed controls.
* @param {Array} originalCumTimes - Array of cumulative split times, as
* numbers, with nulls for missed controls.
*/
declare function Competitor(order: number,
    name: string,
    club: string,
    startTime: string,
    originalSplitTimes: Array<sbTime>,
    originalCumTimes: Array<sbTime>): Competitor;

    /** Stored data interface in compacted format */
    export interface CompetitorData {
        firstname: string;
        surname: string;
        club: string;
        ecard: number;
        natId: number;
        start: number;
        total: number;
        nc: boolean;
        ok: boolean;
        class: string;
        splits: firebase.firestore.Blob;
    }

    export interface Competitor {
    order: number;
    name: string;
    club: string;
    startTime: number;
    isNonCompetitive: boolean;   isNonStarter: boolean;
    isNonFinisher: boolean;
    isDisqualified: boolean;
    isOverMaxTime: boolean;
    className: string;
    yearOfBirth: Date;
    gender: Gender;

    originalSplitTimes: Array<sbTime>;
    originalCumTimes: Array<sbTime>;
    splitTimes: Array<sbTime>;
    cumTimes: Array<sbTime>;
    splitRanks: Array<number>;
    cumRanks: Array<number>;
    timeLosses: Array<sbTime>;

    totalTime: sbTime;

    setNonCompetitive(): boolean;
    setNonStarter(): boolean;
    setNonFinisher(): boolean;
    disqualify(): boolean;
    setOverMaxTime(): boolean;
    setClassName(): string;
    setYearOfBirth(): number;
    setGender(): string;

    completed(): boolean;
    hasAnyTimes(): boolean;

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
      Array of cumulative split times, as numbers, with nulls for missed controls.
    */
    fromOriginalCumTimes(order: number,
        name: string,
        club: string,
        startTime: number,
        cumTimes: Array<number>): Competitor;
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
    * @param {Array} cumTimes - Array of cumulative split times, as numbers, with nulls for missed controls.
    */
    fromCumTimes(order: number,
        name: string,
        club: string,
        startTime: number,
        cumTimes: Array<number>): Competitor;
    /**
    * Sets the 'repaired' cumulative times for a competitor.  This also
    * calculates the repaired split times.
    * @param {Array} cumTimes - The 'repaired' cumulative times.
    */
    setRepairedCumulativeTimes(cumTimes: Array<number>);

    /**
    * Returns the competitor's split to the given control.  If the control
    * index given is zero (i.e. the start), zero is returned.  If the
    * competitor has no time recorded for that control, null is returned.
    * If the value is missing, because the value read from the file was
    * invalid, NaN is returned.
    *
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {?Number} The split time in seconds for the competitor to the
    *  given control.
    */
    getSplitTimeTo(controlIndex: number): number | null;

    /**
    * Returns the competitor's 'original' split to the given control.  This is
    * always the value read from the source data file, or derived directly from
    * this data, before any attempt was made to repair the competitor's data.
    *
    * If the control index given is zero (i.e. the start), zero is returned.
    * If the competitor has no time recorded for that control, null is
    * returned.
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {?Number} The split time in seconds for the competitor to the
    *  given control.
    */
    getOriginalSplitTimeTo(controlIndex: number): number | null;
    /**
    * Returns whether the control with the given index is deemed to have a
    * dubious split time.
    * @param {Number} controlIndex - The index of the control.
    * @return {boolean} True if the split time to the given control is dubious,
    * false if not.
    */
    isSplitTimeDubious(controlIndex: number): boolean;

    /**
    * Returns the competitor's cumulative split to the given control.  If the
    * control index given is zero (i.e. the start), zero is returned.   If the
    * competitor has no cumulative time recorded for that control, null is
    * returned.  If the competitor recorded a time, but the time was deemed to
    * be invalid, NaN will be returned.
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {Number} The cumulative split time in seconds for the competitor
    *  to the given control.
    */
    getCumulativeTimeTo(controlIndex: number): number;

    /**
    * Returns the 'original' cumulative time the competitor took to the given
    * control.  This is always the value read from the source data file, before
    * any attempt was made to repair the competitor's data.
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {Number} The cumulative split time in seconds for the competitor
    *  to the given control.
    */
    getOriginalCumulativeTimeTo(controlIndex: number): number;

    /**
    * Returns whether the control with the given index is deemed to have a
    * dubious cumulative time.
    * @param {Number} controlIndex - The index of the control.
    * @return {boolean} True if the cumulative time to the given control is
    * dubious, false if not.
    */

    isCumulativeTimeDubious(controlIndex: number): boolean;
    /**
    * Returns the rank of the competitor's split to the given control.  If the
    * control index given is zero (i.e. the start), or if the competitor has no
    * time recorded for that control, or the ranks have not been set on this
    * competitor, null is returned.
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {Number} The split time in seconds for the competitor to the
    *  given control.
    */
    getSplitRankTo(controlIndex: number): number;

    /**
    * Returns the rank of the competitor's cumulative split to the given
    * control.  If the control index given is zero (i.e. the start), or if the
    * competitor has no time recorded for that control, or if the ranks have
    * not been set on this competitor, null is returned.
    * @param {Number} controlIndex - Index of the control (0 = start).
    * @return {Number} The split time in seconds for the competitor to the
    *  given control.
    */
    getCumulativeRankTo(controlIndex: number): number;

    /**
    * Returns the time loss of the competitor at the given control, or null if
    * time losses cannot be calculated for the competitor or have not yet been
    * calculated.
    * @param {Number} controlIndex - Index of the control.
    * @return {?Number} Time loss in seconds, or null.
    */
    getTimeLossAt(controlIndex: number): number | null;

    /**
    * Returns all of the competitor's cumulative time splits.
    * @return {Array} The cumulative split times in seconds for the competitor.
    */
    getAllCumulativeTimes(): Array<sbTime>;

    /**
    * Returns all of the competitor's cumulative time splits.
    * @return {Array} The cumulative split times in seconds for the competitor.
    */
    getAllOriginalCumulativeTimes(): Array<sbTime>;

    /**
    * Returns whether this competitor is missing a start time.
    *
    * The competitor is missing its start time if it doesn't have a start time
    * and it also has at least one split.  (A competitor that has no start time
    * and no splits either didn't start the race.)
    *
    * @return {boolean} True if the competitor doesn't have a start time, false
    * if they do, or if they have no other splits.
    */
    lacksStartTime(): boolean;

    /**
    * Sets the split and cumulative-split ranks for this competitor.
    * @param {Array} splitRanks - Array of split ranks for this competitor.
    * @param {Array} cumRanks - Array of cumulative-split ranks for this competitor.
    */
    setSplitAndCumulativeRanks(splitRanks: Array<number>, cumRanks: Array<number>);

    /**
    * Return this competitor's cumulative times after being adjusted by a 'reference' competitor.
    * @param {Array} referenceCumTimes - The reference cumulative-split-time data to adjust by.
    * @return {Array} The array of adjusted data.
    */
    getCumTimesAdjustedToReference(referenceCumTimes: Array<sbTime>): Array<sbTime>;

    /**
    * Returns the cumulative times of this competitor with the start time added on.
    * @param {Array} referenceCumTimes - The reference cumulative-split-time data to adjust by.
    * @return {Array} The array of adjusted data.
    */
    getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes: Array<sbTime>): Array<sbTime>;

    /**
    * Returns an array of percentages that this competitor's splits were behind
    * those of a reference competitor.
    * @param {Array} referenceCumTimes - The reference cumulative split times
    * @return {Array} The array of percentages.
    */
    getSplitPercentsBehindReferenceCumTimes(referenceCumTimes: Array<sbTime>): Array<number>;

    /**
    * Determines the time losses for this competitor.
    * @param {Array} fastestSplitTimes - Array of fastest split times.
    * @return {Array} The array of time losses.
    */
    determineTimeLosses(fastestSplitTimes: Array<sbTime>): Array<sbTime>;

    /**
    * Returns whether this competitor 'crosses' another.  Two competitors are
    * considered to have crossed if their chart lines on the Race Graph cross.
    * @param {Competitor} other - The competitor to compare against.
    * @return {Boolean} true if the competitors cross, false if they don't.
    */
    crosses(other: Competitor): boolean;

    /**
    * Returns an array of objects that record the indexes around which times in
    * the given array are NaN.
    * @param {Array} times - Array of time values.
    * @return {Array} Array of objects that record indexes around dubious times.
    */
    getIndexesAroundDubiousTimes(times: Array<sbTime>): Array<DubiousTimeInfo>;

    /**
    * Returns an array of objects that list the controls around those that have
    * dubious cumulative times.
    * @return {Array} Array of objects that detail the start and end indexes
    * around dubious cumulative times.
    */
    getControlIndexesAroundDubiousCumulativeTimes(): Array<DubiousTimeInfo>;

    /**
    * Returns an array of objects that list the controls around those that have
    * dubious cumulative times.
    * @return {Array} Array of objects that detail the start and end indexes
    * around dubious cumulative times.
    */
    getControlIndexesAroundDubiousSplitTimes(): Array<any>;
}

