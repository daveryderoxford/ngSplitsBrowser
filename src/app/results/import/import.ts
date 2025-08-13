
// Results imnput parser.

import { Results, WrongFileFormat } from "../model";
import { parseTripleColumnEventData } from "./alternative-cvs-reader";
import { parseCSVEventData } from "./cvs-reader";
import { parseHTMLEventData } from "./html-reader";
import { parseIOFXMLEventData } from "./iof-xml-reader";
import { parseOEEventData } from "./oe-reader";

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
