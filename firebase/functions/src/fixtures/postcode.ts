import * as request from "request-promise";

// require( 'request-debug' )( request );

export interface Location {
   latitude: number;
   longitude: number;
   postcode: string;
}

export interface LatLongPostCodeIO {
   latitude: number;
   longitude: number;
}

/** Uses https://api.postcodes.io/ service to map  postcodes to lat/long */
export class PostCodeLookup {
   public async postcodeToLocation( postcodes: string[] ): Promise<Location[]> {

      const data = { postcodes: postcodes };

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude", data );

      const locations = response.result.map( res => {
         const loc: Location = {
            postcode: res.query.postcode,
            latitude: res.result.latitude,
            longitude: res.result.longitude
         };
         return loc;
      } );

      return locations;
   }

   /** Uses https://api.postcodes.io/ service to map lat/longs to postcodes */
   public async latLongToPostcode( latLongs: LatLongPostCodeIO[], maxReturned: number = 1 ): Promise<Location[]> {

      const array = latLongs.map( l => {
         return { latitude: l.latitude, longitude: l.longitude, limit: maxReturned };
      } );

      const data = { geolocations: array };

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude", data );

      const locations = response.result.map( res => {
         const loc: Location = {
            latitude: res.query.latitude,
            longitude: res.query.longitude,
            postcode: res.results[0].postcode,
         };
         return loc;
      } );

      return locations;
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

         outObject = JSON.parse( result );

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
