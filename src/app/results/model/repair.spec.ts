/*
 *  SplitsBrowser - data-repair tests.
 *
 *  Copyright (C) 2000-2014 Dave Ryder, Reinhard Balling, Andris Strazdins,
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
import { } from "jasmine";
import 'jasmine-expect';
import { TestSupport } from "../test-support.spec";
import { Competitor } from "./competitor";
import { Course } from "./course";
import { CourseClass } from "./course-class";
import { Repairer } from "./repairer";
import { Results } from "./results";


describe("Data Repair", () => {

    const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;

    function wrapInEvent(competitors) {
        const courseClass = new CourseClass("Test class", competitors[0].originalCumTimes.length - 2, competitors);
        const course = new Course("Test course", [courseClass], null, null, null);
        const eventData = new Results([courseClass], [course]);
        return eventData;
    }

    /**
    * Wraps the given array of competitors in a course-class, course and event,
    * repair the event and return whether the course-class has dubious data.
    * @param {Array} competitors - Array of competitor objects.
    * @return {boolean} True if the course-class has dubious data, false
    *     otherwise.
    */
    function wrapInEventAndRepair(competitors) {
        const eventData = wrapInEvent(competitors);
        Repairer.repairEventData(eventData);
        return eventData.classes[0].hasDubiousData;
    }

    function wrapInEventAndTransfer(competitors) {
        Repairer.transferCompetitorData(wrapInEvent(competitors));
    }

    it("Can repair competitor with ascending cumulative times leaving them in ascending order", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can repair competitor by setting second equal cumulative time to NaN", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        TestSupport.assertStrictEqualArrays( competitor.cumTimes, [0, 81, 81 + 197, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor by setting second and third equal cumulative time to NaN", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        TestSupport.assertStrictEqualArrays( competitor.cumTimes, [0, 81, 81 + 197, NaN, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with multiple missed splits by doing nothing", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, null, null, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can repair competitor with finish time equal to last control by doing nothing", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        TestSupport.assertStrictEqualArrays( competitor.cumTimes, competitor.originalCumTimes);
    });

    it("Can repair competitor with absurdly high cumulative time by removing the offending time", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 99999, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with multiple absurdly high cumulative times by removing the offending times", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 99999, 81 + 197, 99999, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, NaN, 81 + 197, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with absurdly high cumulative time followed by nulls by removing the offending time", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 99999, null, null, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, NaN, null, null, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with absurdly low cumulative time by removing the offending time", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 1, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with multiple absurdly low cumulative times by removing the offending times", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 1, 81 + 197, 1, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, NaN, 81 + 197, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Can repair competitor with absurdly low cumulative time preceded by nulls by removing the offending time", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, null, null, 1, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, null, null, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Removes ridiculously low finish time of competitor if competitor mispunched but punches the last control and the finish", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, null, 81 + 197 + 212, 1]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, 81, null, 81 + 197 + 212, NaN]);
    });

    it("Makes no changes to a competitor that has failed to punch the finish but all other cumulative times are in order", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, null]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Does not remove ridiculously low finish time from mispunching competitor if they did not punch the last control", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, null, 81 + 197 + 212, null, 1]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can repair competitor with two consecutive absurdly high cumulative times by removing them", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 5000, 6000, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual([0, NaN, NaN, 81 + 197 + 212, 81 + 197 + 212 + 106]);
    });

    it("Does not repair competitor with two absurdly high cumulative times separated only by a missing split", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 5000, null, 6000, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const hasDubiousData = wrapInEventAndRepair([competitor]);
        expect(!hasDubiousData).toBe(true);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can transfer competitor with ascending cumulative times leaving them in ascending order", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        wrapInEventAndTransfer([competitor]);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can transfer competitor data with absurdly high cumulative time by leaving it as it is", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 99999, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        wrapInEventAndTransfer([competitor]);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can transfer competitor data with absurdly low cumulative time by leaving it as it is", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 1, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        wrapInEventAndTransfer([competitor]);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can transfer competitor data with ridiculously low finish time by leaving it as it is", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, null, 81 + 197 + 212, 1]);
        wrapInEventAndTransfer([competitor]);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });

    it("Can transfer competitor data with two consecutive absurdly high cumulative times by leaving them as they are", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 5000, 6000, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        wrapInEventAndTransfer([competitor]);
        expect(competitor.cumTimes).toEqual(competitor.originalCumTimes);
    });
});
