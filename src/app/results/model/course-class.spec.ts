/*
 *  SplitsBrowser - CourseClass tests.
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
import { describe, expect } from "vitest";
import { TestSupport } from "../test-support.spec";
import { Competitor } from "./competitor";
import { CourseClass } from "./course-class";

const fromOriginalCumTimes = Competitor.fromOriginalCumTimes;
const fromSplitTimes = TestSupport.fromSplitTimes;

describe("Course-class", () => {

  function getCompetitor1(): Competitor {
    return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
  }

  function getCompetitor1WithNullSplitForControl3(): Competitor {
    return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, null, 106]);
  }

  function getCompetitor1WithNaNSplitForControl3(): Competitor {
    const competitor = fromOriginalCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 - 30, 81 + 197 + 212 + 106]);
    competitor.setRepairedCumulativeTimes([0, 81, 81 + 197, NaN, 81 + 197 + 212 + 106]);
    return competitor;
  }

  function getCompetitor2(): Competitor {
    return fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 100]);
  }

  function getCompetitor2WithNullSplitForControl3(): Competitor {
    return fromSplitTimes(2, "John Smith", "ABC", 10 * 3600, [65, 221, null, 100]);
  }

  function getTestClass(): CourseClass {
    return new CourseClass("Test class name", 3, [getCompetitor1(), getCompetitor2()]);
  }

  it("Empty course-class is empty", () => {
    const courseClass = new CourseClass("Test class name", 3, []);
    expect(courseClass.isEmpty, "Empty course-class should be empty").toBe(true);
  });

  it("Non-empty course-class is not empty", () => {
    const courseClass = new CourseClass("Test class name", 3, [getCompetitor1()]);
    expect(!courseClass.isEmpty, "Non-empty course-class should not be empty").toBe(true);
  });

  it("Course-class initially created without any competitor data considered as dubious", () => {
    const courseClass = getTestClass();
    expect(!courseClass.hasDubiousData, "Original-data option should not be availabl").toBe(true);
  });

  it("Course-class that has recorded that it has dubious data reports itself as so", () => {
    const courseClass = getTestClass();
    courseClass.recordHasDubiousData();
    expect(courseClass.hasDubiousData, "Original-data option should be available").toBe(true);
  });

  it("Creating a class with competitors sets the class name in each competitor", () => {
    const competitor1 = getCompetitor1();
    const competitor2 = getCompetitor2();
    const courseClass = new CourseClass("Test class name", 3, [competitor1, competitor2]);
    expect(competitor1.courseClass.name).toEqual(courseClass.name);
    expect(competitor2.courseClass.name).toEqual(courseClass.name);
  });

  it("Can return fastest split for a control", () => {
    const competitor2 = getCompetitor2();
    const courseClass = new CourseClass("Test class name", 3, [getCompetitor1(), competitor2]);
    expect(courseClass.getFastestSplitTo(3)).toEqual({ name: competitor2.name, split: 184 });
  });

  it("Can return fastest split for the finish control", () => {
    const competitor2 = getCompetitor2();
    const courseClass = new CourseClass("Test class name", 3, [getCompetitor1(), competitor2]);
    expect(courseClass.getFastestSplitTo(4)).toEqual({ name: competitor2.name, split: 100 });
  });

  it("Can return fastest split for a control ignoring null times", () => {
    const competitor1 = getCompetitor1();
    const courseClass = new CourseClass("Test class name", 3, [competitor1, getCompetitor2WithNullSplitForControl3()]);
    expect(courseClass.getFastestSplitTo(3)).toEqual({ name: competitor1.name, split: 212 });
  });

  it("Can return fastest split for a control ignoring NaN times", () => {
    const competitor2 = getCompetitor2();
    const courseClass = new CourseClass("Test class name", 3, [getCompetitor1WithNaNSplitForControl3(), competitor2]);
    expect(courseClass.getFastestSplitTo(3)).toEqual({ name: competitor2.name, split: 184 });
  });

  it("Returns null fastest split for a control that all competitors mispunched", () => {
    const courseClass = new CourseClass("Test class name", 3, [getCompetitor1WithNullSplitForControl3(), getCompetitor2WithNullSplitForControl3()]);
    expect(courseClass.getFastestSplitTo(3)).toEqual(null);
  });

  it("Returns null fastest split for a control in empty course-class", () => {
    const courseClass = new CourseClass("Test class name", 3, []);
    expect(courseClass.getFastestSplitTo(3)).toEqual(null);
  });

  it("Cannot return fastest split to control 0", () => {
    TestSupport.assertInvalidData(function () { getTestClass().getFastestSplitTo(0); });
  });

  it("Cannot return fastest split to control too large", () => {
    TestSupport.assertInvalidData(function () { getTestClass().getFastestSplitTo(5); });
  });

  it("Cannot return competitors visiting a control in an interval if the control number is NaN", () => {
    TestSupport.assertInvalidData(function () { getTestClass().getCompetitorsAtControlInTimeRange(NaN, 10 * 3600, 12 * 3600); });
  });

  it("Cannot return competitors visiting a control in an interval if the control number is negative", () => {
    TestSupport.assertInvalidData(function () { getTestClass().getCompetitorsAtControlInTimeRange(-1, 10 * 3600, 12 * 3600); });
  });

  it("Cannot return competitors visiting a control in an interval if the control number is too large", () => {
    const courseClass = getTestClass();
    TestSupport.assertInvalidData(function () { getTestClass().getCompetitorsAtControlInTimeRange(courseClass.numControls + 2, 10 * 3600, 12 * 3600); });
  });

  it("Can return competitors visiting the start in an interval including only one competitor", () => {
    const courseClass = getTestClass();
    const comp2 = courseClass.competitors[1];
    expect(courseClass.getCompetitorsAtControlInTimeRange(0, 10 * 3600 - 1, 10 * 3600 + 1)).toEqual([{ name: comp2.name, time: 10 * 3600 }]);
  });

  it("Can return both competitors visiting the start in an interval including both competitors", () => {
    expect(getTestClass().getCompetitorsAtControlInTimeRange(0, 10 * 3600 - 1, 10 * 3600 + 30 * 60 + 1).length).toEqual(2);
  });

  it("Can return one competitor visiting control 2 when time interval surrounds the time the competitor visited that control", () => {
    const expectedTime = 10 * 3600 + 30 * 60 + 81 + 197;
    const courseClass = getTestClass();
    const comp1 = courseClass.competitors[0];
    expect(courseClass.getCompetitorsAtControlInTimeRange(2, expectedTime - 1, expectedTime + 1)).toEqual([{ name: comp1.name, time: expectedTime }]);
  });

  it("Can return one competitor visiting control 2 when time interval starts at the time the competitor visited that control", () => {
    const expectedTime = 10 * 3600 + 30 * 60 + 81 + 197;
    const courseClass = getTestClass();
    const comp1 = courseClass.competitors[0];
    expect(courseClass.getCompetitorsAtControlInTimeRange(2, expectedTime, expectedTime + 2)).toEqual([{ name: comp1.name, time: expectedTime }]);
  });

  it("Can return one competitor visiting control 2 when time interval ends at the time the competitor visited that control", () => {
    const expectedTime = 10 * 3600 + 30 * 60 + 81 + 197;
    const courseClass = getTestClass();
    const comp1 = courseClass.competitors[0];
    expect(courseClass.getCompetitorsAtControlInTimeRange(2, expectedTime - 2, expectedTime)).toEqual([{ name: comp1.name, time: expectedTime }]);
  });

  it("Can return empty list of competitors visiting the finish if the time interval doesn't include any of their finishing times", () => {
    const courseClass = getTestClass();
    expect(courseClass.getCompetitorsAtControlInTimeRange(4, 10 * 3600 - 2, 10 * 3600 - 1)).toEqual([]);
  });

  it("Can determine time-loss data for valid competitors in course-class", () => {
    const courseClass = getTestClass();
    courseClass.determineTimeLosses();
    courseClass.competitors.forEach(function (comp) {
      [1, 2, 3, 4].forEach(function (controlIdx) {
        expect(comp.getTimeLossAt(controlIdx) !== null, "Time-loss for competitor '" + comp.name + "' at control '" + controlIdx + "' should not be null").toBe(true);
      });
    });
  });

  it("Can determine as all-null time-loss data for course-class with two competitors mispunching the same control", () => {
    const courseClass = new CourseClass("Test class", 3, [getCompetitor1WithNullSplitForControl3(), getCompetitor2WithNullSplitForControl3()]);
    courseClass.determineTimeLosses();
    courseClass.competitors.forEach(function (comp) {
      [1, 2, 3, 4].forEach(function (controlIdx) {
        expect(comp.getTimeLossAt(controlIdx), "Time-loss for competitor '" + comp.name + "' at control '" + controlIdx + "' should be null").toEqual(null);
      });
    });
  });
});
