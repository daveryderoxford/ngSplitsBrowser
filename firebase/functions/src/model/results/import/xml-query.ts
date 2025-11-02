import { Cheerio, Element } from 'cheerio';

/**
 * This type alias represents either a jQuery object on the client
 * or a Cheerio selection on the server. Since their APIs for what we
 * are using (.find, .attr, .text) are identical, we can use one type.
 *
 * We use Cheerio's types as the canonical definition because they are well-defined
 * for server-side use. jQuery's objects are structurally compatible, so
 * TypeScript will allow this to work in both environments.
 */
export type XmlQuery = Cheerio<Element>;
export type XmlElement = Element;
