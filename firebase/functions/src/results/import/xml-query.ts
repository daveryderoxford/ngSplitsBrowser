import { Cheerio, CheerioAPI, load as cheerioLoad } from 'cheerio';
import type { Element } from 'domhandler';
import { InvalidData } from '../model/exception.js';

/**
 * This type alias represents either a jQuery object on the client
 * or a Cheerio selection on the server. Since their APIs for what we
 * are using (.find, .attr, .text) are identical, we can use one type.
 *
 * We use Cheerio's types as the canonical definition because they are well-defined
 * for server-side use. jQuery's objects are structurally compatible, so
 * TypeScript will allow this to work in both environments.
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
