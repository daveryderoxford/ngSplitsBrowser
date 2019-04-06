import { Storage } from "@google-cloud/storage";
import * as request from "request-promise";
import { Fixture, LatLong } from "../../../../src/app/model/fixture";
import { EventGrade } from "../../../../src/app/model/oevent";
import { BOFPDParseData, BOFPDParser } from "./bof_pda_parse";
import { GT_Irish, GT_OSGB, GT_WGS84 } from "./geo_conversion";
import { LocationLookup } from "./location_lookup";

export class Fixtures {

   readonly BOFPDAURL = "https://www.britishorienteering.org.uk/event_diary_pda.php";

   GT_OSGB = new GT_OSGB();
   GT_WGS84 = new GT_WGS84();
   GT_Irish = new GT_Irish();

   constructor () { }

   /** Read BOF PDA data from URL and parse it. */
   public async processFixtures() {
      const text = await this.loadBOFPDA();

      const parser = new BOFPDParser();
      const bofFixtures = parser.parseBOFPDAFile( text );

      const fixtures = await this.makeFixtures( bofFixtures );

      await this.saveToStorage( fixtures );
   }

   /** Make fixtures arrafy for BOF fixturesd. */
   private async makeFixtures( bofFixtures: BOFPDParseData[] ): Promise<Fixture[]> {

      const locationLookup = await LocationLookup.create( bofFixtures );

      //  Create fixture array
      const fixtures: Fixture[] = bofFixtures.map( bof => {
         const fixture: Fixture = {
            id: bof.id,
            date: bof.date,
            name: bof.name,
            club: bof.club,
            clubURL: bof.clubURL,
            association: bof.region,
            nearestTown: bof.nearestTown,
            grade: this.mapGrade( bof.grade ),
            type: "Foot",
            latLong: this.getLatLong( bof.postcode, bof.gridRefStr, locationLookup ),
            postcode: this.getPostCode( bof.postcode, bof.gridRefStr, locationLookup ),
         };

         return fixture;
      } );

      return fixtures;
   }

   /** Get lat/long for the event.  If grid reference is specified then obtain lat/log from it
    * otherwise if postcode is avaialble use its lat/long */
   private getLatLong( postcode: string, gridRefStr: string, locationLookup: LocationLookup ): LatLong {
      if ( gridRefStr !== '' ) {
         this.GT_OSGB.parseGridRef( gridRefStr);
         const wgs84 = this.GT_OSGB.getWGS84();
         return { lat: wgs84.latitude, lng: wgs84.longitude };
      } else if ( postcode !== '' ) {
         const loc = locationLookup.findPostcodeLocation( postcode );
         return { lat: loc.latitude, lng: loc.longitude };
      } else {
         return null;
      }
   }

   /** if post code is specified then use it otherwise if grid reference is present look up value */
   private getPostCode( postcode: string, gridRefStr: string, locationLookup: LocationLookup ): string {
      if ( postcode !== '' ) {
         return postcode;
      } else if ( gridRefStr !== '' ) {
        return locationLookup.findGridrefLocation(gridRefStr).postcode;
      } else {
         return '';
      }
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
         default:
            throw new Error( "Unexpected bof grade encountered" );
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


