import * as request from "request-promise";

 require( 'request-debug' )( request );

export interface Location {
   latitude: number;
   longitude: number;
   eastings: number;
   northings: number;
   postcode: string;
}

export interface LatLong {
   latitude: number;
   longitude: number;
}

/** Uses https://api.postcodes.io/ service to map  postcodes to lat/long */
export class PostCodeLookup {
   public async postcodeToLocation( postcodes: string[] ): Promise<Location[]> {

      const data = { postcodes: postcodes };

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude,eastings,northings", data, );

      const locations = this.mapResult( response.result );

      return locations;
   }

   /** Uses https://api.postcodes.io/ service to map lat/longs to postcodes */
   public async gridRefToPostcode( latLongs: LatLong[] ): Promise<Location[]> {

      const data = { geolocations: latLongs };

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude,eastings,northings", data );

      const locations = this.mapResult( response.result );

      return locations;
   }

   /** Maps result object to location object */
   private mapResult( results: any[] ): Location[] {
      return results.map( res => {
          const loc: Location = {
            postcode: res.result.postcode,
            latitude: res.result.latitude,
            longitude: res.result.longitude,
            eastings: res.result.eastings,
            northings: res.result.northings
         };
         return loc;
      } );
   }

   private async makeRequest( method: string, inputObject: any ): Promise<any> {
      const options: request.RequestPromiseOptions = {
         method: "POST",
         body: JSON.stringify( inputObject ),
         headers: {
            'Content-Type': 'application/json '
         },
      };

      let outObject: any = null;

      try {
         const result = await request( "https://api.postcodes.io/" + method, options );

         outObject = JSON.parse(result);

         if ( outObject.status !== 200 ) {
            throw new Error( 'Postcode request return code not 200.  Value: ' + outObject.status + '  ' + outObject.error );
         }

      } catch ( e ) {
         console.log( "PostCodeLookup: Error making HTTP request:  " + e );
         throw e;
      }
      return outObject;
   }
}
