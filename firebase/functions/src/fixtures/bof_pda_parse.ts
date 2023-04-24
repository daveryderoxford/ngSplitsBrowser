/** Parse out a BOF  PDA data fixtures data (https://www.britishorienteering.org.uk/event_diary_pda.php) */
import * as cheerio from "cheerio";
import { CipherOCBOptions } from "crypto";
import { URL } from "url";

export type BOFLevel = 'Activity' | 'Local' | 'Regional' | 'National' | 'Major' | "International";

export interface BOFPDParseData {
   id: string;
   date: string;
   name: string;
   BOFLink: string;
   grade: BOFLevel;
   club: string;
   clubURL: string;
   region: string;
   area: string;
   postcode: string;
   nearestTown: string;
   gridRefStr: string;
}
export class BOFPDParser {
   // tslint:disable:radix

   $: cheerio.Root;

   /** Parse BOF fixtures 'PDA data fixtures page file */
   public parseBOFPDAFile( text: string ): BOFPDParseData[] {
      const fixtures: BOFPDParseData[] = [];

      this.$ = cheerio.load( text );

      const fixtureTableRows = this.$( "tr" ).toArray();

      // Skip the header row
      fixtureTableRows.shift();

      for ( const row of fixtureTableRows ) {
         const fixture = this.parseRow( row );
         fixtures.push( fixture );
      }

      return fixtures;
   }

   /** Parse out each row of BOF PDA fixtures table.
    * each table row has cells with the following format

    Cell   Title  Example Contents
      0    Date        <td>Sun 24/03/19</td>
      1    Event Name  <td><a href="index.php?pg=event&amp;amp;event=72446&amp;bpg=">SROC Red Rose Classic</a></td>
      2    Level       <td>National</td>
      3    Club        <td><a href="http://www.sroc.org" target="_blank">SROC</a></td>
      4    Ass         <td>NWOA</td>
      5    Venue       <td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">Hampsfell</a></td>
      6    Near Town   <td>Grange over Sands</td>
      7    Grid Ref    <td><a href="http://www.streetmap.co.uk/newsearch.srf?name=SD393805&amp;z=126">SD393805</a></td>
   */
   private parseRow( row: cheerio.Element ): BOFPDParseData {
      const fixture: Partial<BOFPDParseData> = {};

      const cells = this.$( "td", row ).toArray();

      try {

         fixture.date = this.parseDate( this.text( cells[0] ) ).toISOString();

         fixture.name = this.text( cells[1] );
         const bofURL = this.href( cells[1] );
         fixture.BOFLink = bofURL;
         fixture.id = this.getId( bofURL);

         fixture.grade = this.text( cells[2] ) as BOFLevel;

         fixture.club = this.text( cells[3] );
         fixture.clubURL = this.href( cells[3] );

         fixture.region = this.text( cells[4] );

         fixture.area = this.text( cells[5] );
         const streetMapURL = this.href( cells[5] );
         // Row may contain a grid reference or a postcode.  We differentate by checking for valid postcode.
         fixture.postcode = this.processPostCode( streetMapURL );

         fixture.nearestTown = this.text( cells[6] );

         fixture.gridRefStr = this.text( cells[7] );

      } catch ( e ) {
         console.log( 'BOFPDParser: Error processing row ' + this.$(row).text() + '\n' + e );
         throw ( e );
      }

      return fixture as BOFPDParseData;
   }

   /** The id parameter may either be an a event or activity id */
   private getId( bofURL: string): string {

      const eventId = this.urlParam( bofURL, "amp;event" );
      const activityId = this.urlParam( bofURL, "amp;activity" );

      if ( eventId ) {
         return ( "bof-" + eventId );
      } else if (activityId) {
         return ( "bof-activity" + activityId );
      } else {
         console.error("BOFPDAPasrser: Could not parse id for event from URL" + bofURL); 
         return ("Unknown");
      }
   }

   private text( el: cheerio.Element ): string {
      return this.$(el).text();
   }

   private href( el: cheerio.Element ): string {
      return this.$( "a", this.$( el ) ).attr( "href" );
   }

   private urlParam( urlStr: string, sParam: string ) {
      const url = new URL( urlStr, 'https://www.britishorienteering.org.uk/' );
      let t = url.searchParams.get( sParam );
      if (!t) {
         t = '';
      }
      return t;
   }

   /** Extract the postcode from the location url.
    * The fiield may contain a either a grid referenceor postcode.
    * post code will be returned if avaalible.  Otherwise empty string.
   */
   private processPostCode( urlStr: string ): string  {
      const param = this.urlParam( urlStr, "name" );

      if ( !this.validPostcode( param ) ) {
         return '';
      } else {
         return param;
      }
   }

   private validPostcode( postcode: string ): boolean {
      postcode = postcode.replace( /\s/g, "" );
      const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;
      return regex.test( postcode );
   }

   /** Parse a date in the format ddd dd/mm/yy  eg Thu 21/03/19 and retuns a date in UTC with zero hours */
   private parseDate( dateStr: string ): Date {
      const day = parseInt( dateStr.substring( 4, 6 ) );
      const month = parseInt( dateStr.substring( 7, 9 ) );
      let year = parseInt( dateStr.substring( 10, 12 ) );
      if ( year < 50 ) {
         year = year + 2000;
      } else {
         year = year + 1900;
      }

      return new Date( Date.UTC( year, month - 1, day ) );
   }
}
