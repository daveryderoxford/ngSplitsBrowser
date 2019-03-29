"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Parse out a BOF  PDA data fixtures data */
var cheerio = require("cheerio");
var url_1 = require("url");
var $;
/** Parse BOF fixtures 'PDA data fixtures page file */
function parseBOFPDAFile(text) {
    var fixtures = [];
    $ = cheerio.load(text);
    var fixtureTableRows = $("tr");
    for (var _i = 0, _a = fixtureTableRows.toArray(); _i < _a.length; _i++) {
        var row = _a[_i];
        var fixture = parseRow(row);
        fixtures.push(fixture);
    }
    return fixtures;
}
exports.parseBOFPDAFile = parseBOFPDAFile;
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
function parseRow(row) {
    var fixture = {};
    var cell = $("td", row).first();
    fixture.date = parseDate(cell.text()).toISOString();
    cell.next();
    fixture.name = cell.text();
    var bofURL = $("a", cell).attr("href");
    fixture.BOFLink = bofURL;
    fixture.id = getUrlParam(bofURL, "event");
    cell.next();
    fixture.grade = cell.text();
    cell.next();
    fixture.club = cell.text();
    fixture.clubURL = $("a", cell).attr("href");
    cell.next();
    fixture.region = cell.text();
    // Row may contain a grid reference or a postcode.  We differentate by
    cell.next();
    fixture.eventLocation = cell.text();
    var streetMapURL = $("a", cell).attr("href");
    fixture.postcode = getUrlParam(streetMapURL, "name");
    cell.next();
    fixture.nearestTown = cell.text();
    return fixture;
}
function getUrlParam(url, sParam) {
    return new url_1.URL(url).searchParams.get(sParam);
}
// tslint:disable:radix
/** Parse a date in the format ddd dd/mm/yy  eg Thu 21/03/19*/
function parseDate(dateStr) {
    var day = parseInt(dateStr.substring(4, 6));
    var month = parseInt(dateStr.substring(7, 9));
    var year = parseInt(dateStr.substring(10, 12));
    if (year < 50) {
        year = year + 2000;
    }
    else {
        year = year + 1900;
    }
    return new Date(year, month - 1, day);
}
//# sourceMappingURL=fixtures.js.map