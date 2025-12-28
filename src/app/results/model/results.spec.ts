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
/* eslint-disable max-len */
import { describe, expect, it } from 'vitest';
import { TestSupport } from "../test-support.spec";
import { Competitor } from "./competitor";
import { Course } from "./course";
import { CourseClass } from "./course-class";
import { Results } from "./results";
import { isNotNull } from "./results_util";

const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;
const fromSplitTimes = TestSupport.fromSplitTimes;

describe("Results", () => {

    function getCompetitor1(): Competitor {
        const comp = fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
        comp.ecardId = "1";
        return comp;
    }

    function getCompetitor2(): Competitor {
        const comp = fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 100]);
        comp.ecardId = "2";
        return comp;
    }

    function getCompetitor3(): Competitor {
        const comp = fromSplitTimes(2, "Aron Ardvark", "HIJK", 10 * 3600, [65, 221, 184, 100]);
        comp.ecardId = "3";
        return comp;
    }

    function getCompetitor4(): Competitor {
        const comp = fromSplitTimes(2, "Aron Ardvarx", "SN", 10 * 3600, [65, 221, 184, 100]);
        comp.ecardId = "4";
        return comp;
    }

    function getCompetitor2WithExtraSplit(): Competitor {
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
        expect(!event.needsRepair(), "Event should not need repair").toBe(true);
    });

    it("Event that does need repairing reports that it does", () => {
        const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 0, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        const courseClass = new CourseClass("Test class", 3, [competitor]);
        const course = new Course("Test course", [courseClass], null, null, ["235", "212", "189"]);

        const event = new Results([courseClass], [course]);
        expect(event.needsRepair()).toBe(true);
    });

    function makeSearchData(): Results {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const competitor3 = getCompetitor3();
        const competitor4 = getCompetitor4();

        const courseClass1 = new CourseClass("M45", 3, [competitor1]);
        const courseClass2 = new CourseClass("W45", 3, [competitor2, competitor3]);
        const courseClass3 = new CourseClass("M45", 3, [competitor4]);

        const course1 = new Course("Course X", [courseClass1], 8.0, null, ["235", "212", "189"]);
        const course2 = new Course("Course Y", [courseClass2, courseClass3], 10.00, null, ["226", "212", "189"]);

        return new Results([courseClass1, courseClass2, courseClass3], [course1, course2]);

    }

    it("Search for  surname with more than 1 characters", () => {
        const results = makeSearchData();
        const res = results.findCompetitors("ArD");
        expect(res[0].ecardId).toEqual("3");
        expect(res[1].ecardId).toEqual("4");
        expect(res.length).toBe(2);
    });

 /*   it("Search by surname", () => {
        const results = makeSearchData();
        const res = results.findCompetitors("a");
        expect(res.length).toBe(0, "Should be no exact match found for 2 characters"); 
    }); */

    it("Search by firstname", () => {
        const results = makeSearchData();
        const res = results.findCompetitors("FreD");
        expect(res[0].ecardId, "match on first name").toEqual("1");
        expect(res.length, "One name fred matches").toBe(1);
    });

    it("Search by club with 2 characters", () => {
        const results = makeSearchData();
        const res = results.findCompetitors("Sn");
        expect(res[0].ecardId, "match on first name").toEqual("4");
        expect(res.length, "Exact match on SN").toBe(1);
    });

    it('Search for "" should not return any results', () => {
        const results = makeSearchData();
        const res = results.findCompetitors("");
        expect(res.length, 'Expect search on "" not to return any results').toBe(0);
    });

    it("Search by club with 2 characters - non excat match", () => {
        const results = makeSearchData();
        const res = results.findCompetitors("AB");
        expect(res.length, "Non exact match on ABC").toBe(1);
    });

    it("Search for course by name with 3 chracters with distances", () => {
        const results = makeSearchData();
        const res = results.findCourses("CoursE");
        expect(res[0].name, "Course Y first as sorted by distance").toEqual("Course Y");
        expect(res[1].name).toEqual("Course X");
        expect(res.length).toBe(2);
    });

    it("Search for course by name with exact match", () => {
        const results = makeSearchData();
        const res = results.findCourses("CouRse X");
        expect(res[0].name).toEqual("Course X");
        expect(res.length).toBe(1);
    });

    it("Search for class with exact match", () => {
        const results = makeSearchData();
        const res = results.findCourseClasss("m45");
        expect(res[0].name).toEqual("M45");
        expect(res[1].name).toEqual("M45");
        expect(res.length).toBe(2);
    });

    it("Search for class with non-exact match", () => {
        const results = makeSearchData();
        const res = results.findCourseClasss("M4");
        expect(res.length).toBe(2);
    });
});
