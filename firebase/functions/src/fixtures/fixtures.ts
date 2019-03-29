import { Storage } from "@google-cloud/storage";
import * as request from "request-promise";
import { Fixture } from "../../../../src/app/model/fixture";
import { EventGrade } from "../../../../src/app/model/oevent";
import { BOFPDParseData, BOFPDParser } from "./bof_pda_parse";
import { PostCodeLookup } from "./postcode";
import { GT_OSGB, GT_WGS84, GT_Irish} from "./geo_conversion";

class Fixtures {

   readonly BOFPDAURL = "https://www.britishorienteering.org.uk/event_diary_pda.php";

   lookup = new PostCodeLookup();

   constructor () { }

   // Read BOF PAD data form URL and parse it.

   async processFixtures() {

      const text = await this.loadBOFPDA();

      const parser = new BOFPDParser();
      const bofFixtures = parser.parseBOFPDAFile( text );

      const fixtures = await this.makeFixtures( bofFixtures );

      await this.saveToStorage( fixtures );

   }

   /** Make fixtures arrafy for BOF fixturesd. */
   async makeFixtures( bofFixtures: BOFPDParseData[] ): Promise<Fixture[]> {

      //  Create fixture array
      const fixtures: Fixture[] = bofFixtures.map( ( bof ) => {

         const fixture: Fixture = {
            id: bof.id,
            date: bof.date,
            name: bof.name,
            club: bof.club,
            clubURL: bof.clubURL,
            association: bof.region,
            postcode: bof.postcode,
            nearestTown: bof.nearestTown,
            grade: this.mapGrade( bof.grade ),
            type: "Foot"
         };

         return fixture;
      } );


      const requiredPostcodes = bofFixtures.filter( c => c.gridRefStr === '')
                                             .filter( c => c.postcode !== '' )
                                            .map( c => c.postcode);

      const postcodeLocations = await this.lookup.postcodeToLocation(requiredPostcodes);

// To do ac

      const requiredLatLogs = bofFixtures.filter( c => c.postcode === '' )
                                          .filter( c => c.gridRefStr !== '' )
                                          .map( c => c.gridRefStr)
                                          .map( g => {
                                          //   new GT_OSGB.;
                                          });

    //  const Locations = await this.lookup.postcodeToLocation( requiredLatLogs );



      //   gridReference: SBPoint;
      //   latLong ? : SBPoint;
      //    postcode

      return fixtures;
   }

   mapGrade( bofGrade: string ): EventGrade {

      switch ( bofGrade ) {
         case 'Activity': return "Local";
         case "Local": return "Club";
         case 'Regional': return "Regional";
         case 'National': return "National";
         case 'Major': return "International";
         default: throw new Error( "Unexpected bof grade encountered" );
      }
   }

   /** Save fixtures Json file to Google Storage */
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
