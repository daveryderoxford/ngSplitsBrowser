
// Results imnput parser.

import { WrongFileFormat } from '../exception.js';
import { Results } from '../results.js';
import { parseTripleColumnEventData } from "./alternative-cvs-reader.js";
import { parseCSVEventData } from "./cvs-reader.js";
import { parseHTMLEventData } from "./html-reader.js";
import { parseIOFXMLEventData } from "./iof-xml-reader.js";
import { parseOEEventData } from "./oe-reader.js";

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
* as an Results object if successful, or throws a WrongFileFormat excepotion 
* if no parser was found.
* @sb-param {String} data - String containing text file.
* @sb-return {Results} Results data.   
* Throws WrongFileFormat exception if the file format was not recogmised 
*/
export function parseEventData(data: string): Results {
   for (const parser of PARSERS) {
      try {
         return parser(data);
      } catch (e) {
         if (e instanceof Error && e.name !== "WrongFileFormat") {
            throw e;
         }
      }
   }

   throw new WrongFileFormat("File format not recognised");
}
