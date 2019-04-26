import * as request from "request-promise";
// require( 'request-debug' )( request );

export interface LatLong {
   lat: number;
   lng: number;
}

/** Uses https://api.postcodes.io/ service to map  postcodes to lat/long */
export class PostCodeLookup {

   BATCH_SIZE = 100;

   public async postcodeToLocation( postcodes: string[] ): Promise<LatLong[]> {

      let locations: LatLong[] = [];
      const inputArray = postcodes.slice(); // Clone array as processing batches consumes it

      //  loop over batchs of BATCH_SIZE as postcodes.io limited to 100 items
      while ( inputArray.length ) {

         const batch = inputArray.splice( 0, this.BATCH_SIZE ); // splice consmes BATCH_SIZE elements

         const postData = { postcodes: batch };
         const response = await this.httpRequest( "postcodes?filter=longitude,latitude", postData );

         const result = response.result.map( res => {
            if ( !res.result ||  res.result.latitude === null) {
               // console.log( "Postcode: Failed to convert postcode " + res.query );
               return null;
            }
            const loc: LatLong = {
               lat: res.result.latitude,
               lng: res.result.longitude
            };
            return loc;
         } );

         locations = locations.concat( result );
      }
      return locations;
   }

   /** Uses https://api.postcodes.io/ service to map lat/longs to postcodes */
   public async latLongToPostcode( latLongs: LatLong[], maxReturned = 1, searchRadius = 1000 ): Promise<string[]> {

      let locations: string[] = [];

      const inputArray = latLongs.map( l => {
         return { latitude: l.lat, longitude: l.lng, limit: maxReturned, radius: searchRadius };
      } );

      //  loop over batchs of BATCH_SIZE as postcodes.io limited to 100 items
      while ( inputArray.length ) {

         const batch = inputArray.splice( 0, this.BATCH_SIZE ); // splice consmes BATCH_SIZE elements

         const postData = { geolocations: batch };
         const response = await this.httpRequest( "postcodes?filter=postcode", postData );

         const result = response.result.map( res => {
            if ( !res.result || res.result.length === 0 ) {
              // console.log( "Postcode: Failed to convert latlong  " +
               //   res.query.latitude.toString() + " " + res.query.longitude.toString() );
               return "";
            } else {
               return res.result[ 0 ].postcode;
            }
         } );
         locations = locations.concat( result );
      }

      return locations;
   }

   private async httpRequest( method: string, inputObject: any ): Promise<any> {
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
