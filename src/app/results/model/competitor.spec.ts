/*
 *  SplitsBrowser - Competitor tests.
 *
 *  Copyright (C) 2000-2013 Dave Ryder, Reinhard Balling, Andris Strazdins,
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

import { sbTime } from "./time";
import {} from "jasmine";
import { Competitor } from "./competitor";
import { isNaNStrict } from "./util";
import 'jasmine-expect';

const fromCumTimes = Competitor.fromCumTimes;
const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;
const compareCompetitors = Competitor.compareCompetitors;

function signum(n) {
    return (n < 0) ? -1 : ((n > 0) ? 1 : 0);
}

describe("Competitor", () => {

    function assertSplitTimes(competitor: Competitor, expectedSplitTimes: Array<sbTime>) {
        expectedSplitTimes.forEach((splitTime, controlIdx) => {
            expect(competitor.getSplitTimeTo(controlIdx + 1)).toEqual(splitTime);
        });
    }

    function assertOriginalSplitTimes(competitor, expectedSplitTimes) {
        expectedSplitTimes.forEach((splitTime, controlIdx) => {
            expect(competitor.getOriginalSplitTimeTo(controlIdx + 1)).toEqual(splitTime);
        });
    }

    function assertCumulativeTimes(competitor, expectedCumulativeTimes) {
        expectedCumulativeTimes.forEach((splitTime, controlIdx) => {
            expect(competitor.getCumulativeTimeTo(controlIdx)).toEqual(splitTime);
        });
    }

    function assertOriginalCumulativeTimes(competitor, expectedCumulativeTimes) {
        expectedCumulativeTimes.forEach((splitTime, controlIdx) => {
            expect(competitor.getOriginalCumulativeTimeTo(controlIdx)).toEqual(splitTime);
        });
    }

    it("Cannot create a competitor from an empty array of cumulative times", () => {
        expect(() => {
            fromCumTimes(1, "John Smith", "ABC", 10 * 3600, []);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot create a competitor from an array of cumulative times that does not start with zero", () => {
        expect(() => {
            fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [40, 60, 90]);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot create a competitor from an array of cumulative times containing only a single zero", () => {
        expect(() => {
            fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0]);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can create a competitor from cumulative times and determine split times", () => {
        const cumTimes = [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);
        assertCumulativeTimes(competitor, cumTimes);
        expect(competitor.getAllCumulativeTimes()).toEqual(cumTimes);
        assertSplitTimes(competitor, [65, 221, 184, 100]);
        expect(competitor.completed()).toBe(true, "Competitor should be marked as completing the course");
        expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
        expect(!competitor.isNonStarter).toBe(true, "Competitor should not be a non-starter");
        expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be a non-finisher");
        expect(!competitor.isDisqualified).toBe(true, "Competitor should not be disqualified");
        expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be over max time");
    });

    it("Can create a competitor from cumulative times and determine split times when competitor has missed a control", () => {
        const cumTimes = [0, 65, null, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);
        assertCumulativeTimes(competitor, cumTimes);
        expect(competitor.getAllCumulativeTimes()).toEqual(cumTimes);
        assertSplitTimes(competitor, [65, null, null, 184, 100]);
        expect(!competitor.completed()).toBe(true, "Competitor should be marked as not completing the course");
    });

    it("Can create a competitor from cumulative times and determine split times when competitor has missed multiple consecutive controls", () => {
        const cumTimes = [0, 65, null, null, null, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);
        assertCumulativeTimes(competitor, cumTimes);
        assertSplitTimes(competitor, [65, null, null, null, null, 184, 100]);
        expect(!competitor.completed()).toBe(true, "Competitor should be marked as not completing the course");
    });

    it("Can create a non-competitive competitor from cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setNonCompetitive();
        expect(competitor.isNonCompetitive).toBe(true, "Competitor should not be competitive");
        expect(!competitor.isNonStarter).toBe(true, "Competitor should not be a non-starter");
        expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be a non-finisher");
        expect(!competitor.isDisqualified).toBe(true, "Competitor should not be disqualified");
        expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be over max time");
    });

    it("Can create a non-starting competitor from cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, null, null, null]);
        competitor.setNonStarter();
        expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
        expect(competitor.isNonStarter).toBe(true, "Competitor should be a non-starter");
        expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be a non-finisher");
        expect(!competitor.isDisqualified).toBe(true, "Competitor should not be disqualified");
        expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be over max time");
    });

    it("Can create a non-finishing competitor from cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, null]);
        competitor.setNonFinisher();
        expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
        expect(!competitor.isNonStarter).toBe(true, "Competitor should not be a non-starter");
        expect(competitor.isNonFinisher).toBe(true, "Competitor should be a non-finisher");
        expect(!competitor.isDisqualified).toBe(true, "Competitor should not be disqualified");
        expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be over max time");
    });

    it("Can create a disqualified competitor from cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.disqualify();
        expect(!competitor.completed()).toBe(true, "Disqualified competitor should not be marked as completing the course");
        expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
        expect(!competitor.isNonStarter).toBe(true, "Competitor should not be a non-starter");
        expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be a non-finisher");
        expect(competitor.isDisqualified).toBe(true, "Competitor should be disqualified");
        expect(!competitor.isOverMaxTime).toBe(true, "Competitor should not be over max time");
    });

    it("Can create an over-max-time competitor from cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setOverMaxTime();
        expect(!competitor.completed()).toBe(true, "Over-max-time competitor should not be marked as completing the course");
        expect(!competitor.isNonCompetitive).toBe(true, "Competitor should not be marked as non-competitive");
        expect(!competitor.isNonStarter).toBe(true, "Competitor should not be a non-starter");
        expect(!competitor.isNonFinisher).toBe(true, "Competitor should not be a non-finisher");
        expect(!competitor.isDisqualified).toBe(true, "Competitor should not be disqualified");
        expect(competitor.isOverMaxTime).toBe(true, "Competitor should be over max time");
    });

    it("Can create a competitor with gender and year of birth and read them back", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setYearOfBirth(1984);
        competitor.setGender("M");
        expect(competitor.yearOfBirth).toEqual(1984);
        expect(competitor.gender).toEqual("M");
    });

    it("Can create a competitor from original cumulative times and determine original split times with final times still null", () => {
        const cumTimes = [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
        const competitor = fromOriginalCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);
        assertOriginalCumulativeTimes(competitor, cumTimes);
        assertOriginalSplitTimes(competitor, [65, 221, 184, 100]);
        expect(competitor.cumTimes).toEqual(null);
        expect(competitor.splitTimes).toEqual(null);
        expect(competitor.getAllOriginalCumulativeTimes()).toEqual(cumTimes);
    });

    it("Can create a competitor from original cumulative times and set repaired times with NaNs replacing dubious splits", () => {
        const cumTimes = [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100];
        const competitor = fromOriginalCumTimes(1, "John Smith", "ABC", 10 * 3600, cumTimes);

        competitor.setRepairedCumulativeTimes([0, 65, 65 + 221, NaN, 65 + 221 + 184 + 100]);

        expect(competitor.getCumulativeTimeTo(0)).toEqual(0);
        expect(competitor.getCumulativeTimeTo(1)).toEqual(65);
        expect(competitor.getCumulativeTimeTo(2)).toEqual(65 + 221);
        expect(isNaN(competitor.getCumulativeTimeTo(3))).toBe(true);
        expect(competitor.getCumulativeTimeTo(4)).toEqual(65 + 221 + 184 + 100);

        expect(competitor.getSplitTimeTo(0)).toEqual(0);
        expect(competitor.getSplitTimeTo(1)).toEqual(65);
        expect(competitor.getSplitTimeTo(2)).toEqual(221);
        expect(isNaN(competitor.getSplitTimeTo(3))).toBe(true);
        expect(isNaN(competitor.getSplitTimeTo(4))).toBe(true);
    });

    it("Competitor created from ascending cumulative times has no dubious cumulative nor split times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        for (let control = 0; control < 5; control += 1) {
            expect(!competitor.isCumulativeTimeDubious(control)).toBe(true);
            expect(!competitor.isSplitTimeDubious(control)).toBe(true);
        }
    });

    it("Competitor created with dubious cumulative time has one dubious cumulative time and two dubious split times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 0, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setRepairedCumulativeTimes([0, 65, NaN, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        for (let control = 0; control < 5; control += 1) {
            expect(competitor.isCumulativeTimeDubious(control)).toEqual((control === 2));
            expect(competitor.isSplitTimeDubious(control)).toEqual((control === 2 || control === 3));
        }
    });

    it("Competitor with start time but all-null splits is not lacking a start time", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, null, null, null]);
        expect(!competitor.lacksStartTime()).toBe(true);
    });

    it("Competitor with start time and splits is not lacking a start time", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        expect(!competitor.lacksStartTime()).toBe(true);
    });

    it("Competitor with no start time nor any splits is not lacking a start time", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", null, [0, null, null, null, null]);
        expect(!competitor.lacksStartTime()).toBe(true);
    });

    it("Competitor with no start time but all splits is lacking a start time", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", null, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        expect(competitor.lacksStartTime()).toBe(true);
    });

    it("Competitor with no start time but some splits is lacking a start time", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", null, [0, 65, null, null, 65 + 221 + 184 + 100]);
        expect(competitor.lacksStartTime()).toBe(true);
    });

    it("Can determine total time of a competitor that punches all controls", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        expect(competitor.totalTime).toEqual(65 + 221 + 184 + 100, "Wrong total time");
    });

    it("Determines total time of a competitor that mispunches as null", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        expect(competitor.totalTime).toEqual(null, "Total time should be null");
    });

    it("Competitor with valid time compares equal to itself", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        expect(compareCompetitors(competitor, competitor)).toEqual(0);
    });

    it("Competitor with lower total time comes before competitor with higher total time", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Competitor with higher total time comes before competitor with higher total time", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 188]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 154]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Competitor with lower order comes before competitor with same total time but higher order", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 188]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Competitor with higher order comes after competitor with same total time but lower order", () => {
        const competitor1 = fromCumTimes(3, "John Smith", "ABC", 10 * 3600, [0, 188]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Mispunching competitor compares equal to itself", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null]);
        expect(compareCompetitors(competitor, competitor)).toEqual(0);
    });

    it("Competitor with valid time comes before mispunching competitor", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, null]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Mispunching competitor comes after competitor with valid time", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Mispunching competitor with lower order comes before mispunching competitor with higher order", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, null]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Mispunching competitor with higher order comes before mispunching competitor with lower order", () => {
        const competitor1 = fromCumTimes(3, "John Smith", "ABC", 10 * 3600, [0, null]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, null]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Disqualified competitor compares equal to itself", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        competitor.disqualify();
        expect(compareCompetitors(competitor, competitor)).toEqual(0);
    });

    it("Valid competitor comes before disqualified competitor", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        competitor2.disqualify();
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Disqualified competitor comes after valid competitor", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        competitor1.disqualify();
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Disqualified competitor with lower order comes before disqualified competitor with higher order", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 154]);
        competitor1.disqualify();
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 188]);
        competitor2.disqualify();
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(-1);
    });

    it("Disqualified competitor with higher order comes before disqualified competitor with lower order", () => {
        const competitor1 = fromCumTimes(3, "John Smith", "ABC", 10 * 3600, [0, 188]);
        competitor1.disqualify();
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 154]);
        competitor2.disqualify();
        expect(signum(compareCompetitors(competitor1, competitor2))).toEqual(1);
    });

    it("Competitor with no times missing has times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        expect(competitor.hasAnyTimes()).toBe(true, "Competitor with no times missing should have times");
    });

    it("Competitor with some but not all times missing has times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, null, null, 65 + 221 + 184 + 100]);
        expect(competitor.hasAnyTimes()).toBe(true, "Competitor with some but not all times missing should have times");
    });

    it("Competitor with all times missing does not have times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, null, null, null]);
        expect(!competitor.hasAnyTimes()).toBe(true, "Competitor with all times missing should not have times");
    });

    it("Can adjust a competitor's cumulative times by reference data with all valid times and same number of controls", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedCumTimes = [0, 4, 4 + 28, 4 + 28 + 8, 4 + 28 + 8 - 3];
        expect(competitor.getCumTimesAdjustedToReference(referenceCumTimes)).toEqual(expectedCumTimes);
    });

    it("Can adjust a competitor's cumulative times with a missing time by reference data with all valid times and same number of controls", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedCumTimes = [0, 4, 4 + 28, null, 4 + 28 + 8 - 3];
        expect(competitor.getCumTimesAdjustedToReference(referenceCumTimes)).toEqual(expectedCumTimes);
    });

    it("Cannot adjust a competitor's cumulative times by reference data with a different number of times", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176];

        expect(() => {
            competitor.getCumTimesAdjustedToReference(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot adjust a competitor's cumulative times by reference data with a null value", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, null, 61 + 193 + 176 + 103];

        expect(() => {
            competitor.getCumTimesAdjustedToReference(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can adjust a competitor's cumulative times by reference data and add start time with all valid times and same number of controls", () => {
        const startTime = 10 * 3600 + 41 * 60;
        const competitor = fromCumTimes(1, "John Smith", "ABC", startTime, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedCumTimes = [startTime, startTime + 4, startTime + 4 + 28, startTime + 4 + 28 + 8, startTime + 4 + 28 + 8 - 3];
        expect(competitor.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes)).toEqual(expectedCumTimes);
    });

    it("Can adjust a competitor's cumulative times with a missing time by reference data and add start time with all valid times and same number of controls", () => {
        const startTime = 10 * 3600 + 41 * 60;
        const competitor = fromCumTimes(1, "John Smith", "ABC", startTime, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedCumTimes = [startTime, startTime + 4, startTime + 4 + 28, null, startTime + 4 + 28 + 8 - 3];
        expect(competitor.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes)).toEqual(expectedCumTimes);
    });

    it("Cannot adjust a competitor's cumulative times by reference data and add start time with a different number of times", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600 + 41 * 60, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176];

        expect(() => {
            competitor.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot adjust a competitor's cumulative times by reference data and add start time if reference data contains a null value", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600 + 41 * 60, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, null, 61 + 193 + 176 + 103];

        expect(() => {
            competitor.getCumTimesAdjustedToReferenceWithStartAdded(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can determine the percentages a competitor is behind reference data with all valid times and same number of controls", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedPercentagesBehind = [0, 100 * (65 - 61) / 61, 100 * (221 - 193) / 193, 100 * (184 - 176) / 176, 100 * (100 - 103) / 103];
        expect(competitor.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes)).toEqual(expectedPercentagesBehind);
    });

    it("Can determine the percentages a competitor with a missing time is behind reference data with all valid times and same number of controls", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176, 61 + 193 + 176 + 103];
        const expectedPercentagesBehind = [0, 100 * (65 - 61) / 61, 100 * (221 - 193) / 193, null, null];
        expect(competitor.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes)).toEqual(expectedPercentagesBehind);
    });

    it("Cannot determine the percentages a competitor is behind reference data with a different number of times", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193 + 176];

        expect(() => {
            competitor.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot determine the percentages a competitor is behind reference data with a null value", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, null, 61 + 193 + 176 + 103];

        expect(() => {
            competitor.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can determine the percentages a competitor is behind reference data, with a null percentage for a zero split", () => {

        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        const referenceCumTimes = [0, 61, 61 + 193, 61 + 193, 61 + 193 + 176 + 103];
        const expectedPercentagesBehind = [0, 100 * (65 - 61) / 61, 100 * (221 - 193) / 193, null, 100 * (100 - 176 - 103) / (103 + 176)];
        expect(competitor.getSplitPercentsBehindReferenceCumTimes(referenceCumTimes)).toEqual(expectedPercentagesBehind);
    });

    it("Can determine time losses of competitor with even number of splits", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        const fastestSplits = [65, 209, 184, 97];
        competitor.determineTimeLosses(fastestSplits);
        expect(competitor.getTimeLossAt(0)).toEqual(null);

        // Split ratios are 1.4769, 1.05742, 1, 1.03093
        // median is 1.04417
        // expected times are therefore 67.8711, 218.232, 192.1277, 101.2847
        // time losses are then  28.1288, 2.7680, -8.1277, -1.2847

        expect(competitor.getTimeLossAt(1)).toEqual(28);
        expect(competitor.getTimeLossAt(2)).toEqual(3);
        expect(competitor.getTimeLossAt(3)).toEqual(-8);
        expect(competitor.getTimeLossAt(4)).toEqual(-1);
    });

    it("Can determine time losses of competitor with odd number of splits", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 100]);
        const fastestSplits = [65, 209, 97];
        competitor.determineTimeLosses(fastestSplits);
        expect(competitor.getTimeLossAt(0)).toEqual(null);

        // Split ratios are 1.4769, 1.05742, 1.03093
        // median is 1.05742
        // expected times are therefore 68.7321, 211, 192.1277, 102.5694
        // time losses are then 27.2679, 0, -2.5694

        expect(competitor.getTimeLossAt(1)).toEqual(27);
        expect(Math.abs(competitor.getTimeLossAt(2))).toBeLessThan(0.001);
        expect(competitor.getTimeLossAt(3)).toEqual(-3);
    });

    it("Cannot determine time losses of competitor when given wrong number of reference splits", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        expect(() => {
            competitor.determineTimeLosses([65, 209, 97]);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Cannot determine time losses of competitor when given split times with NaN value", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        expect(() => {
            competitor.determineTimeLosses([65, 209, NaN, 97]);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can determine time losses as all NaN if competitor has NaN repaired split", () => {
        const competitor = fromOriginalCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        competitor.setRepairedCumulativeTimes([0, 96, 96 + 221, NaN, 96 + 221 + 184 + 100]);
        const fastestSplits = [65, 209, 184, 97];
        competitor.determineTimeLosses(fastestSplits);

        for (let control = 1; control < 5; control += 1) {
            const timeLoss = competitor.getTimeLossAt(control);
            expect(isNaNStrict(timeLoss)).toBe(true, "Time loss at control " + control + " should be NaN, but got " + timeLoss);
        }
    });

    it("Can determine time losses as all NaN if fastest splits include zero", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        const fastestSplits = [65, 209, 0, 97];
        competitor.determineTimeLosses(fastestSplits);

        for (let control = 1; control < 5; control += 1) {
            const timeLoss = competitor.getTimeLossAt(control);
            expect(isNaNStrict(timeLoss)).toBe(true, "Time loss at control " + control + " should be NaN, but got " + timeLoss);
        }
    });

    it("Can determine as all-NaN time losses of competitor when given fastest-split times with null value", () => {
        const competitor = fromOriginalCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, 96 + 221 + 184, 96 + 221 + 184 + 100]);
        competitor.setRepairedCumulativeTimes([0, 96, 96 + 221, NaN, 96 + 221 + 184 + 100]);
        competitor.determineTimeLosses([65, 209, null, 97]);

        for (let control = 1; control <= 4; control += 1) {
            const timeLoss = competitor.getTimeLossAt(control);
            expect(isNaNStrict(timeLoss)).toBe(true, "Time loss at control " + control + " should be NaN, but got " + timeLoss);
        }
    });

    it("Can determine time losses as all null if competitor mispunches", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, null, 96 + 221 + 184 + 100]);
        competitor.determineTimeLosses([65, 209, 184, 97]);
        for (let controlIdx = 0; controlIdx <= 4; controlIdx += 1) {
            expect(competitor.getTimeLossAt(controlIdx)).toEqual(null);
        }
    });

    it("Can determine time losses as all null if competitor mispunches even if fastest times also have null in them", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 96, 96 + 221, null, 96 + 221 + 184 + 100]);
        competitor.determineTimeLosses([65, 209, null, 97]);
        for (let controlIdx = 0; controlIdx <= 4; controlIdx += 1) {
            expect(competitor.getTimeLossAt(controlIdx)).toEqual(null);
        }
    });

    it("Cannot determine that a competitor crosses another one with a different number of controls", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 12 * 3600, [0, 71, 218, 379, 440, 491]);

        expect(() => {
            competitor1.crosses(competitor2);
        }).toThrowErrorOfType("InvalidData");
    });

    it("Can determine that a competitor does not cross themselves", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        expect(!competitor.crosses(competitor)).toBe(true, "Competitor should not cross themselves");
    });

    it("Can determine that a competitor does not cross a competitor with identical splits starting an hour later", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 11 * 3600, [0, 65, 221, 384, 421]);
        expect(!competitor1.crosses(competitor2)).toBe(true, "Competitors should not cross");
    });

    it("Can determine that a competitor does not cross a competitor with identical splits starting an hour earlier", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 9 * 3600, [0, 65, 221, 384, 421]);
        expect(!competitor1.crosses(competitor2)).toBe(true, "Competitors should not cross");
    });

    it("Can determine that two competitors cross on the way to control 1", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 10 * 3600 - 60, [0, 265, 421, 584, 621]);
        expect(competitor1.crosses(competitor2)).toBe(true, "Competitors should cross");
    });

    it("Can determine that two competitors cross between controls 2 and 3", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 421]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 10 * 3600 - 60, [0, 65, 221, 584, 621]);
        expect(competitor1.crosses(competitor2)).toBe(true, "Competitors should cross");
    });

    it("Can determine that two competitors cross between controls 1 and 2 and cross back later", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 721]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 10 * 3600 - 60, [0, 65, 421, 584, 621]);
        expect(competitor1.crosses(competitor2)).toBe(true, "Competitors should cross");
    });

    it("Can determine that two competitors do not cross between because the first one has a null split", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, null, 384, 521]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 10 * 3600 - 60, [0, 65, 221, 384, 521]);
        expect(!competitor1.crosses(competitor2)).toBe(true, "Competitors should not cross");
    });

    it("Can determine that two competitors do not cross between because the second one has a null split", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        const competitor2 = fromCumTimes(2, "Fred Baker", "DEF", 10 * 3600 - 60, [0, 65, 221, null, 521]);
        expect(!competitor1.crosses(competitor2)).toBe(true, "Competitors should not cross");
    });

    it("Returns null value for cumulative rank when no ranks set", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        expect(competitor1.getCumulativeRankTo(2)).toEqual(null, "A null cumulative rank should be returned");
    });

    it("Returns non-null value for cumulative rank when ranks set", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        competitor1.setSplitAndCumulativeRanks([1, 1, 1, 1], [2, 2, 2, 2]);
        expect(competitor1.getCumulativeRankTo(2)).toEqual(2, "A non-null cumulative rank should be returned");
    });

    it("Returns null value for cumulative rank at start control", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        competitor1.setSplitAndCumulativeRanks([1, 1, 1, 1], [2, 2, 2, 2]);
        expect(competitor1.getCumulativeRankTo(0)).toEqual(null, "A null cumulative rank should be returned for the start");
    });

    it("Returns null value for split rank when no ranks set", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        expect(competitor1.getSplitRankTo(2)).toEqual(null, "A null split rank should be returned");
    });

    it("Returns non-null value for split rank when ranks set", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        competitor1.setSplitAndCumulativeRanks([1, 1, 1, 1], [2, 2, 2, 2]);
        expect(competitor1.getSplitRankTo(2)).toEqual(1, "A non-null split rank should be returned");
    });

    it("Returns null value for split rank at start control", () => {
        const competitor1 = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        competitor1.setSplitAndCumulativeRanks([1, 1, 1, 1], [2, 2, 2, 2]);
        expect(competitor1.getSplitRankTo(0)).toEqual(null, "A null split rank should be returned for the start");
    });

    it("Competitor with no dubious times has no indexes around dubious cumulative times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end has indexes around it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, 384, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 1, end: 3 }]);
    });

    it("Competitor with consecutive pair of dubious cumulative times not at the end has indexes around it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, NaN, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 1, end: 4 }]);
    });

    it("Competitor with two non-consecutive dubious cumulative times not at the end has separate indexes around them", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, NaN, 221, NaN, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 0, end: 2 }, { start: 2, end: 4 }]);
    });

    it("Competitor with dubious cumulative time at at the end has no index for it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, NaN]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([]);
    });

    it("Competitor with two non-consecutive dubious cumulative times, one at the end has only an index for the one not at the end", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, NaN, 221, 384, NaN]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 0, end: 2 }]);
    });

    it("Competitor with single dubious cumulative time followed by a null has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, null, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time preceded by a null has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, NaN, 384, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time with a null time two controls before has a pair of indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, 221, NaN, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 2, end: 4 }]);
    });

    it("Competitor with single dubious cumulative time with a null time two controls after has a pair of indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, NaN, 221, null, 521]);
        expect(competitor.getControlIndexesAroundDubiousCumulativeTimes()).toEqual([{ start: 0, end: 2 }]);
    });

    it("Competitor with no dubious times has no indexes around dubious split times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end has indexes around the two split times it makes dubious", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, 384, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 1, end: 4 }]);
    });

    it("Competitor with consecutive pair of dubious cumulative times not at the end has indexes around it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, NaN, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 1, end: 5 }]);
    });

    it("Competitor with two non dubious cumulative times with one non-dubious value between them has one pair of indexes around them", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, NaN, 221, NaN, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 0, end: 5 }]);
    });

    it("Competitor with two non dubious cumulative times with two non-dubious values between them has two pair of indexes, one around each pair of dubious split times", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, NaN, 221, 384, NaN, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 0, end: 3 }, { start: 3, end: 6 }]);
    });

    it("Competitor with dubious final cumulative time only has no indexes around it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521, 588, NaN]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with dubious penultimate cumulative time only has no indexes around it", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 221, 384, 521, NaN, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end with null immediately before the dubious split has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, null, NaN, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end with null immediately after the dubious split has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, null, 521, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end with null two controls before the dubious split has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, null, 384, NaN, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end with null two controls after the dubious split has no indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, 384, null, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([]);
    });

    it("Competitor with single dubious cumulative time not at the end with null three controls after the dubious split has a pair of indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, null, 221, 384, NaN, 588, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 3, end: 6 }]);
    });

    it("Competitor with single dubious cumulative time not at the end with null three controls after the dubious split has a pair of indexes", () => {
        const competitor = fromCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, NaN, 384, 512, null, 655]);
        expect(competitor.getControlIndexesAroundDubiousSplitTimes()).toEqual([{ start: 1, end: 4 }]);
    });
    it("Can set competitor full name with three names. `The surname equal to the last name", () => {
        const competitor = fromCumTimes(1, "John A Smith", "ABC", 10 * 3600, [0, 188]);
        expect(competitor.name).toEqual("John A Smith");
        expect(competitor.firstname).toEqual("John A");
        expect(competitor.surname).toEqual("Smith");
    });
    it("Can set competitor full name with single name", () => {
        const competitor = fromCumTimes(1, "John,Smith", "ABC", 10 * 3600, [0, 188]);
        expect(competitor.name).toEqual("John,Smith", "Fullname chack");
        expect(competitor.firstname).toEqual("", "Firstname check");
        expect(competitor.surname).toEqual("John,Smith", "Surname check");
    });
    it("Can set competitor firstname, surname", () => {
        const competitor = fromCumTimes(1, { firstname: "John", surname: "Smith" }, "ABC", 10 * 3600, [0, 188]);
        expect(competitor.name).toEqual("John Smith");
        expect(competitor.firstname).toEqual("John");
        expect(competitor.surname).toEqual("Smith");
    });
    it("Can set competitor full name with multiple spaces", () => {
        const competitor = fromCumTimes(1, "John   Smith", "ABC", 10 * 3600, [0, 188]);
        expect(competitor.name).toEqual("John Smith");
        expect(competitor.firstname).toEqual("John");
        expect(competitor.surname).toEqual("Smith");
    });
    it("Can set competitor ecard to a number", () => {
        const competitor = fromCumTimes(1, { firstname: "John", surname: "Smith" }, "ABC", 10 * 3600, [0, 188]);
        competitor.ecardId = "1234567";
        expect(competitor.ecardId).toEqual("1234567");
    });
});

