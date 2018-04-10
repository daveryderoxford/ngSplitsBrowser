
// Results imnput parser.

import { parseIOFXMLEventData } from "./iof-xml-reader";
import { parseOEEventData } from "./oe-reader";
import { parseCSVEventData } from "./cvs-reader";
import { parseHTMLEventData } from "./html-reader";
import { parseTripleColumnEventData } from "./alternative-cvs-reader";
import { Results } from "../model";

// All the parsers for parsing event data that are known about.
const PARSERS = [
    parseCSVEventData,
    parseOEEventData,
    parseHTMLEventData,
    parseTripleColumnEventData,
    parseIOFXMLEventData
];

/**
* Attempts to parse the given event data, which may be of any of the
* supported formats, or may be invalid.  This function returns the results
* as an Event object if successful, or null in the event of failure.
* @sb-param {String} data - The data read.
* @sb-return {OEvent} Event data read in, or null for failure.
*/
export function parseEventData(data: string): Results | null {
    for (let i = 0; i < PARSERS.length; i += 1) {
        const parser = PARSERS[i];
        try {
            return parser(data);
        } catch (e) {
            if (e.name !== "WrongFileFormat") {
                throw e;
            }
        }
    }

    // If we get here, none of the parsers succeeded.
    return null;
};
