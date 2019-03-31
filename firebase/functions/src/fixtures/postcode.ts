import * as request from "request-promise";

// require( 'request-debug' )( request );

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

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude,eastings,northings", data );

      const locations = response.result.map( res => this.makeLocation( res.result ) );

      return locations;
   }

   /** Uses https://api.postcodes.io/ service to map lat/longs to postcodes */
   public async gridRefToPostcode( latLongs: LatLong[], maxReturned: number = 1 ): Promise<Location[]> {

      const array = latLongs.map( l =>  {
         return { latitude: l.latitude, longitude: l.longitude, limit: maxReturned };
      });

      const data = { geolocations: array};

      const response = await this.makeRequest( "postcodes?filter=postcode,longitude,latitude,eastings,northings", data );

      const locations = response.result.map( res => this.makeLocation( res.result[ 0 ] ) );

      return locations;
   }

   /** Maps result object to location object */
   private makeLocation( data: any ): Location {
      const loc: Location = {
         postcode: data.postcode,
         latitude: data.latitude,
         longitude: data.longitude,
         eastings: data.eastings,
         northings: data.northings
      };
      return loc;
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
