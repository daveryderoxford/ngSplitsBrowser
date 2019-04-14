import { Storage } from "@google-cloud/storage";
import * as request from "request-promise";
import { Fixture, LatLong } from "../../../../src/app/model/fixture";
import { EventGrade } from "../../../../src/app/model/oevent";
import { BOFPDParseData, BOFPDParser } from "./bof_pda_parse";
import { GT_Irish, GT_OSGB, GT_WGS84 } from "./geo_conversion";
import { LocationLookup } from "./location_lookup";
import { PostCodeLookup, LatLongPostCodeIO } from "./postcode";

export class Fixtures {
   readonly BOFPDAURL =
      "https://www.britishorienteering.org.uk/event_diary_pda.php";

   lookup = new PostCodeLookup();

   constructor() {}

   /** Read BOF PDA data from URL and parse it. */
   public async processFixtures() {
      const text = await this.loadBOFPDA();

      const parser = new BOFPDParser();
      const bofFixtures = parser.parseBOFPDAFile(text);

      const fixtures = await this.makeFixtures(bofFixtures);

      await this.saveToStorage(fixtures);
   }

   /** Make fixtures arrafy for BOF fixturesd. */
   private async makeFixtures(
      bofFixtures: BOFPDParseData[]
   ): Promise<Fixture[]> {
      const locationLookup = await LocationLookup.create(bofFixtures);

      //  Create fixture array
      const fixtures: Partial<Fixture>[] = bofFixtures.map(bof => {
         const fixture: Partial<Fixture> = {
            id: bof.id,
            date: bof.date,
            name: bof.name,
            club: bof.club,
            clubURL: bof.clubURL,
            association: bof.region,
            nearestTown: bof.nearestTown,
            grade: this.mapGrade(bof.grade),
            type: "Foot"
         };

         return fixture;
      });

      this.calcPostCodes( fixtures, bofFixtures);
      this.calcLatLongs( fixtures, bofFixtures);


      return fixtures as Fixture[];
   }

   /** Sets Fixture postcodes from BOF PDA data calaculating the postcode from the OSGB if it is not avalaible */

   async calcPostCodes(fixtures: Partial<Fixture>[], bofFixtures: BOFPDParseData[]) {
      const latlongsToCalc: LatLongPostCodeIO[] = [];
      const fixtuersToCalc: Partial<Fixture>[] = [];

      // Set lat longs for ones avalible from BOF data and add one to calculate to an array
      for (let i = 0; i < fixtures.length; i++) {
         if (bofFixtures[i].postcode !== "") {
            fixtures[i].postcode = bofFixtures[i].postcode;
         } else if (bofFixtures[i].gridRefStr !== "") {
            const loc = this.osgbToLatLong(bofFixtures[i].gridRefStr);
            latlongsToCalc.push( { latitude: loc.lat, longitude: loc.lng });
            fixtuersToCalc.push(fixtures[i]);
         }
      }

      const postcodes = await this.lookup.latLongToPostcode(latlongsToCalc);

      for (let i = 0; i < postcodes.length; i++) {
         fixtuersToCalc[i].postcode = loc.postcode[i];
      }

   }

   /** Sets Fixture latlogs from ones avalaible from BOF PDA data calaculate from postcode otherwise */
   async calcLatLongs(fixtures: Partial<Fixture>[], bofFixtures: BOFPDParseData[]) {
      const postcodesToCalc: string[] = [];
      const fixtuersToCalc: Partial<Fixture>[] = [];

      // Set lat longs for ones avalible from BOF data and add one to calculate to an array
      for (let i = 0; i < fixtures.length; i++) {
         if (bofFixtures[i].gridRefStr !== "") {
            fixtures[i].latLong = this.osgbToLatLong(bofFixtures[i].gridRefStr);
         } else if (bofFixtures[i].postcode !== "") {
            postcodesToCalc.push(bofFixtures[i].postcode);
            fixtuersToCalc.push(fixtures[i]);
         }
      }

      const locations = await this.lookup.postcodeToLocation(postcodesToCalc);

      for (let i = 0; i < locations.length; i++) {
         const loc = locations[i];
         fixtuersToCalc[i].latLong = { lat: loc.latitude, lng: loc.longitude };
      }
   }

   private osgbToLatLong(gridRefStr: string): LatLong {
      const osgb = new GT_OSGB();
      osgb.parseGridRef(gridRefStr);
      const wgs84 = osgb.getWGS84();
      return { lat: wgs84.latitude, lng: wgs84.longitude };
   }

   private mapGrade(bofGrade: string): EventGrade {
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

   /** Save fixtures JSON file to Google Storage */
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
