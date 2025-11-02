/**
 * Utility function used with filters that simply returns the object given.
 * @sb-param x - Any input value
 * @sb-returns The input value.
 */
export function isTrue(x: any): any {
    return x;
}

/**
* Utility function that returns whether a value is not null.
* @sb-param x - Any input value.
* @sb-returns True if the value is not null, false otherwise.
*/
export function isNotNull(x: any): boolean {
    return x !== null;
}

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
export function isNaNStrict(x: any): boolean {
    return x !== x;
}

/**
* Returns whether the value given is neither null nor NaN.
* @sb-param {?Number} x - A value to test.
* @sb-return {boolean} false if the value given is null or NaN, true
*     otherwise.
*/
export function isNotNullNorNaN(x: any): boolean {
    return x !== null && x !== undefined && x === x;
}
