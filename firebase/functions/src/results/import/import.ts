
// Results imnput parser.

import { WrongFileFormat } from '../model/exception.js';
import { Results } from '../model/results.js';
import { parseIOFXMLEventData } from "./server-iof-xml-reader.js";

// All the parsers for parsing event data that are known about.
const PARSERS = [
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
