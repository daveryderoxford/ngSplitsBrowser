import { isNaNStrict } from "./util";

export type sbTime = number;

export class TimeUtilities {

    private static NULL_TIME_PLACEHOLDER = "-----";

    /**
    * Formats a time period given as a number of seconds as a string in the form [-][h:]mm:ss.ss .
    * @sb-param {Number} seconds - The number of seconds.
    * @sb-param {?Number} precision - Optional number of decimal places to format using, or the default if not specified.
    * @sb-returns {string} The string formatting of the time.
    */
    static formatTime(seconds: number, precision?: number): string {

        if (seconds === null) {
            return TimeUtilities.NULL_TIME_PLACEHOLDER;
        } else if (isNaNStrict(seconds)) {
            return "???";
        }

        let result = "";
        if (seconds < 0) {
            result = "-";
            seconds = -seconds;
        }

        const hours = Math.floor(seconds / (60 * 60));
        const mins = Math.floor(seconds / 60) % 60;
        const secs = seconds % 60;
        if (hours > 0) {
            result += hours.toString() + ":";
        }

        if (mins < 10) {
            result += "0";
        }

        result += mins + ":";

        if (secs < 10) {
            result += "0";
        }

        if (typeof precision === "number") {
            result += secs.toFixed(precision);
        } else {
            result += Math.round(secs * 100) / 100;
        }

        return result;
    };

    /**
    * Parse a time of the form MM:SS or H:MM:SS into a number of seconds.
    * @sb-param {string} time - The time of the form MM:SS.
    * @sb-return {?Number} The number of seconds.
    */
    static parseTime(timeStr: string): number | null {
        timeStr = timeStr.trim();
        if (/^(\d+:)?\d+:\d\d([,.]\d+)?$/.test(timeStr)) {
            const timeParts = timeStr.replace(",", ".").split(":");
            let totalTime = 0;
            timeParts.forEach(function (timePart) {
                totalTime = totalTime * 60 + parseFloat(timePart);
            });
            return totalTime;
        } else {
            // Assume anything unrecognised is a missed split.
            return null;
        }
    };
}
