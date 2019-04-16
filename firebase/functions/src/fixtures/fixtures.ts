import { Storage } from "@google-cloud/storage";
import * as request from "request-promise";
import { Fixture, LatLong } from "../../../../src/app/model/fixture";
import { EventGrade } from "../../../../src/app/model/oevent";
import { BOFPDParseData, BOFPDParser } from "./bof_pda_parse";
import { GT_OSGB } from "./geo_conversion";
import { LatLong as LatLongPIO, PostCodeLookup } from "./postcode";

export class Fixtures {
   readonly BOFPDAURL =
      "https://www.britishorienteering.org.uk/event_diary_pda.php";

   lookup = new PostCodeLookup();

   constructor () { }

   /** Read BOF PDA data from URL and parse it. */
   public async processFixtures() {
      const text = await this.loadBOFPDA();

      const parser = new BOFPDParser();
      const bofFixtures = parser.parseBOFPDAFile( text );

      const fixtures = await this.makeFixtures( bofFixtures );

      await this.saveToStorage( fixtures );
   }

   /** Make fixtures array for BOF fixturesd. */
   private async makeFixtures( bofFixtures: BOFPDParseData[] ): Promise<Fixture[]> {

      //  Create fixture array
      const fixtures: Partial<Fixture>[] = bofFixtures.map( bof => {
         const fixture: Partial<Fixture> = {
            id: bof.id,
            date: bof.date,
            name: bof.name,
            club: bof.club,
            clubURL: bof.clubURL,
            area: bof.area,
            association: bof.region,
            nearestTown: bof.nearestTown,
            grade: this.mapGrade( bof.grade ),
            type: "Foot"
         };

         return fixture;
      } );

      this.calcPostCodes( fixtures, bofFixtures );
      this.calcLatLongs( fixtures, bofFixtures );

      return fixtures as Fixture[];
   }

   /** Sets Fixture postcodes for bof data for all values, calculating from latlong where necessary */
   async calcPostCodes( fixtures: Partial<Fixture>[], bofFixtures: BOFPDParseData[] ) {
      const latlongsToCalc: LatLongPIO[] = [];
      const fixturesToCalc: Partial<Fixture>[] = [];

      // Set postcodes for ones avalible from BOF data and identify ones that need to be calculated using postcode.io
      for ( let i = 0; i < fixtures.length; i++ ) {
         if ( bofFixtures[ i ].postcode !== "" ) {
            fixtures[ i ].postcode = bofFixtures[ i ].postcode;
         } else if ( bofFixtures[ i ].gridRefStr !== "" ) {
            const loc = this.osgbToLatLong( bofFixtures[ i ].gridRefStr );
            latlongsToCalc.push( loc );
            fixturesToCalc.push( fixtures[ i ] );
         }
      }

      const postcodes = await this.lookup.latLongToPostcode( latlongsToCalc );

      for ( let i = 0; i < postcodes.length; i++ ) {
         fixturesToCalc[ i ].postcode = postcodes[ i ];
      }
   }

   /** Sets Fixture latlong for bof data for all values, calculating from postcode where necessary */
   async calcLatLongs( fixtures: Partial<Fixture>[], bofFixtures: BOFPDParseData[] ) {
      const postcodesToCalc: string[] = [];
      const fixtuersToCalc: Partial<Fixture>[] = [];

      // Set latlongs for ones avalible from BOF data and identify ones that need to be calculated using postcode.io
      for ( let i = 0; i < fixtures.length; i++ ) {
         if ( bofFixtures[ i ].gridRefStr !== "" ) {
            fixtures[ i ].latLong = this.osgbToLatLong( bofFixtures[ i ].gridRefStr );
         } else if ( bofFixtures[ i ].postcode !== "" ) {
            postcodesToCalc.push( bofFixtures[ i ].postcode );
            fixtuersToCalc.push( fixtures[ i ] );
         }
      }

      const locations = await this.lookup.postcodeToLocation( postcodesToCalc );

      for ( let i = 0; i < locations.length; i++ ) {
         fixtuersToCalc[ i ].latLong = locations[ i ];
      }
   }

   private osgbToLatLong( gridRefStr: string ): LatLong {
      const osgb = new GT_OSGB();
      osgb.parseGridRef( gridRefStr );
      const wgs84 = osgb.getWGS84();
      return { lat: wgs84.latitude, lng: wgs84.longitude };
   }

   private mapGrade( bofGrade: string ): EventGrade {
      switch ( bofGrade ) {
         case "Activity":
            return "Local";
         case "Local":
            return "Club";
         case "Regional":
            return "Regional";
         case "National":
            return "National";
         case "Major":
            return "International";
         case "International":
            return "International";
         default:
            throw new Error( "Fixtures: Unexpected bof grade encountered: " + bofGrade);
      }
   }

   /** Save fixtures JSON file to Google Storage */
   async saveToStorage( fixtures: Fixture[] ): Promise<void> {
      const storage = new Storage();
      const bucket = storage.bucket( process.env.GCLOUD_STORAGE_BUCKET );

      const filename = "./fixtures/uk";

      const file = bucket.file( filename );

      try {
         await file.save( JSON.stringify( fixtures ) );
      } catch ( e ) {
         console.log( "Fixtures: Error saving fixtures to clould storage: " + e );
         throw e;
      }
   }

   async loadBOFPDA(): Promise<string> {
      let response: string;
      try {
         response = await request( this.BOFPDAURL, { method: "get" } );
      } catch ( e ) {
         console.log( "Fixtures: Error making HTTP request: " + e );
         throw e;
      }
      return response;
   }
}
