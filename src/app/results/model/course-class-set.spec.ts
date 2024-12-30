
/*
 *  SplitsBrowser - CourseClassSet tests.
 *
 *  Copyright (C) 2000-2015 Dave Ryder, Reinhard Balling, Andris Strazdins,
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
/* eslint-disable max-len */
import { } from 'jasmine';
import 'jasmine-expect';
import { ChartType } from '../graph/splitsbrowser/chart-types';
import { TestSupport } from '../test-support.spec';
import { Competitor } from './competitor';
import { Course } from './course';
import { CourseClass } from './course-class';
import { ChartData, CourseClassSet } from './course-class-set';
import { isNaNStrict } from './results_util';


describe('Course-class set', () => {

    const fromCumTimes = Competitor.fromCumTimes;
    const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;
    const fromSplitTimes = TestSupport.fromSplitTimes;

    const _DUMMY_CHART_TYPE: ChartType = {
        nameKey: 'SplitsGraphYAxisLabel',
        dataSelector: function (comp, referenceCumTimes) { return comp.getCumTimesAdjustedToReference(referenceCumTimes); },
        skipStart: false,
        indexesAroundDubiousTimesFunc: function (comp) { return comp.getControlIndexesAroundDubiousCumulativeTimes(); },

        yAxisLabelKey: 'SplitsGraphYAxisLabel',
        isRaceGraph: false,
        isResultsTable: false,
        minViewableControl: 0
    };

    const DUMMY_CHART_TYPE_SKIP: ChartType = {
        nameKey: 'dummy',
        dataSelector: function (comp, referenceCumTimes) { return comp.getCumTimesAdjustedToReference(referenceCumTimes); },
        skipStart: true,
        indexesAroundDubiousTimesFunc: function (comp) { return comp.getControlIndexesAroundDubiousCumulativeTimes(); },

        yAxisLabelKey: 'SplitsGraphYAxisLabel',
        isRaceGraph: false,
        isResultsTable: false,
        minViewableControl: 0
    };

    function getCompetitor1(): Competitor {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, 221, 209, 100]);
    }

    function getFasterCompetitor1(): Competitor  {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, 221, 184, 100]);
    }

    function getCompetitor1WithNullSplitForControl2(): Competitor  {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, null, 184, 100]);
    }

    function getCompetitor1WithDubiousSplitForControl1(): Competitor  {
        const competitor = fromOriginalCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 0, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setRepairedCumulativeTimes([0, NaN, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        return competitor;
    }

    function getCompetitor1WithDubiousSplitForControl2(): Competitor  {
        const competitor = fromOriginalCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 - 10, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setRepairedCumulativeTimes([0, 65, NaN, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        return competitor;
    }

    function getCompetitor1WithDubiousFinishTime(): Competitor  {
        const competitor = fromOriginalCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184]);
        competitor.setRepairedCumulativeTimes([0, 65, 65 + 221, 65 + 221 + 184, NaN]);
        return competitor;
    }

    function getCompetitor1WithDubiousTimeToLastControlAndFinish(): Competitor  {
        const competitor = fromOriginalCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 + 221, 65 + 221, 65 + 221]);
        competitor.setRepairedCumulativeTimes([0, 65, 65 + 221, NaN, NaN]);
        return competitor;
    }

    function getCompetitor1WithNullSplitForControl3(): Competitor  {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, 221, null, 100]);
    }

    function getCompetitor1WithNullFinishSplit(): Competitor  {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, 221, 184, null]);
    }

    function getCompetitor1WithSameControl2SplitAsThatOfCompetitor2(): Competitor  {
        return fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [65, 197, 209, 100]);
    }

    function getNonStartingCompetitor1(): Competitor  {
        const competitor = fromSplitTimes(1, 'John Smith', 'ABC', 10 * 3600, [null, null, null, null]);
        competitor.setNonStarter();
        return competitor;
    }

    function getCompetitor2(): Competitor  {
        return fromSplitTimes(2, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
    }

    function getCompetitor2WithNullSplitForControl2(): Competitor {
        return fromSplitTimes(1, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [81, null, 212, 106]);
    }

    function getCompetitor2WithNullFinishSplit(): Competitor  {
        return fromSplitTimes(2, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [81, 197, 212, null]);
    }

    function getCompetitor2WithFinishCumTimeNotTheLargest(): Competitor  {
        return fromCumTimes(2, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 - 73]);
    }

    function getCompetitor2WithFirstControlLargerThanAllOthers(): Competitor  {
        return fromCumTimes(2, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [0, 4103, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    }

    function getCompetitor3(): Competitor  {
        return fromSplitTimes(3, 'Bill Baker', 'GHI', 11 * 3600, [78, 209, 199, 117]);
    }

    function getCompetitor3WithSameTotalTimeAsCompetitor1(): Competitor  {
        return fromSplitTimes(3, 'Bill Baker', 'GHI', 11 * 3600, [78, 209, 199, 109]);
    }

    function getCompetitor3WithNullSplitForControl2(): Competitor  {
        return fromSplitTimes(3, 'Bill Baker', 'GHI', 11 * 3600, [78, null, 199, 117]);
    }

    function getCompetitor3WithNullSplitForControl3(): Competitor  {
        return fromSplitTimes(3, 'Bill Baker', 'GHI', 11 * 3600, [78, 209, null, 117]);
    }

    function getCompetitor3WithNullFinishSplit(): Competitor  {
        return fromSplitTimes(3, 'Bill Baker', 'GHI', 11 * 3600, [78, 209, 199, null]);
    }

    it('Can create a CourseClassSet from an empty array of course-classes', () => {
        const emptySet = new CourseClassSet([]);
        expect(emptySet.isEmpty()).toBe(true);
        expect(emptySet.getCourse()).toEqual(null);
        expect(emptySet.getPrimaryClassName()).toEqual(null);
        expect(emptySet.getNumClasses()).toEqual(0);
        expect(emptySet.getFastestCumTimes()).toEqual(null);
    });

    it('Can create a CourseClassSet from a single course-class', () => {
        const courseClass = new CourseClass('Test', 3, [getCompetitor1(), getCompetitor2(), getCompetitor3()]);
        const courseClassSet = new CourseClassSet([courseClass]);
        expect(courseClassSet.allCompetitors).toEqual(courseClass.competitors,  'A CourseClassSet created from one course-class should contain the only the competitors of that class');
    });

    it('Can create a CourseClassSet from a single course-class, ignoring non-starting competitor', () => {
        const courseClass = new CourseClass('Test', 3, [getNonStartingCompetitor1(), getCompetitor2(), getCompetitor3()]);
        const courseClassSet = new CourseClassSet([courseClass]);
        expect(courseClassSet.allCompetitors).toEqual(courseClass.competitors.slice(1),  'A CourseClassSet created from one course-class should contain the only the competitors of that class that started');
    });

    it('Can create a CourseClassSet from a single course-class and get the course', () => {
        const courseClass = new CourseClass('Test', 3, [getCompetitor1()]);
        const course = new Course('Test course', [courseClass], null, null, null);
        courseClass.setCourse(course);
        const courseClassSet = new CourseClassSet([courseClass]);
        expect(courseClassSet.getCourse()).toEqual(course);
    });

    it('Can create a CourseClassSet from a single course-class and get the primary class name as that of the given class', () => {
        const courseClass = new CourseClass('Test', 3, [getCompetitor1()]);
        const courseClassSet = new CourseClassSet([courseClass]);
        expect(courseClassSet.getPrimaryClassName()).toEqual(courseClass.name);
    });

    it('Can create a CourseClassSet from a multiple course-class and get the primary class name as that of the first class', () => {
        const courseClass1 = new CourseClass('Test class 1', 3, [getCompetitor1()]);
        const courseClass2 = new CourseClass('Test class 2', 3, [getCompetitor2()]);
        const courseClassSet = new CourseClassSet([courseClass1, courseClass2]);
        expect(courseClassSet.getPrimaryClassName()).toEqual(courseClass1.name);
    });

    it('Can create a CourseClassSet from a single course-class, sorting competitors into order', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClass = new CourseClass('Test', 3, [competitor3, competitor1, competitor2]);
        const courseClassSet = new CourseClassSet([courseClass]);
        const expectedCompetitors = [competitor1, competitor2, competitor3];
        expect(courseClassSet.allCompetitors).toEqual(expectedCompetitors,  'A CourseClassSet created from one course-class should contain the only the competitors of that class');
    });

    it('Can create a CourseClassSet from two course-classes', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClass1 = new CourseClass('Test', 3, [competitor3, competitor1]);
        const courseClass2 = new CourseClass('Test', 3, [competitor2]);
        const courseClassSet = new CourseClassSet([courseClass1, courseClass2]);
        const expectedCompetitors = [competitor1, competitor2, competitor3];
        expect(courseClassSet.allCompetitors).toEqual(expectedCompetitors,  'Merging one course-class should return the only the competitors of that class');
    });

    it('Cannot create a CourseClassSet from two course-classes with different numbers of controls', () => {
        const competitor2 = fromSplitTimes(1, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [81, 197, 212, 106, 108]);
        const courseClass1 = new CourseClass('Test', 3, [getCompetitor1()]);
        const courseClass2 = new CourseClass('Test', 4, [competitor2]);
        TestSupport.assertInvalidData( () => {
            const dummy = new CourseClassSet([courseClass1, courseClass2]);
        });
    });

    it('CourseClassSet created from two course-classes has two course-classes', () => {
        const courseClass1 = new CourseClass('Test class 1', 3, [getCompetitor1()]);
        const courseClass2 = new CourseClass('Test class 2', 3, [getCompetitor2()]);
        const courseClassSet = new CourseClassSet([courseClass1, courseClass2]);
        expect(courseClassSet.getNumClasses()).toEqual(2,  'Course-class set should have two classes');
    });

    it('Cumulative times of the winner of an empty course-class set is null', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [])]);
        expect(courseClassSet.getWinnerCumTimes()).toEqual(null,  'There should be no winner if there are no competitors');
    });

    it('Course-class set made up of course-class without dubious data that should itself not have dubious data', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [])]);
        expect(!courseClassSet.hasDubiousData()).toBe(true);
    });

    it('Course-class set made up of course-class with dubious data should also have dubious data', () => {
        const courseClass = new CourseClass('Test', 3, []);
        courseClass.recordHasDubiousData();
        const courseClassSet = new CourseClassSet([courseClass]);
        expect(courseClassSet.hasDubiousData()).toBe(true);
    });

    it('Course-class set made up of two course-classes, one with dubious data and one without, should have dubious data', () => {
        const courseClass1 = new CourseClass('Test 1', 3, []);
        courseClass1.recordHasDubiousData();
        const courseClass2 = new CourseClass('Test 2', 3, []);
        const courseClassSet = new CourseClassSet([courseClass1, courseClass2]);
        expect(courseClassSet.hasDubiousData()).toBe(true);
    });

    it('Cumulative times of the winner of a course-class set with only mispunchers is null', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [
            getCompetitor1WithNullFinishSplit(),
            getCompetitor2WithNullSplitForControl2()
        ])]);
        expect(courseClassSet.getWinnerCumTimes()).toEqual(null,  'There should be no winner if there are no competitors that completed the course');
    });

    it('Cumulative times of the winner of a single-class set are those with quickest time', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor2(), getFasterCompetitor1()])]);
        const winTimes = courseClassSet.getWinnerCumTimes();
        expect(winTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100],  'John Smith (second competitor) should be the winner');
    });

    it('Cumulative times of the winner of a multiple-class set are those with quickest time', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor2()]), new CourseClass('Test 2', 3, [getFasterCompetitor1()])]);
        const winTimes = courseClassSet.getWinnerCumTimes();
        expect(winTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100],  'John Smith (second competitor) from the second course should be the winner');
    });

    it('Cumulative times of the winner of a class containing only a single competitor with a dubious cumulative time include a filled gap', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousSplitForControl2()])]);
        const winTimes = courseClassSet.getWinnerCumTimes();
        expect(winTimes).toEqual([0, 65, 65 + (221 + 184) / 2, 65 + 221 + 184, 65 + 221 + 184 + 100],  'Cumulative times should have filled-in gap');
    });

    it('Cumulative times of the winner of a class containing only a single competitor with a dubious finish time include a filled gap', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousFinishTime()])]);
        const winTimes = courseClassSet.getWinnerCumTimes();
        expect(winTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 60],  'Cumulative times should have filled-in time to finish');
    });

    it('Cumulative times of the winner of a class containing only a single competitor with dubious times to the last control and finish include a filled gap', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousTimeToLastControlAndFinish()])]);
        const winTimes = courseClassSet.getWinnerCumTimes();
        expect(winTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 180, 65 + 221 + 180 + 60],  'Cumulative times should have filled-in time to last control and finish');
    });

    it('Fastest cumulative times on course-class set with no competitors should have backpopulated dummy cumulative times', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 180, 360, 540, 600],  'Empty course-class set should have dummy fastest times');
    });

    it('Fastest cumulative times on course-class set when both competitors have dubious time at one control has backpopulated value for missing control', () => {
        const competitor1 = fromOriginalCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        competitor1.setRepairedCumulativeTimes([0, 65, NaN, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        const competitor2 = fromOriginalCumTimes(2, 'Fred Brown', 'DEF', 10 * 3600 + 30, [0, 81, 81, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        competitor2.setRepairedCumulativeTimes([0, 81, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2])]);

        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + (197 + 212) / 2, 65 + 197 + 212, 65 + 197 + 212 + 100],
                    'Class with one control mispunched by all should have dummy value for missing control');
    });

    it('Fastest cumulative times on course-class set when only competitor has missing time at last control has backpopulated values from that competitor', () => {
        const competitor = fromCumTimes(1, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 + 221, null, 65 + 221 + 209 + 100]);
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + 221, 65 + 221 + (209 + 100) / 2, 65 + 221 + 209 + 100],
                    'Class with penultimate control mispunched by only competitor should have correct dummy value for missing control');
    });

    it('Fastest cumulative times on course-class set with one control mispunched by all has dummy fastest split for missing control', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithNullSplitForControl2(), getCompetitor2WithNullSplitForControl2()])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 245, 429, 529],  'Class with one control mispunched by all should have dummy value for missing control');
    });

    it('Fastest cumulative times on a single-class set should be made up of fastest times', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + 197, 65 + 197 + 184, 65 + 197 + 184 + 100],  'Fastest cumulative time should be made up of fastest splits');
    });

    it('Fastest cumulative times on a multiple-class set should be made up of fastest times from competitors from both classes', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1 ', 3, [getFasterCompetitor1()]), new CourseClass('Test 2', 3, [getCompetitor2()])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + 197, 65 + 197 + 184, 65 + 197 + 184 + 100],  'Fastest cumulative time should be made up of fastest splits');
    });

    it('Fastest cumulative times plus 75% on single-class set should be made up of fastest times with 75%', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        expect(courseClassSet.getFastestCumTimesPlusPercentage(75)).toEqual([0, 65 * 1.75, (65 + 197) * 1.75, (65 + 197 + 184) * 1.75, (65 + 197 + 184 + 100) * 1.75],
                                'Fastest cumulative times + 75% should be made up of fastest cumulative splits with 75% added');
    });

    it('Fastest cumulative times on single-class set should be made up of fastest split times ignoring nulls', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithNullFinishSplit(), getCompetitor2WithNullSplitForControl2()])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 106],
                            'Fastest cumulative times should be made up of fastest splits where not null');
    });

    it('Fastest cumulative times on single-class set should be made up of fastest split times ignoring dubious splits', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithDubiousSplitForControl2(), getCompetitor2()])]);
        expect(courseClassSet.getFastestCumTimes()).toEqual([0, 65, 65 + 197, 65 + 197 + 212, 65 + 197 + 212 + 100],
                            'Fastest cumulative times should be made up of fastest splits where not NaN');
    });

    it('Cumulative times of the second competitor in a single-class set are those of the second competitor', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor2(), getFasterCompetitor1()])]);
        const competitorTimes = courseClassSet.getCumulativeTimesForCompetitor(1);
        expect(competitorTimes).toEqual([0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106],  'Fred Brown (first competitor) should be the second competitor');
    });

    it('Cumulative times of the second competitor of a multiple-class set are those of the second competitor', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor2()]), new CourseClass('Test 2', 3, [getFasterCompetitor1()])]);
        const competitorTimes = courseClassSet.getCumulativeTimesForCompetitor(1);
        expect(competitorTimes).toEqual([0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106],  'Fred Brown (first competitor) from the first course should be the second competitor');
    });

    it('Cumulative times of the competitor in a class containing only a single competitor with a dubious cumulative time include a filled gap', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousSplitForControl2()])]);
        const competitorTimes = courseClassSet.getCumulativeTimesForCompetitor(0);
        expect(competitorTimes).toEqual([0, 65, 65 + (221 + 184) / 2, 65 + 221 + 184, 65 + 221 + 184 + 100],  'Cumulative times should have filled-in gap');
    });

    it('Cumulative times of the competitor in a class containing only a single competitor with a dubious finish time include a filled gap', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousFinishTime()])]);
        const competitorTimes = courseClassSet.getCumulativeTimesForCompetitor(0);
        expect(competitorTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 60],  'Cumulative times should have filled-in time to finish include a filled gap');
    });

    it('Cumulative times of the competitor in a class containing only a single competitor with dubious times to the last control and finish have the gap filled', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getCompetitor1WithDubiousTimeToLastControlAndFinish()])]);
        const competitorTimes = courseClassSet.getCumulativeTimesForCompetitor(0);
        expect(competitorTimes).toEqual([0, 65, 65 + 221, 65 + 221 + 180, 65 + 221 + 180 + 60],  'Cumulative times should have filled-in time to last control and finish');
    });

    function assertSplitRanks(competitor: Competitor, expectedSplitRanks: number[]) {
        expectedSplitRanks.forEach(function (splitRank, index) {
            if (isNaNStrict(splitRank)) {
                expect(isNaNStrict(competitor.getSplitRankTo(index + 1))).toBe(true);
            } else {
                expect(competitor.getSplitRankTo(index + 1)).toEqual(splitRank);
            }
        });
    }

    function assertCumulativeRanks(competitor: Competitor, expectedCumulativeRanks: number[]) {
        expectedCumulativeRanks.forEach(function (cumulativeRank, index) {
            if (isNaNStrict(cumulativeRank)) {
                expect(isNaNStrict(competitor.getCumulativeRankTo(index + 1))).toBe(true);
            } else {
                expect(competitor.getCumulativeRankTo(index + 1)).toEqual(cumulativeRank);
            }
        });
    }

    function assertSplitAndCumulativeRanks(competitor: Competitor, expectedSplitRanks: number[], expectedCumulativeRanks: number[]) {
        assertSplitRanks( competitor, expectedSplitRanks);
        assertCumulativeRanks( competitor, expectedCumulativeRanks);
    }

    it('Can compute ranks of single competitor as all 1s', () => {
        const competitor = getCompetitor1();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor])]);
        assertSplitAndCumulativeRanks( competitor, [1, 1, 1, 1], [1, 1, 1, 1]);
    });

    it('Can compute ranks in single-class set when there are two competitors with no equal times', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 2, 1, 1], [1, 2, 2, 1]);
        assertSplitAndCumulativeRanks( competitor2, [2, 1, 2, 2], [2, 1, 1, 2]);
    });

    it('Can compute ranks in multiple-class set when there are two competitors with no equal times', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const dummy = new CourseClassSet([new CourseClass('Test 1', 3, [competitor1]), new CourseClass('Test 2', 3, [competitor2])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 2, 1, 1], [1, 2, 2, 1]);
        assertSplitAndCumulativeRanks( competitor2, [2, 1, 2, 2], [2, 1, 1, 2]);
    });

    it('Can compute ranks when there are three competitors with no equal times', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 3, 2, 1], [1, 2, 3, 1]);
        assertSplitAndCumulativeRanks( competitor2, [3, 1, 3, 2], [3, 1, 2, 2]);
        assertSplitAndCumulativeRanks( competitor3, [2, 2, 1, 3], [2, 3, 1, 3]);
    });

    it('Can compute ranks when there are three competitors with one pair of equal split times', () => {
        const competitor1 = getCompetitor1WithSameControl2SplitAsThatOfCompetitor2();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 1, 2, 1], [1, 1, 1, 1]);
        assertSplitAndCumulativeRanks( competitor2, [3, 1, 3, 2], [3, 2, 3, 2]);
        assertSplitAndCumulativeRanks( competitor3, [2, 3, 1, 3], [2, 3, 2, 3]);
    });

    it('Can compute ranks when there are three competitors with one pair of equal cumulative times', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3WithSameTotalTimeAsCompetitor1();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 3, 2, 1], [1, 2, 3, 1]);
        assertSplitAndCumulativeRanks( competitor2, [3, 1, 3, 2], [3, 1, 2, 3]);
        assertSplitAndCumulativeRanks( competitor3, [2, 2, 1, 3], [2, 3, 1, 1]);
    });

    it('Can compute ranks when there are three competitors with one missing split times', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2WithNullSplitForControl2();
        const competitor3 = getCompetitor3();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 2, 2, 1], [1, 1, 2, 1]);
        assertSplitAndCumulativeRanks( competitor2, [3, null, 3, 2], [3, null, null, null]);
        assertSplitAndCumulativeRanks( competitor3, [2, 1, 1, 3], [2, 2, 1, 2]);
    });

    it('Can compute ranks when there is one control that all three competitors mispunch', () => {
        const competitor1 = getCompetitor1WithNullFinishSplit();
        const competitor2 = getCompetitor2WithNullFinishSplit();
        const competitor3 = getCompetitor3WithNullFinishSplit();
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [1, 3, 1, null], [1, 2, 1, null]);
        assertSplitAndCumulativeRanks( competitor2, [3, 1, 3, null], [3, 1, 3, null]);
        assertSplitAndCumulativeRanks( competitor3, [2, 2, 2, null], [2, 3, 2, null]);
    });

    it('Can compute ranks when there are three competitors specified by cumulative times with one missing split times', () => {
        const competitor1 = fromCumTimes(1, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const competitor2 = fromCumTimes(2, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        const competitor3 = fromCumTimes(2, 'Bill Baker', 'GHI', 11 * 3600, [0, 78, null,     78 + 209 + 199, 78 + 209 + 199 + 117]);
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [3, 1, 2, 2], [3, 1, 1, 2]);
        assertSplitAndCumulativeRanks( competitor2, [1, 2, 1, 1], [1, 2, 2, 1]);

        // No cumulative ranks from control 2 onwards: as competitor 3
        // mispunches they no don't have a cumulative rank from that point
        // onwards.
        assertSplitAndCumulativeRanks( competitor3, [2, null, null, 3], [2, null, null, null]);
    });

    it('Can compute ranks when there are three competitors specified by cumulative times with one having a dubious split time', () => {
        const competitor1 = fromCumTimes(1, 'Fred Brown', 'DEF', 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const competitor2 = fromCumTimes(2, 'John Smith', 'ABC', 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        const competitor3 = fromOriginalCumTimes(2, 'Bill Baker', 'GHI', 11 * 3600, [0, 78, 78 - 30, 78 + 209 + 199, 78 + 209 + 199 + 117]);
        competitor3.setRepairedCumulativeTimes([0, 78, NaN, 78 + 209 + 199, 78 + 209 + 199 + 117]);
        const dummy = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        assertSplitAndCumulativeRanks( competitor1, [3, 1, 2, 2], [3, 1, 2, 2]);
        assertSplitAndCumulativeRanks( competitor2, [1, 2, 1, 1], [1, 2, 3, 1]);

        assertSplitAndCumulativeRanks( competitor3, [2, NaN, NaN, 3], [2, NaN, 1, 3]);
    });

    it('Can get fastest two splits to control 3 from single-class set with three competitors', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 3);
        expect(fastestSplits).toEqual([{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}]);
    });

    it('Can get fastest two splits to control 3 from multiple-class set with three competitors', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [competitor1]), new CourseClass('Test 2', 3, [competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 3);
        expect(fastestSplits).toEqual([{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}]);
    });

    it('Can get fastest two splits to finish from single-class set with three competitors', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 4);
        expect(fastestSplits).toEqual([{split: 100, name: competitor1.name}, {split: 106, name: competitor2.name}]);
    });

    it('When getting fastest four splits to control 3 from single-class set with three competitors then three splits returned', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(4, 3);
        expect(fastestSplits).toEqual([{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}, {split: 212, name: competitor2.name}]);
    });

    it('When getting fastest two splits to control 3 from single-class set with three competitors with one mispunching control 3 then splits for other two competitors returned', () => {
        const competitor1 = getCompetitor1WithNullSplitForControl3();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 3);
        expect(fastestSplits).toEqual([{split: 199, name: competitor3.name}, {split: 212, name: competitor2.name}]);
    });

    it('When getting fastest two splits to control 3 from single-class set with three competitors with one mispunching a different control then splits for other two competitors returned', () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3WithNullSplitForControl2();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 3);
        expect(fastestSplits).toEqual([{split: 209, name: competitor1.name}, {split: 212, name: competitor2.name}]);
    });

    it('When getting fastest two splits to control 3 from single-class set with three competitors with two mispunching control 3 then one split returned', () => {
        const competitor1 = getCompetitor1WithNullSplitForControl3();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3WithNullSplitForControl3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(2, 3);
        expect(fastestSplits).toEqual([{split: 212, name: competitor2.name}]);
    });

    it('When getting fastest three splits to control 2 from single-class set with three competitors with one having a dubious split then competitor with dubious split omitted', () => {
        const competitor1 = getCompetitor1WithDubiousSplitForControl2();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [competitor1, competitor2, competitor3])]);

        const fastestSplits = courseClassSet.getFastestSplitsForControl(3, 2);
        expect(fastestSplits).toEqual([{split: 197, name: competitor2.name}, {split: 209, name: competitor3.name}]);
    });

    /**
    * Asserts that attempting to get the fastest splits of the given competitors
    * will fail with an InvalidData exception.
    * @param {QUnit.assert} assert - QUnit assertion object.
    * @param {Array} competitors - Array of competitor objects.
    * @param {Number} numSplits - The number of fastest splits to attempt to return.
    * @param {Number} controlIdx - The index of the control.
    */
    function assertCannotGetFastestSplits( competitors: Competitor[], numSplits: number, controlIdx: number) {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, competitors)]);
        TestSupport.assertInvalidData( () => {
            courseClassSet.getFastestSplitsForControl(numSplits, controlIdx);
        });
    }

    it('Cannot return fastest 0 splits to a control', () => {
        assertCannotGetFastestSplits( [getCompetitor1()], 0, 3);
    });

    it('Cannot return fastest splits to control zero', () => {
        assertCannotGetFastestSplits( [getCompetitor1()], 1, 0);
    });

    it('Cannot return fastest splits to control out of range', () => {
        assertCannotGetFastestSplits( [getCompetitor1()], 1, 5);
    });

    it('Can return chart data for two competitors in same class', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 16] },
                { x: 65 + 197, ys: [24, 16] },
                { x: 65 + 197 + 184, ys: [24, 44] },
                { x: 65 + 197 + 184 + 100, ys: [24, 50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });


    it('Can return chart data for two competitors where one of them has a dubious split', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithDubiousSplitForControl2(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 16] },
                { x: 65 + 197, ys: [NaN, 16] },
                { x: 65 + 197 + 212, ys: [-4, 16] },
                { x: 65 + 197 + 212 + 100, ys: [-4, 22] }
            ],
            xExtent: [0, 65 + 197 + 212 + 100],
            yExtent: [-4, 22],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[{start: 1, end: 3}], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for two competitors where one of them has a dubious split and chart type has skip-start', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithDubiousSplitForControl2(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], DUMMY_CHART_TYPE_SKIP);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 65, ys: [0, 0] },
                { x: 65 + 197, ys: [0, 16] },
                { x: 65 + 197 + 212, ys: [NaN, 16] },
                { x: 65 + 197 + 212 + 100, ys: [-4, 16] }
            ],
            xExtent: [0, 65 + 197 + 212 + 100],
            yExtent: [-4, 22],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[{start: 0, end: 2}], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    // If the start is being skipped, then we must ignore dubious times to control 1.
    it('Can return chart data with no dubious time for two competitors where one of them has a dubious split to control 1 and chart type has skip-start', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getCompetitor1WithDubiousSplitForControl1(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], DUMMY_CHART_TYPE_SKIP);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 81, ys: [0, 0] },
                { x: 81 + 197, ys: [NaN, 0] },
                { x: 81 + 197 + 184, ys: [8, 0] },
                { x: 81 + 197 + 184 + 100, ys: [8, 28] }
            ],
            xExtent: [0, 81 + 197 + 184 + 100],
            yExtent: [0, 34],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[/* none */], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for two competitors in same class with correct X-extent when one competitor has cumulative times not in order', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2WithFinishCumTimeNotTheLargest()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [16, 0] },
                { x: 65 + 197, ys: [16, 24] },
                { x: 65 + 197 + 184, ys: [44, 24] },
                { x: 65 + 197 + 184 - 73, ys: [44, 197] }
            ],
            xExtent: [0, 65 + 197 + 184],
            yExtent: [0, 197],
            numControls: 3,
            competitorNames: ['Fred Brown', 'John Smith'],
            dubiousTimesInfo: [[], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for two competitors in same class with correct X-extent when one competitor has the first cumulative time larger than all others', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2WithFirstControlLargerThanAllOthers()])]);

        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 4038] },
                { x: 65 + (81 + 197 - 4103), ys: [4046, 4038] },
                { x: 65 + (81 + 197 - 4103) + 184, ys: [4046, 4066] },
                { x: 65 + (81 + 197 - 4103) + 184 + 100, ys: [4046, 4072] }
            ],
            xExtent: [65 + (81 + 197 - 4103), 65],
            yExtent: [0, 4072],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for two competitors in different classes of the set', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test 1', 3, [getFasterCompetitor1()]), new CourseClass('Test 2', 3, [getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 16] },
                { x: 65 + 197, ys: [24, 16] },
                { x: 65 + 197 + 184, ys: [24, 44] },
                { x: 65 + 197 + 184 + 100, ys: [24, 50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ['John Smith', 'Fred Brown'],
            dubiousTimesInfo: [[], []]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for first competitor only', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [0], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0] },
                { x: 65, ys: [0] },
                { x: 65 + 197, ys: [24] },
                { x: 65 + 197 + 184, ys: [24] },
                { x: 65 + 197 + 184 + 100, ys: [24] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 24],
            numControls: 3,
            competitorNames: ['John Smith'],
            dubiousTimesInfo: [[]]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for second competitor only', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [1], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [
                { x: 0, ys: [0] },
                { x: 65, ys: [16] },
                { x: 65 + 197, ys: [16] },
                { x: 65 + 197 + 184, ys: [44] },
                { x: 65 + 197 + 184 + 100, ys: [50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ['Fred Brown'],
            dubiousTimesInfo: [[]]
        };

        expect(chartData).toEqual(expectedChartData);
    });

    it('Can return chart data for empty list of competitors', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [getFasterCompetitor1(), getCompetitor2()])]);
        const fastestTime = courseClassSet.getFastestCumTimes();

        const chartData = courseClassSet.getChartData(fastestTime, [], _DUMMY_CHART_TYPE);

        const expectedChartData: ChartData = {
            dataColumns: [],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: chartData.yExtent, // Deliberately set this equal, we'll test it later.
            numControls: 3,
            competitorNames: [],
            dubiousTimesInfo: []
        };

        expect(chartData).toEqual(expectedChartData);

        expect(chartData.yExtent[0] < chartData.yExtent[1]).toBe(true, 'The y-axis should have a positive extent: got values ' + chartData.yExtent[0] + ' and ' + chartData.yExtent[1]);
    });

    it('Can return empty chart data when no competitors', () => {
        const courseClassSet = new CourseClassSet([new CourseClass('Test', 3, [])]);
        const data = courseClassSet.getChartData([0, 87, 87 + 147, 87 + 147 + 92], [], _DUMMY_CHART_TYPE);
        const expectedChartData: ChartData = {
            dataColumns: [],
            xExtent: data.xExtent,
            yExtent: data.yExtent,
            numControls: 3,
            competitorNames: [],
            dubiousTimesInfo: []
        };
        expect(data).toEqual(expectedChartData);
    });
});
