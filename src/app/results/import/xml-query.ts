import $ from 'jquery';
import { InvalidData } from '../model';

export type XmlDoc = JQuery<XMLDocument | Document>;
export type XmlQuery = JQuery<Element>;
export type XmlElement = HTMLElement;

/**
* Parses the given XML string and returns the parsed XML.
* @param xmlString - The XML string to parse.
* @returns The parsed XML document, wrapped in a jQuery object.
*/
export function parseXml(xmlString: string): XmlDoc {
   let xml: XMLDocument;
   try {
      xml = $.parseXML(xmlString);
   } catch (e) {
      throw new InvalidData("XML data not well-formed");
   }

   if ($(xml).find("> *").length === 0) {
      // PhantomJS doesn't always fail parsing invalid XML; we may be
      // left with 'xml' just containing the DOCTYPE and no root element.
      throw new InvalidData("XML data not well-formed: " + xmlString);
   }

   return $(xml);
}

export function queryElement(element: XmlElement): XmlQuery {
   return $(element);
}
