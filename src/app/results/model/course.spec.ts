/*
 *  SplitsBrowser - Course tests.
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
import { Competitor } from "app/results/model";
import { } from "jasmine";
import { TestSupport } from "../test-support.spec";
import { Course } from "./course";
import { CourseClass } from "./course-class";

const fromSplitTimes = TestSupport.fromSplitTimes;

fdescribe("Course", () => {

    function getCompetitor1(): Competitor {
        return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
    }

    function getCompetitor2(): Competitor {
        return fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 100]);
    }

    it("Getting other classes of a course with one class returns empty list when given that one class", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const course = new Course("Test course", [courseClass], null, null, null);

        expect(course.getOtherClasses(courseClass)).toEqual([],  "There should be no other classes");
    });

    it("Course created with three classes has three classes", () => {
        const courseClass1 = new CourseClass("Test class 1", 3, []);
        const courseClass2 = new CourseClass("Test class 2", 3, []);
        const courseClass3 = new CourseClass("Test class 3", 3, []);
        const course = new Course("Test course", [courseClass1, courseClass2, courseClass3], null, null, null);

        expect(course.getNumClasses()).toEqual(3,  "Course should have three classes");
    });

    it("Getting other classes of a course with three classes returns the other two when given one of the others", () => {
        const courseClass1 = new CourseClass("Test class 1", 3, []);
        const courseClass2 = new CourseClass("Test class 2", 3, []);
        const courseClass3 = new CourseClass("Test class 3", 3, []);
        const course = new Course("Test course", [courseClass1, courseClass2, courseClass3], null, null, null);

        expect(course.getOtherClasses(courseClass2)).toEqual([courseClass1, courseClass3],  "There should be no other classes");
    });

    it("Attempting to get other courses of a course with three classes when given some other class throws an exception", () => {
        const courseClass1 = new CourseClass("Test class 1", 3, []);
        const courseClass2 = new CourseClass("Test class 2", 3, []);
        const courseClass3 = new CourseClass("Test class 3", 3, []);
        const course = new Course("Test course", [courseClass1, courseClass2], null, null, null);
        TestSupport.assertInvalidData( () => {
            course.getOtherClasses(courseClass3);
        });
    });

    it("Course created without controls does not contain controls", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, null);
        expect(!course.hasControls()).toBe(true);
    });

    it("Course created with controls does contain controls", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.hasControls()).toBe(true);
    });

    it("Course created with controls does contain controls", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.hasControls()).toBe(true);
    });

    it("Cannot get the code of a control with negative number", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        TestSupport.assertInvalidData( () => { course.getControlCode(-1); });
    });

    it("Getting the code of start control returns start constant", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.getControlCode(0)).toEqual(Course.START);
    });

    it("Getting the code of the first control returns the first control's code", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.getControlCode(1)).toEqual("208");
    });

    it("Getting the code of the last control returns the last control's code", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.getControlCode(3)).toEqual("212");
    });

    it("Getting the control code of the finish returns null", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        expect(course.getControlCode(4)).toEqual(Course.FINISH);
    });

    it("Cannot get the code of a control with number too large", () => {
        const course = new Course("Test course", [new CourseClass("Test class", 3, [])], null, null, ["208", "227", "212"]);
        TestSupport.assertInvalidData( () => { course.getControlCode(5); });
    });

    it("Course created without controls does not contain a given leg", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const course = new Course("Test course", [courseClass], null, null, null);
        expect( !course.usesLeg("235", "212") ).toBe(true);
    });

    it("Course created with controls contains legs from each pair of consecutive controls it was created with", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(course.usesLeg(Course.START, "235")).toBe(true, "Course should use leg from start to control 1");
        expect(course.usesLeg("235", "212")).toBe(true, "Course should use leg from control 1 to 2");
        expect(course.usesLeg("212", "189")).toBe(true, "Course should use leg from control 2 to control 3");
        expect(course.usesLeg("189", Course.FINISH)).toBe(true, "Course should use leg from control 3 to the finish");
    });

    it("Course created with empty list of controls contains leg from start to finish", () => {
        const courseClass = new CourseClass("Test class", 0, []);
        const controls = [];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(course.usesLeg(Course.START, Course.FINISH)).toBe(true, "Course should use leg from start to finish");
    });

    it("Course created with empty list of controls does not contain legs with controls other than the start and finish", () => {
        const courseClass = new CourseClass("Test class", 0, []);
        const controls = [];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(!course.usesLeg(Course.START, "212")).toBe(true, "Course should use leg from start to some control");
        expect(!course.usesLeg("212", Course.FINISH)).toBe(true, "Course should use leg from some control to the finish");
        expect(!course.usesLeg("212", "189")).toBe(true,  "Course should use leg from some control to some other control");
    });

    it("Course created with controls does not contain legs that are not part of it", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(!course.usesLeg("200", "189")).toBe(true,  "Course does not use leg from control not on the course");
        expect(!course.usesLeg("212", "200")).toBe(true,  "Course does not use leg to control not on the course");
        expect(!course.usesLeg(Course.START, Course.FINISH)).toBe(true,  "Course does not use leg from start to finish");
        expect(!course.usesLeg(Course.START, "212")).toBe(true,  "Course does not use leg from the start to control 2");
        expect(!course.usesLeg("212", Course.FINISH)).toBe(true,  "Course does not use leg from control 2 to the finish");
        expect(!course.usesLeg("235", "189")).toBe(true,  "Course does not use leg from control 1 to control 3");
    });

    it("Course created with butterfly loops contains all legs despite central control being repeated", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const controls = ["235", "212", "189", "194", "212", "208", "214", "222"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        for (let i = 1; i < controls.length; i += 1) {
            expect(course.usesLeg(controls[i - 1], controls[i])).toBe(true,  "Course uses leg from control " + i + " to " + (i + 1));
        }
    });

    it("Cannot get fastest splits for a leg of a course created without legs", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const course = new Course("Test course", [courseClass], null, null, null);
        TestSupport.assertInvalidData( () => { course.getFastestSplitsForLeg("235", "212"); });
    });

    it("Cannot get fastest splits for a leg that is not part of a course", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        TestSupport.assertInvalidData( () => { course.getFastestSplitsForLeg("235", "227"); });
    });

    it("Returns empty array of fastest splits when course has no competitors", () => {
        const courseClass = new CourseClass("Test class", 3, []);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(course.getFastestSplitsForLeg("212", "189")).toEqual([]);
    });

    it("Returns single-element array of fastest splits when course has one class with two competitors", () => {
        const competitor2 = getCompetitor2();
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), competitor2]);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], 4.1, 115, controls);
        expect(course.getFastestSplitsForLeg("212", "189")).toEqual( [{name: competitor2.name, className: "Test class", split: 184}] );
    });

    it("Returns single-element array of fastest splits when course has one class with two competitors and one empty class", () => {
        const competitor2 = getCompetitor2();
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), competitor2]);
        const emptyClass = new CourseClass("Empty class", 3, []);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass, emptyClass], 4.1, 115, controls);
        expect(course.getFastestSplitsForLeg("212", "189")).toEqual( [{name: competitor2.name, className: courseClass.name, split: 184}] );
    });

    it("Returns two-element array of fastest splits when course has two classes with one competitor each", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 3, [competitor2]);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass1, courseClass2], 4.1, 115, controls);
        expect(course.getFastestSplitsForLeg("212", "189")).toEqual( [{name: competitor1.name,
                                                                          className: courseClass1.name,
                                                                          split: 212},
                                                                       {name: competitor2.name,
                                                                          className: courseClass2.name,
                                                                           split: 184}]);
    });

    it("Returns empty list of competitors when attempting to fetch competitors visiting a control in an interval when there are no course-classes", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(course.getCompetitorsAtControlInTimeRange("212", 10 * 3600, 11 * 3600)).toEqual( []);
    });

    it("Returns empty list of competitors when attempting to fetch competitors visiting a control in an interval when course has no control information", () => {
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), getCompetitor2()]);
        const course = new Course("Test course", [courseClass], null, null, null);
        expect(course.getCompetitorsAtControlInTimeRange("123", 10 * 3600, 11 * 3600)).toEqual( []);
    });

    it("Returns empty list of competitors when attempting to fetch competitors visiting a control in an interval whose code does not exist in the course", () => {
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), getCompetitor2()]);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], null, null, controls);
        expect(course.getCompetitorsAtControlInTimeRange("456", 10 * 3600, 11 * 3600)).toEqual( []);
    });

    it("Returns singleton list of competitors when attempting to fetch competitors visiting a control in an interval when the control is on the course", () => {
        const competitor2 = getCompetitor2();
        const courseClass = new CourseClass("Test class", 3, [getCompetitor1(), competitor2]);
        const controls = ["235", "212", "189"];
        const course = new Course("Test course", [courseClass], null, null, controls);
        const expectedTime = 10 * 3600 + 65 + 221;
        expect(course.getCompetitorsAtControlInTimeRange("212", expectedTime - 1, expectedTime + 1)).toEqual( [{name: competitor2.name, time: expectedTime, className: courseClass.name}]);
    });

    it("Returns list of competitors from two different classes when attempting to fetch competitors visiting a control in an interval when the control is on the course", () => {
        const competitor1 = getCompetitor1();
        const competitor2 = getCompetitor2();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 3, [competitor2]);
        const course = new Course("Test course", [courseClass1, courseClass2], null, null, ["235", "212", "189"]);
        const competitor1Time = 10 * 3600 + 30 * 60 + 81 + 197;
        const competitor2Time = 10 * 3600 + 65 + 221;
        expect(course.getCompetitorsAtControlInTimeRange("212", competitor2Time - 1, competitor1Time + 1)).toEqual(
            [{name: competitor1.name, time: competitor1Time, className: courseClass1.name},
             {name: competitor2.name, time: competitor2Time, className: courseClass2.name}]);
    });

    it("Returns singleton list of competitors from two different classes when attempting to fetch competitor times at the start for an interval", () => {
        const competitor1 = getCompetitor1();
        const courseClass1 = new CourseClass("Test class 1", 3, [competitor1]);
        const courseClass2 = new CourseClass("Test class 2", 3, [getCompetitor2()]);
        const course = new Course("Test course", [courseClass1, courseClass2], null, null, ["235", "212", "189"]);
        expect(course.getCompetitorsAtControlInTimeRange(Course.START, 10 * 3600 + 30 * 60 - 1, 10 * 3600 + 30 * 60 + 1)).toEqual(
            [{name: competitor1.name, time: 10 * 3600 + 30 * 60, className: courseClass1.name}]);
    });

    it("Returns singleton list of competitors from two different classes when attempting to fetch competitor times at the start for an interval", () => {
        const competitor2 = getCompetitor2();
        const courseClass1 = new CourseClass("Test class 1", 3, [getCompetitor1()]);
        const courseClass2 = new CourseClass("Test class 2", 3, [competitor2]);
        const course = new Course("Test course", [courseClass1, courseClass2], null, null, ["235", "212", "189"]);
        const expectedTime = 10 * 3600 + 65 + 221 + 184 + 100;
        expect(course.getCompetitorsAtControlInTimeRange(Course.FINISH, expectedTime - 1, expectedTime + 1)).toEqual(
            [{name: competitor2.name, time: expectedTime, className: courseClass2.name}]);
    });

    it("Course with no controls does not have a control", () => {
        const course = new Course("Test course", [], null, null, null);
        expect(!course.hasControl("235")).toBe(true);
    });

    it("Course with controls does not have a control not on that course", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(!course.hasControl("999")).toBe(true);
    });

    it("Course with controls does have a control on that course", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(course.hasControl("235")).toBe(true);
    });

    it("Cannot return next control on course that has no controls", () => {
        const course = new Course("Test course", [], null, null, null);
        TestSupport.assertInvalidData( () => {
            course.getNextControls("235");
        });
    });

    it("Cannot return next control after finish on course that has controls", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        TestSupport.assertInvalidData( () => {
            course.getNextControls(Course.FINISH);
        });
    });

    it("Cannot return next control after control not on course", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        TestSupport.assertInvalidData( () => {
            course.getNextControls("999");
        });
    });

    it("Can return next control after start as first control", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(course.getNextControls(Course.START)).toEqual(["235"]);
    });

    it("Can return next control after intermediate control", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(course.getNextControls("212")).toEqual(["189"]);
    });

    it("Can return next control after last control as the finish", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189"]);
        expect(course.getNextControls("189")).toEqual([Course.FINISH]);
    });

    it("Can return next control from start on course that has zero controls as the finish only", () => {
        const course = new Course("Test course", [], null, null, []);
        expect(course.getNextControls(Course.START)).toEqual([Course.FINISH]);
    });

    it("Can return next controls after intermediate control that appears more than once", () => {
        const course = new Course("Test course", [], null, null, ["235", "212", "189", "212", "197"]);
        expect(course.getNextControls("212")).toEqual(["189", "197"]);
    });
});
