/*
 *  SplitsBrowser - Utilities to assist with testing.
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

import { } from "jasmine";
import 'jasmine-expect';
import $ from 'jquery';
import { Competitor, sbTime } from "./model";
import { isNaNStrict } from "./model/results_util";

export class TestSupport {
    /**
    * Asserts that calling the given function throws an exception with the
    * given name.
    *
    * The function given is called with no arguments.
    *
    * @param {String} exceptionName - The name of the exception to expect.
    * @param {Function} func - The function to call.
    * @param {String} failureMessage - Optional message to show in assertion
    *     failure message if no exception is thrown.  A default message is used
    *     instead if this is not specified.
    */
    static assertException(exceptionName: string, func: any, failureMessage?: string) {
        try {
            func();
            expect(false).toBeTrue(failureMessage || "An exception with name '" + exceptionName + "' should have been thrown, but no exception was thrown");
        } catch (e: any) {
            expect(e.name).toEqual(exceptionName, "Exception with name '" + exceptionName + "' should have been thrown, message was " + e.message);
        }
    }

    /**
    * Asserts that calling the given function throws an InvalidData exception.
    *
    * The function given is called with no arguments.
    *
    * @param {Function} func - The function to call.
    * @param {String} failureMessage - Optional message to show in assertion
    *     failure message if no exception is thrown.  A default message is used
    *     instead if this is not specified.
    */
    static assertInvalidData(func: any, failureMessage?: string) {
        TestSupport.assertException("InvalidData", func, failureMessage);
    }

    /**
    * Asserts that two arrays of numbers have the same length and the
    * corresponding elements are strict-equal to one another.  This function
    * assumes NaN to be equal to itself.
    * @param {Array} actualArray - The 'actual' array of numbers.
    * @param {Array} expectedArray - The 'expected' array of numbers.
    */
    static assertStrictEqualArrays(actualArray: number[], expectedArray: number[]) {
        expect($.isArray(actualArray)).toBeTrue("actualArray is not an array");
        expect($.isArray(expectedArray)).toBeTrue("expectedArray is not an array");
        expect(actualArray.length).toEqual(expectedArray.length,
            "Lengths should be the same: expected " + expectedArray.length + ", actual " + actualArray.length);

        for (let index = 0; index < expectedArray.length; index += 1) {
            if (isNaNStrict(expectedArray[index])) {
                expect(isNaNStrict(actualArray[index]))
                    .toBeTrue("Expected array has NaN at index " + index + " so actual array should do too.  Actual value " + actualArray[index]);
            } else {
                expect(actualArray[index])
                    .toEqual(expectedArray[index], "Array values at index " + index + " should be strict-equal");
            }
        }
    }

    /**
    * Returns the sum of two numbers, or null if either is null.
    * @param {?Number} a - One number, or null, to add.
    * @param {?Number} b - The other number, or null, to add.
    * @return {?Number} null if at least one of a or b is null,
    *      otherwise a + b.
    */
    private static addIfNotNull(a?: number, b?: number): number | null {
        return (a === null || b === null) ? null : (a + b);
    }

    /**
        * Convert an array of split times into an array of cumulative times.
        * If any null splits are given, all cumulative splits from that time
        * onwards are null also.
        *
        * The returned array of cumulative split times includes a zero value for
        * cumulative time at the start.
        * @param {Array} splitTimes - Array of split times.
        * @return {Array} Corresponding array of cumulative split times.
        */
    static cumTimesFromSplitTimes(splitTimes: sbTime[]): sbTime[] {

        const cumTimes = [0];
        for (let i = 0; i < splitTimes.length; i++) {
            cumTimes.push(TestSupport.addIfNotNull(cumTimes[i], splitTimes[i]));
        }
        return cumTimes;
    }

    /**
    * Convenience method to create a competitor from split times.
    *
    * This method has been moved out of Competitor because it is no longer used,
    * by SplitsBrowser itself, but has been retained as it is used by plenty of
    * tests.
    *
    * @param {Number} order - The position of the competitor within the list of results.
    * @param {String} name - The name of the competitor.
    * @param {String} club - The name of the competitor's club.
    * @param {Number} startTime - The competitor's start time, as seconds past midnight.
    * @param {Array} splitTimes - Array of split times, as numbers, with nulls for missed controls.
    * @return {Competitor} Created competitor.
    */
    static fromSplitTimes(order: number,
        name: string,
        club: string,
        startTime: sbTime,
        splitTimes: sbTime[]): Competitor {

        const cumTimes = TestSupport.cumTimesFromSplitTimes(splitTimes);

        const competitor = new Competitor(order, name, club, startTime, splitTimes, cumTimes);
        competitor.splitTimes = splitTimes;
        competitor.cumTimes = cumTimes;

        return competitor;
    }
}
