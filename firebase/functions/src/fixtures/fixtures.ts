import { Storage } from "@google-cloud/storage";
import * as request from "request-promise";
import { Fixture, SBPoint } from "../../../../src/app/model/fixture";
import { EventGrade } from "../../../../src/app/model/oevent";
import { BOFPDParseData, BOFPDParser } from "./bof_pda_parse";
import { PostCodeLookup, Location } from "./postcode";
import { GT_OSGB, GT_WGS84, GT_Irish } from "./geo_conversion";

class Fixtures {
   readonly BOFPDAURL =
      "https://www.britishorienteering.org.uk/event_diary_pda.php";


   constructor() {}

   // Read BOF PAD data form URL and parse it.

   async processFixtures() {
      const text = await this.loadBOFPDA();

      const parser = new BOFPDParser();
      const bofFixtures = parser.parseBOFPDAFile(text);

      const fixtures = await this.makeFixtures(bofFixtures);

      await this.saveToStorage(fixtures);
   }

   /** Make fixtures arrafy for BOF fixturesd. */
   async makeFixtures(bofFixtures: BOFPDParseData[]): Promise<Fixture[]> {

      const locationLookup = await new LocationLookup(bofFixtures);

      //  Create fixture array
      const fixtures: Fixture[] = bofFixtures.map(bof => {
         const fixture: Fixture = {
            id: bof.id,
            date: bof.date,
            name: bof.name,
            club: bof.club,
            clubURL: bof.clubURL,
            association: bof.region,
            nearestTown: bof.nearestTown,
            grade: this.mapGrade(bof.grade),
            type: "Foot",
            gridReference: this.getGridRef( bof.postcode, bof.gridRefStr,  locationLookup ),
            latLong: this.getLatLong( bof.postcode, bof.gridRefStr,  locationLookup ),
            postcode: 
         };

         return fixture;
      });

      //   gridReference: SBPoint;
      //   latLong ? : SBPoint;
      //    postcode

      return fixtures;
   }

   /** If grid reference is specified then obtain lat log from it otherwise use postcode */
   getGridRef( postcode: string, gridRefStr: string,  locationLookup: LocationLookup): SBPoint {
      if (gridRefStr !== '') {
         return gridRefStr;
      } else if (postcode !== '') {
         const loc = locationLookup.findPostcodeLocation(postcode);
         //change format 

      } else {
         return '';
      }
   }

   /** if grid reference is specified then obtain lat log from it otherwise use postcode */
   getLatLong( postcode: string, gridRefStr: string,  locationLookup: LocationLookup ): SBPoint {
      
   }

    /** if post code is specified then use it otherwise if grid reference is present look up value */
    getPostCode( postcode: string, gridRefStr: string, locationLookup: LocationLookup ): string {
       if (postcode !== '') {
          return postcode;
       } else if (gridRefStr !== '') {
      //    return locationLookup.find(  loc => loc.gridRefStr === loc.)
       } else {
          return '';
       }
   }

   mapGrade(bofGrade: string): EventGrade {
      switch (bofGrade) {
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
            throw new Error("Unexpected bof grade encountered");
      }
   }

   /** Save fixtures Json file to Google Storage */
   async saveToStorage(fixtures: Fixture[]): Promise<void> {
      const storage = new Storage();
      const bucket = storage.bucket(process.env.GCLOUD_STORAGE_BUCKET);

      const filename = "./fixtures/uk";

      const file = bucket.file(filename);

      try {
         await file.save(JSON.stringify(fixtures));
      } catch (e) {
         console.log("Fixtures: Error saving fixtures to clould storage: " + e);
         throw e;
      }
   }

   async loadBOFPDA(): Promise<string> {
      let response: string;
      try {
         response = await request(this.BOFPDAURL, { method: "get" });
      } catch (e) {
         console.log("Fixtures: Error making HTTP request: " + e);
         throw e;
      }
      return response;
   }
}

/** Looks up postcode/grid ref/latlong mapping using postcode.io and provides APIs to search results  */
class LocationLookup {

   lookup = new PostCodeLookup();

   postcodeLocations: Location [];
   latlongLocations: Location[];

   async constructor(bofFixtures: BOFPDParseData[]) {

      const requiredPostcodes = bofFixtures
         .filter(c => c.gridRefStr === "")
         .filter(c => c.postcode !== "")
         .map(c => c.postcode);

      this.postcodeLocations = await this.lookup.postcodeToLocation( requiredPostcodes );

      const requiredLatLogs = bofFixtures
         .filter(c => c.postcode === "")
         .filter(c => c.gridRefStr !== "")
         .map(c => c.gridRefStr)
         .map(g => {
            const grid = new GT_OSGB();
            grid.parseGridRef(g);
            const wgs = grid.getWGS84();
            return { latitude: wgs.latitude, longitude: wgs.longitude };
         });

      this.latlongLocations = await this.lookup.gridRefToPostcode(requiredLatLogs);

   }

   findPostcodeLocation(postcode: string): Location {
      return this.postcodeLocations.find( loc => loc.postcode === postcode );
   }

   findGridrefLocation(gridRef: string): Location {

   }

}
