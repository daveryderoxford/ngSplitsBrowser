/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
/*
 *  SplitsBrowser - ChartPopupData tests.
 *
 *  Copyright (C) 2000-2013 Dave Ryder, Reinhard Balling, Andris Strazdins,
 *                          Ed Nash, Luke Woodward.
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
import { } from "jasmine";
import { Course, CourseClass, CourseClassSet, Results, TimeUtilities } from "../../model";
import { TestSupport } from "../../test-support.spec";
import { Lang } from "./lang";
import { FastestSplitsPopupData, FastestSplitsPopupDataForLeg, NextControlsDataStr, SplitsPopupData } from "./splits-popup-data";
import { range } from "d3-array";


interface ExpectedData {
    nextControls: NextControlsDataStr[];
    thisControl: string;
}

const getMessage = Lang.getMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;
const formatTime = TimeUtilities.formatTime;
const fromSplitTimes = TestSupport.fromSplitTimes;

// TODO shaould use before aech for this
const MAX_FASTEST_SPLITS = 10;
const RACE_GRAPH_COMPETITOR_WINDOW = 240;
const splitsPopupData = new SplitsPopupData(MAX_FASTEST_SPLITS, RACE_GRAPH_COMPETITOR_WINDOW);

describe("Splits popup data", () => {

    function getTestCourseClassSet() {
        const competitors = range(0, 11).map(function (num) {
            const timeOffset = (num * 7) % 11;
            return fromSplitTimes(1, "Name" + num, "Club" + num, 10 * 3600 + 127 * num, [65 + 10 * timeOffset, 221 + 20 * timeOffset, 209 + 15 * timeOffset, 100 + 5 * timeOffset]);
        });

        return new CourseClassSet([new CourseClass("Test class", 3, competitors)]);
    }

    it("Can get selected classes popup data", () => {

        const courseClassSet: CourseClassSet = getTestCourseClassSet();
        const actualData = splitsPopupData.getFastestSplitsPopupData(courseClassSet, 2);

        const expectedData = {
            title: getMessage("SelectedClassesPopupHeader"),
            data: range(0, 10).map(function (num) {
                // 8 is the multiplicative inverse of 7 modulo 11,
                // so we multiply by 8 to reverse the effect of
                // multiplying by 7 modulo 11.
                const compIndex = (num * 8) % 11;
                return { name: "Name" + compIndex, time: 221 + num * 20, highlight: false };
            }),
            placeholder: getMessage("SelectedClassesPopupPlaceholder")
        };

        expect(actualData).toEqual(expectedData);
    });

    it("Can get fastest splits to intermediate control", () => {

        const courseClassSet1 = getTestCourseClassSet();
        const course1 = new Course("Test course", courseClassSet1.classes, null, null, ["235", "189", "212"]);
        courseClassSet1.classes.forEach(function (courseClass) { courseClass.setCourse(course1); });

        const courseClassSet2 = new CourseClassSet([new CourseClass("Test class 2", 3, [fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [75, 242, 200, 157])])]);
        const course2 = new Course("Test course 2", courseClassSet2.classes, null, null, ["235", "189", "212"]);
        courseClassSet2.classes[0].setCourse(course2);

        const eventData = new Results(courseClassSet1.classes.concat(courseClassSet2.classes), [course1, course2], []);
        const actualData = splitsPopupData.getFastestSplitsForLegPopupData(courseClassSet1, eventData, 2);

        const expectedData: any = {
            title: getMessageWithFormatting("FastestLegTimePopupHeader", { "$$START$$": "235", "$$END$$": "189" }),
            data: [{
                className: "Test class",
                highlight: true,
                name: "Name0",
                time: 221
            },
            {
                className: "Test class 2",
                highlight: false,
                name: "John Smith",
                time: 242
            }],
            placeholder: null
        };

        expect(actualData).toEqual(expectedData);
    });

    it("Can get fastest splits from start to first control", () => {

        const courseClassSet = getTestCourseClassSet();
        const course = new Course("Test course", courseClassSet.classes, null, null, ["235", "189", "212"]);
        courseClassSet.classes.forEach(function (courseClass) { courseClass.setCourse(course); });

        const eventData = new Results(courseClassSet.classes, [course], []);
        const actualData = splitsPopupData.getFastestSplitsForLegPopupData(courseClassSet, eventData, 1);

        const expectedData: FastestSplitsPopupDataForLeg = {
            title: getMessageWithFormatting("FastestLegTimePopupHeader", { "$$START$$": getMessage("StartName"), "$$END$$": "235" }),
            data: [{
                className: "Test class",
                highlight: true,
                name: "Name0",
                time: 65
            }],
            placeholder: null
        };

        expect(actualData).toEqual(expectedData);
    });

    it("Can get fastest splits from last control to finish", () => {

        const courseClassSet = getTestCourseClassSet();
        const course = new Course("Test course", courseClassSet.classes, null, null, ["235", "189", "212"]);
        courseClassSet.classes.forEach(function (courseClass) { courseClass.setCourse(course); });

        const eventData = new Results(courseClassSet.classes, [course], []);
        const actualData = splitsPopupData.getFastestSplitsForLegPopupData(courseClassSet, eventData, 4);

        const expectedData: FastestSplitsPopupDataForLeg = {
            title: getMessageWithFormatting("FastestLegTimePopupHeader", { "$$START$$": "212", "$$END$$": getMessage("FinishName") }),
            data: [{
                className: "Test class",
                highlight: true,
                name: "Name0",
                time: 100
            }],
            placeholder: null
        };

        expect(actualData).toEqual(expectedData);
    });

    it("Can get competitors near intermediate control", () => {
        const courseClassSet = getTestCourseClassSet();
        const course = new Course("Test course", courseClassSet.classes, null, null, ["235", "189", "212"]);
        courseClassSet.classes.forEach(function (courseClass) { courseClass.setCourse(course); });

        const eventData = new Results(courseClassSet.classes, [course], []);

        const testTime = 10 * 3600 + 12 * 60;

        const expectedData = {
            title: getMessageWithFormatting("NearbyCompetitorsPopupHeader", {
                "$$START$$": formatTime(testTime - 120),
                "$$END$$": formatTime(testTime + 120),
                "$$CONTROL$$": getMessageWithFormatting("ControlName", { "$$CODE$$": "189" })
            }),
            data: [
                { className: "Test class", highlight: true, name: "Name1", time: 36623 },
                { className: "Test class", highlight: true, name: "Name2", time: 36630 }
            ],
            placeholder: getMessage("NoNearbyCompetitors")
        };

        const actualData = splitsPopupData.getCompetitorsVisitingCurrentControlPopupData(courseClassSet, eventData, 2, testTime);

        expect(actualData).toEqual(expectedData);
    });

    it("Can get competitors near start control", () => {
        const courseClassSet = getTestCourseClassSet();
        const course = new Course("Test course", courseClassSet.classes, null, null, ["235", "189", "212"]);
        courseClassSet.classes.forEach(function (courseClass) { courseClass.setCourse(course); });

        const eventData = new Results(courseClassSet.classes, [course], []);

        const testTime = 10 * 3600 + 12 * 60;

        const expectedData = {
            title: getMessageWithFormatting("NearbyCompetitorsPopupHeader", {
                "$$START$$": formatTime(testTime - 120),
                "$$END$$": formatTime(testTime + 120),
                "$$CONTROL$$": getMessage("StartName")
            }),
            data: [
                { className: "Test class", highlight: true, name: "Name5", time: 36635 },
                { className: "Test class", highlight: true, name: "Name6", time: 36762 }
            ],
            placeholder: getMessage("NoNearbyCompetitors")
        };

        const actualData = splitsPopupData.getCompetitorsVisitingCurrentControlPopupData(courseClassSet, eventData, 0, testTime);

        expect(actualData).toEqual(expectedData);
    });

    it("Can get competitors near finish control", () => {
        const courseClassSet = getTestCourseClassSet();
        const course = new Course("Test course", courseClassSet.classes, null, null, ["235", "189", "212"]);
        courseClassSet.classes.forEach(function (courseClass) { courseClass.setCourse(course); });

        const eventData = new Results(courseClassSet.classes, [course], []);

        const testTime = 10 * 3600 + 28 * 60;

        const expectedData = {
            title: getMessageWithFormatting("NearbyCompetitorsPopupHeader", {
                "$$START$$": formatTime(testTime - 120),
                "$$END$$": formatTime(testTime + 120),
                "$$CONTROL$$": getMessage("FinishName")
            }),
            data: [
                { className: "Test class", highlight: true, name: "Name8", time: 37661 },
                { className: "Test class", highlight: true, name: "Name7", time: 37734 }
            ],
            placeholder: getMessage("NoNearbyCompetitors")
        };

        const actualData = splitsPopupData.getCompetitorsVisitingCurrentControlPopupData(courseClassSet, eventData, 4, testTime);

        expect(actualData).toEqual(expectedData);
    });

    it("Can get courses and next controls using numeric sorting of course names where appropriate", () => {
        const course5 = new Course("Test course 5", [], null, null, ["235", "189", "212"]);
        const course8 = new Course("Test course 8", [], null, null, ["235", "189", "212"]);
        const course10 = new Course("Test course 10", [], null, null, ["235", "189", "212"]);
        const course23 = new Course("Test course 23", [], null, null, ["235", "189", "212"]);
        const courseBefore = new Course("AAAAA", [], null, null, ["235", "189", "212"]);
        const courseAfter = new Course("ZZZZZ", [], null, null, ["235", "189", "212"]);

        const eventData = new Results([], [course10, courseAfter, course5, course23, courseBefore, course8], []);


        const expectedData: ExpectedData = {
            nextControls: [
                { course: courseBefore, nextControls: "212" },
                { course: course5, nextControls: "212" },
                { course: course8, nextControls: "212" },
                { course: course10, nextControls: "212" },
                { course: course23, nextControls: "212" },
                { course: courseAfter, nextControls: "212" }
            ],
            thisControl: getMessageWithFormatting("ControlName", { "$$CODE$$": "189" })
        };

        const actualData = splitsPopupData.getNextControlData(course5, eventData, 2);
        expect(actualData).toEqual(expectedData);
    });

    it("Can get next controls of course after intermediate control when control repeated", () => {
        const course = new Course("Test course", [], null, null, ["235", "189", "241", "189", "212"]);
        const eventData = new Results([], [course], []);

        const expectedData: ExpectedData = {
            nextControls: [{ course: course, nextControls: "241, 212" }],
            thisControl: getMessageWithFormatting("ControlName", { "$$CODE$$": "189" })
        };

        const actualData = splitsPopupData.getNextControlData(course, eventData, 2);
        expect(actualData).toEqual(expectedData);
    });

    it("Can get next controls of course after start control", () => {
        const course = new Course("Test course", [], null, null, ["235", "189", "212"]);
        const eventData = new Results([], [course], []);

        const expectedData = {
            nextControls: [{ course: course, nextControls: "235" }],
            thisControl: getMessage("StartName")
        };

        const actualData = splitsPopupData.getNextControlData(course, eventData, 0);
        expect(actualData).toEqual(expectedData);
    });

    it("Can get next controls of course after last control", () => {
        const course = new Course("Test course", [], null, null, ["235", "189", "212"]);
        const eventData = new Results([], [course], []);

        const expectedData: ExpectedData = {
            nextControls: [{ course: course, nextControls: getMessage("FinishName") }],
            thisControl: getMessageWithFormatting("ControlName", { "$$CODE$$": "212" })
        };

        const actualData = splitsPopupData.getNextControlData(course, eventData, 3);
        expect(actualData).toEqual(expectedData);
    });
});
