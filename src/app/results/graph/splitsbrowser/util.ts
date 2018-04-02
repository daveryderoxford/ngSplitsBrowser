
// Minimum length of a course that is considered to be given in metres as
// opposed to kilometres.
const MIN_COURSE_LENGTH_METRES = 500;


/**
 * Utility function used with filters that simply returns the object given.
 * @sb-param x - Any input value
 * @sb-returns The input value.
 */
export function isTrue(x: any): any {
    return x;
};

/**
* Utility function that returns whether a value is not null.
* @sb-param x - Any input value.
* @sb-returns True if the value is not null, false otherwise.
*/
export function isNotNull(x: any): boolean {
    return x !== null;
};

/**
* Returns whether the value given is the numeric value NaN.
*
* This differs from the JavaScript built-in function isNaN, in that isNaN
* attempts to convert the value to a number first, with non-numeric strings
* being converted to NaN.  So isNaN("abc") will be true, even though "abc"
* isn't NaN.  This function only returns true if you actually pass it NaN,
* rather than any value that fails to convert to a number.
*
* @sb-param {Any} x - Any input value.
* @sb-return True if x is NaN, false if x is any other value.
*/
export function isNaNStrict(x): boolean {
    return x !== x;
};

/**
* Returns whether the value given is neither null nor NaN.
* @sb-param {?Number} x - A value to test.
* @sb-return {boolean} false if the value given is null or NaN, true
*     otherwise.
*/
export function isNotNullNorNaN(x): boolean {
    return x !== null && x === x;
};

class GException {
    protected name: string;

    constructor(protected message: string) {
        this.message = message;
    }

    public toString(): string {
        return this.name + ": " + this.message;
    };
}

export class InvalidData extends GException {

    constructor(message: string) {
        super(message);
        this.name = "InvalidData";
    }
}

export class WrongFileFormat extends GException {

    constructor(message) {
        super(message);
        this.name = "WrongFileFormat";
    }
}

/**
* Parses a course length.
*
* This can be specified as a decimal number of kilometres or metres, with
* either a full stop or a comma as the decimal separator.
*
* @sb-param {String} stringValue - The course length to parse, as a string.
* @sb-return {?Number} The parsed course length, or null if not valid.
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
};

/**
* Parses a course climb, specified as a whole number of metres.
*
* @sb-param {String} stringValue - The course climb to parse, as a string.
* @sb-return {?Number} The parsed course climb, or null if not valid.
*/
export function parseCourseClimb(stringValue: string): number | null {
    const courseClimb = parseInt(stringValue, 10);
    if (isNaNStrict(courseClimb)) {
        return null;
    } else {
        return courseClimb;
    }
};

/**
* Normalise line endings so that all lines end with LF, instead of
* CRLF or CR.
* @sb-param {String} stringValue - The string value to normalise line endings
*     within
* @sb-return {String} String value with the line-endings normalised.
*/
export function normaliseLineEndings(stringValue: string): string {
    return stringValue.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
};
