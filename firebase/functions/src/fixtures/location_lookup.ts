import { BOFPDParseData } from "./bof_pda_parse";
import { GT_OSGB } from "./geo_conversion";
import { Location, PostCodeLookup } from "./postcode";

/** Looks up postcode/grid ref/latlong mapping using postcode.io and provides APIs to search results  */
export class LocationLookup {
   lookup = new PostCodeLookup();
   postcodeLocations: Location[];
   latlongLocations: Location[];

   static async create( bofFixtures: BOFPDParseData[] ): Promise<LocationLookup> {
      const ret = new LocationLookup();
      await ret.setBOFFixtures( bofFixtures );
      return ret;
   }

   private constructor () { }

   private async setBOFFixtures( bofFixtures: BOFPDParseData[] ) {

      const requiredPostcodes = bofFixtures
         .filter( c => c.gridRefStr === "" )
         .filter( c => c.postcode !== "" )
         .map( c => c.postcode );

      this.postcodeLocations = await this.lookup.postcodeToLocation( requiredPostcodes );

      const requiredLatLogs = bofFixtures
         .filter( c => c.postcode === "" )
         .filter( c => c.gridRefStr !== "" )
         .map( c => c.gridRefStr )
         .map( g => {
            const osgb = new GT_OSGB();
            osgb.parseGridRef( g );
            const wgs = osgb.getWGS84();
            return { latitude: wgs.latitude, longitude: wgs.longitude };
         } );

      this.latlongLocations = await this.lookup.latlongToPostcode( requiredLatLogs );
   }

   public findPostcodeLocation( postcode: string ): Location {
      return this.postcodeLocations.find( loc => loc.postcode === postcode );
   }

   public findLatLongLocation( gridRef: string ): Location {
      const osgb = new GT_OSGB();
      osgb.parseGridRef( gridRef );
      return this.latlongLocations.find( loc => loc.lat - osgb.eastings)) < 1000 &&
                                               (Math.abs(loc.northings - osgb.northings)) < 1000. );
   }
}
