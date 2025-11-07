import { isNaNStrict } from "../model/results_util.js";

// Minimum length of a course that is considered to be given in metres as
// opposed to kilometres.
const MIN_COURSE_LENGTH_METRES = 500;

/**
* Parses a course length.
*
* This can be specified as a decimal number of kilometres or metres, with
* either a full stop or a comma as the decimal separator.
*
* @param {String} stringValue - The course length to parse, as a string.
* @return {?Number} The parsed course length, or null if not valid.
*/
export function parseCourseLength(stringValue: string): number | null {
    let courseLength = parseFloat(stringValue.replace(",", "."));
    if (!isFinite(courseLength)) {
        return null;
    }

    if (courseLength >= MIN_COURSE_LENGTH_METRES) {
        courseLength /= 1000;
    }

    return courseLength;
}

/**
* Parses a course climb, specified as a whole number of metres.
*
* @param {String} stringValue - The course climb to parse, as a string.
* @return {?Number} The parsed course climb, or null if not valid.
*/
export function parseCourseClimb(stringValue: string): number | null {
    const courseClimb = parseInt(stringValue, 10);
    if (isNaNStrict(courseClimb)) {
        return null;
    } else {
        return courseClimb;
    }
}

/**
* Normalise line endings so that all lines end with LF, instead of
* CRLF or CR.
* @sparam {String} stringValue - The string value to normalise line endings
*     within
* @return {String} String value with the line-endings normalised.
*/
export function normaliseLineEndings(stringValue: string): string {
    return stringValue.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
   * Returns whether the given value is undefined.
   * @param {any} value The value to check.
   * @return {Boolean} True if the value is undefined, false otherwise.
   */
export function isUndefined( value: any ): boolean {
    return typeof value === "undefined";
}

export function range(length: number) {
    return Array.from(Array(length).keys())
}
