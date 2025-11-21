import $ from 'jquery';

// Type for a jQuery object representing a collection of HTML elements.
export type HtmlQuery = JQuery<HTMLElement>;

// Type for a single HTML element.
export type HtmlElement = HTMLElement;

/**
 * Parses the given HTML string and returns a jQuery object representing the parsed HTML.
 * @param htmlString - The HTML string to parse.
 * @returns A jQuery object representing the parsed HTML elements.
 */
export function parseHtml(htmlString: string): HtmlQuery {
   // Clean up the HTML string to remove problematic unicode before parsing.
   const cleanHtml = htmlString.replace(/\\u0026nbsp;/g, ' ').trim();
   // Use the browser's DOMParser to create a full HTML document.
   const parser = new DOMParser();
   const doc = parser.parseFromString(cleanHtml, "text/html");
   // Wrap the document's root element with jQuery to allow for querying.
   return $(doc.documentElement);
}

export function queryElement(element: HtmlElement): HtmlQuery {
   return $(element);
}