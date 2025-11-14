import { Cheerio, CheerioAPI, load as cheerioLoad } from 'cheerio';
import type { Element } from 'domhandler';
import { InvalidData } from '../model/exception.js';

/**
 * Localises (most) differences between JQuery used for XML parsing in the client 
 * and Cheerio used for XML parsing on the server.
 */
export type XmlDoc = CheerioAPI;
export type XmlQuery = Cheerio<Element>;
export type XmlElement = Element;

/**
* Parses the given XML string and returns the parsed XML.
* @param xmlString - The XML string to parse.
* @returns The parsed XML document.
*/
export function parseXml(xmlString: string): XmlDoc {
   let doc: XmlDoc;
   try {
      doc = cheerioLoad(xmlString, {
         xml: {
            xmlMode: true, // Enable htmlparser2's XML mode.
            decodeEntities: true, // Decode HTML entities.
            withStartIndices: false, // Add a `startIndex` property to nodes.
            withEndIndices: false, // Add an `endIndex` property to nodes.
            lowerCaseTags: false,
         }
});
   } catch (e) {
      throw new InvalidData("XML data not well-formed");
   }

   if (doc.root().children().length === 0) {
      // PhantomJS doesn't always fail parsing invalid XML; we may be
      // left with 'xml' just containing the DOCTYPE and no root element.
      throw new InvalidData("XML data not well-formed: " + xmlString);
   }

   return doc;
}

export function queryElement(element: XmlElement, doc: XmlDoc): XmlQuery {
   return doc(element);
}
