/** Parse out a BOF  */
import * as cheerio from "cheerio";
import { URL } from "url";

interface BOFPDParseData {
   id: string;
   date: string;
   name: string;
   BOFLink: string;
   grade: string;
   club: string;
   clubURL: string;
   region: string;
   eventLocation: string;
   postcode: string;
   nearestTown: string;
}

let $: CheerioStatic;

/** Parse BOF fixtures 'PDA data fixtures page file */
function parseBOFPDAFile(text: string): BOFPDParseData[] {
   const fixtures: BOFPDParseData[] = [];

   $ = cheerio.load(text);

   const fixtureTableRows = $("tr");

   for (const row of fixtureTableRows.toArray()) {
      const fixture = parseRow(row);
      fixtures.push(fixture);
   }
   return fixtures;
}

/** Parse out each row of BOF PDA fixtures table.
 * each tabke row has cells with the following format

 Cell   Contents
   0   <td>Thu 21/03/19</td>
	1   <td><a href="index.php?pg=event&amp;amp;event=75551&amp;bpg=">DFOK Kent Night Cup</a></td>
	2   <td>Local</td>
	3   <td><a href="http://www.dfok.co.uk" target="_blank">DFOK</a></td>
	4   <td>SEOA</td>
	5   <td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TN16 1QG&amp;z=126">Brasted Chart</a></td>
	6   <td>Sevenoaks</td>
	7   <td><a href="http://www.streetmap.co.uk/newsearch.srf?name=TN16 1QG&amp;z=126"></a></td>
*/
function parseRow(row: CheerioElement): BOFPDParseData {
   const fixture: Partial<BOFPDParseData> = {};

   const cell = $("td", row).first();

   fixture.date = cell.text();

   cell.next();
   fixture.name = cell.text();
   const bofURL = $("a", cell).attr("href");
   fixture.BOFLink = bofURL;
   fixture.id = getUrlParam(bofURL, "event");

   cell.next();
   fixture.grade = cell.text();

   cell.next();
   fixture.club = cell.text();
   fixture.clubURL = $("a", cell).attr("href");

   cell.next();
   fixture.region = cell.text();

   cell.next();
   fixture.eventLocation = cell.text();
   const streetMapURL = $("a", cell).attr("href");
   fixture.postcode = getUrlParam(streetMapURL, "name");

   cell.next();
   fixture.nearestTown = cell.text();

   return fixture as BOFPDParseData;
}

function getUrlParam(url: string, sParam: string) {
   return new URL(url).searchParams.get(sParam);
}
