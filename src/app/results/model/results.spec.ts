/*
 *  SplitsBrowser - Event tests.
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
import { } from "jasmine";
import { } from "jasmine-expect";

import { Results } from "./results";
import { Competitor } from "./competitor";
import { CourseClass } from "./course-class";
import { Course } from "./course";
import { isNotNull } from "./util";
import { TestSupport } from "app/results/test-support.spec";

const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;
const fromSplitTimes = TestSupport.fromSplitTimes;

fdescribe("Results", () => {

    function getCompetitor1() {
        return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
    }

    function getCompetitor2() {
        return fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 100]);
    }

    function getCompetitor2WithExtraSplit() {
        return fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 157, 100]);
    }

    it("Returns empty list of fastest splits to a leg if the event has no competitors", () => {
        const event = new Results([], []);
        expect(event.getFastestSplitsForLeg("235", "212")).toEqual([]);
    });

    it("Returns fastest split to a leg if the event has a single class with competitors on that leg", () => {
        const competitor2 = getCompetitor2();
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), competitor2]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);
        const event = new Results([courseClass], [course]);
        expect(event.getFastestSplitsForLeg("212", "189")).toEqual([{ name: competitor2.name, className: courseClass.name, split: 184 }]);
    });

    it("Returns empty list of fastest splits to a leg if the event has a single course with competitors not on that leg", () => {
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), getCompetitor2()]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);
        const event = new Results([courseClass], [course]);
        expect(event.getFastestSplitsForLeg("235", "189")).toEqual([]);
    });

    it("Returns list of fastest splits to a leg if the event has two courses with competitors in each on that leg, sorted into split order", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2WithExtraSplit();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 4, [competitor2]);
        const course1 = new Course("Test course 1", [courseClass1], null, null, ["235", "212", "189"]);
        const course2 = new Course("Test course 2", [courseClass2], null, null, ["226", "212", "189", "211"]);

        const event = new Results([courseClass1, courseClass2], [course1, course2]);
        expect(event.getFastestSplitsForLeg("212", "189")).toEqual([{ name: competitor2.name, className: courseClass2.name, split: 184 }, { name: competitor1.name, className: courseClass1.name, split: 212 }]);
    });

    it("Returns empty list of competitors visiting a control during an interval when the event has no courses", () => {
        const event = new Results([], []);
        expect(event.getCompetitorsAtControlInTimeRange("212", 10 * 3600, 11 * 3600)).toEqual([]);
    });

    it("Returns list of competitors visiting a control during an interval if the event has a single class with competitors visiting that control, with competitors sorted in order of time", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const courseClass = new CourseClass("Test class", 3, [competitor1, competitor2]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);

        const event = new Results([courseClass], [course]);
        const competitor1Time = 10 * 3600 + 30 * 60 + 81 + 197;
        const competitor2Time = 10 * 3600 + 65 + 221;
        expect(event.getCompetitorsAtControlInTimeRange("212", competitor2Time - 1, competitor1Time + 1)).toEqual(
            [{ name: competitor2.name, className: courseClass.name, time: competitor2Time },
            { name: competitor1.name, className: courseClass.name, time: competitor1Time }]);
    });

    it("Returns list of competitors visiting a control during an interval if the event has two courses and with one class each with competitors visiting that control, with competitors sorted in order of time", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2WithExtraSplit();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 4, [competitor2]);
        const course1 = new Course("Test course 1", [courseClass1], null, null, ["235", "212", "189"]);
        const course2 = new Course("Test course 2", [courseClass2], null, null, ["226", "212", "189", "211"]);

        const event = new Results([courseClass1, courseClass2], [course1, course2]);
        const competitor1Time = 10 * 3600 + 30 * 60 + 81 + 197;
        const competitor2Time = 10 * 3600 + 65 + 221;
        expect(event.getCompetitorsAtControlInTimeRange("212", competitor2Time - 1, competitor1Time + 1)).toEqual(
            [{ name: competitor2.name, className: courseClass2.name, time: competitor2Time },
            { name: competitor1.name, className: courseClass1.name, time: competitor1Time }]);
    });

    it("Returns empty array of next controls for control that does not exist in any course", () => {
        const course1 = new Course("Test course 1", [], null, null, ["235", "212", "189", "214"]);
        const course2 = new Course("Test course 2", [], null, null, ["226", "212", "189", "211"]);

        const event = new Results([], [course1, course2]);
        expect(event.getNextControlsAfter("999")).toEqual([]);
    });

    it("Returns single-element array of next controls for control that exists only in one course", () => {
        const course1 = new Course("Test course 1", [], null, null, ["235", "212", "189", "214"]);
        const course2 = new Course("Test course 2", [], null, null, ["226", "212", "189", "211"]);

        const event = new Results([], [course1, course2]);
        expect(event.getNextControlsAfter("226")).toEqual([{ course: course2, nextControls: ["212"] }]);
    });

    it("Returns two-element array of next controls for control that exists in both courses", () => {
        const course1 = new Course("Test course 1", [], null, null, ["235", "212", "189", "214"]);
        const course2 = new Course("Test course 2", [], null, null, ["226", "212", "189", "211"]);

        const event = new Results([], [course1, course2]);
        expect(event.getNextControlsAfter("189")).toEqual([{ course: course1, nextControls: ["214"] }, { course: course2, nextControls: ["211"] }]);
    });

    it("Returns two-element array of next controls after the start", () => {
        const course1 = new Course("Test course 1", [], null, null, ["235", "212", "189", "214"]);
        const course2 = new Course("Test course 2", [], null, null, ["226", "212", "189", "211"]);

        const event = new Results([], [course1, course2]);
        expect(event.getNextControlsAfter(Course.START)).toEqual([{ course: course1, nextControls: ["235"] }, { course: course2, nextControls: ["226"] }]);
    });

    it("Determines time losses in each class when asked to do so", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 3, [competitor2]);
        const course1 = new Course("Test course 1", [courseClass1], null, null, ["235", "212", "189"]);
        const course2 = new Course("Test course 2", [courseClass2], null, null, ["226", "212", "189"]);

        const event = new Results([courseClass1, courseClass2], [course1, course2]);
        expect(competitor1.getTimeLossAt(2)).toEqual(null);
        expect(competitor2.getTimeLossAt(2)).toEqual(null);
        event.determineTimeLosses();
        expect(isNotNull(competitor1.getTimeLossAt(2))).toBe(true);
        expect(isNotNull(competitor2.getTimeLossAt(2))).toBe(true);
    });

    it("Event that does not need repairing reports that it doesn't", () => {
        const competitor = getCompetitor1();
        const courseClass = new CourseClass("Test class", 3, [competitor]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);

        const event = new Results([courseClass], [course]);
        expect(!event.needsRepair()).toBe(true);
    });

    it("Event that does need repairing reports that it does", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 0, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const courseClass = new CourseClass("Test class", 3, [competitor]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);

        const event = new Results([courseClass], [course]);
        expect(event.needsRepair()).toBe(true);
    });
});
