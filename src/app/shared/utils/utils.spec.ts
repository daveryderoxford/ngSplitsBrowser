import { Utils } from './utils';

const a1 = {
   p1: 1,
   p2: 2,
   p3: "xx"
};

const b1 = {
   p1: 1,
   p2: 2,
   p3: "xx"
};

const c1 = {
   p1: 1,
   p2: 2,
   p3: "xx"
};

let arr1 = [];
let result = [];


function initliseArrays(): void {
   arr1 = [ a1, b1, c1 ];
}
describe( "Utils", () => {

   it( "Should return empty array if all conatin identical properties", () => {
      initliseArrays();
      result = Utils.removeDuplicates( arr1 );
      expect( result.length ).toEqual( 0 );
   } );

   it( "Should return remove two duplicates leaving 1", () => {
      initliseArrays();
      arr1[ 1 ].p2 = "fred";

      result = Utils.removeDuplicates( arr1 );
      expect( result.length ).toEqual( 2 );
      expect( result[ 0 ].toBe( b1 ) );
   } );

   it( "Should return remove two duplicates leaving 1", () => {
      initliseArrays();
      arr1[ 0 ].p2 = "fred";
      arr1[ 1 ].p1 = 1;
      arr1[ 2 ].p3 = true;

      result = Utils.removeDuplicates( arr1 );
      expect( result.length ).toEqual( 2 );
      expect( result[ 0 ].toBe( b1 ) );
   } );

} );



