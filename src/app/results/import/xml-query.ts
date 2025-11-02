//import { Cheerio, Element } from 'cheerio';
import $ from 'jquery';
/**
 * This type alias represents either a jQuery object on the client
 * or a Cheerio selection on the server. Since their APIs for what we
 * are using (.find, .attr, .text) are identical, we can use one type.
 */
//export type XmlQuery = Cheerio<Element>;
//export type XmlElement = Element;

export type XmlQuery = JQuery<Element>
export type XmlElement = HTMLElement;