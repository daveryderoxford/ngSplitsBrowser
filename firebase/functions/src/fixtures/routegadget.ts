
import { LatLng } from "@googlemaps/google-maps-services-js";
import * as request from "request-promise";

type RGFormat = 'a' | 'b';
type RGType = 'I' | 'N' | 'R' | 'L' | 'T';


export interface RGMap {
   eventid: string;
   mapid: string;
   name: string;
   URL: string;
}

interface RGEventRaw {
   id: string;
   mapid: string;
   format: RGFormat;
   name: string;
   date: string;
   club: string;
   type: RGType;
   comment: string;
   locked: boolean;
   courses: [];
   suffix: string;
   A: string;
   B: string;
   C: string;
   D: string;
   E: string;
   F: string;

}

const RGClubs = ['aire', 'sn'];

class RGEvent {
   id: string;
   mapid: string;
   name: string;
   date: string;
   club: string;
   mapFilename: string;
   worldFile: Worldfile;

   constructor ( raw: RGEventRaw ) {
      this.id = raw.id;
      this.mapid = raw.mapid;
      this.name = raw.name;
      this.club = raw.club;
      this.date = raw.date;
      this.mapFilename = raw.mapid + '.' + (raw.suffix ?? 'jpg');
      this.worldFile = new Worldfile( raw );
   }
}

function RGBaseURL( club: string ) {
   return "https://www." + club.toLowerCase() + ".routegadget.co.uk"
}

const skippedAreaWords = ['forest', 'wood', 'woods', 'common', 'heath', 'moor', 'moors', 'park', 'woods', 'valley', 'edge', 'country', 'hill', 'hills', 'university', 'town', 'city',
   'north', 'south', 'east', 'west', 'northeast', 'northwest', 'southeast', 'southwest', 'tbc', 'tba'];

export class Routegadget {
   clubs: Map< string, RGEvent[] > = new Map();

   constructor () { }

   async initialise( clubs?: string[]) {

      if ( !clubs ) {
         clubs = RGClubs;
      }

      for ( const club of clubs ) {
         const data = await this._readClubRouteGadgetEvents( club );
         this.clubs.set( club.toLowerCase(), data) ; 
      }
   }

   public findRoutemadgetMapByName( area: string, club: string ): RGMap[] {

      const clubLower = club.toLowerCase();

      const events = this.clubs.get( clubLower );

      const areaWords = area.toLowerCase().trim().split( " " ).filter( word => {
         return !skippedAreaWords.includes( word ) && word.length > 2;
      } );

     // console.log( "Routgadget area:  " + area + "  Words: " + areaWords.toString());

      const maps = events.filter( event => {
         const ok = areaWords.some( word => event.name.toLowerCase().includes( word ) );
         return ok;
      } ).map( event => {
         const url = RGBaseURL( clubLower ) + "/kartat/" + event.mapFilename;
         return { eventid: event.id, mapid: event.mapid, name: event.name, URL: url }
      } );

      console.log( "Routgadget maps:  " + JSON.stringify(maps) );

      return maps;
   }

   /** Returns URLs */
   findRoutemadgetMapByLocation( latlong: LatLng ): RGMap[] {
      // TODO
      return [];
   }

   private async _readClubRouteGadgetEvents( club: string ): Promise<RGEvent[]> {

      const url = RGBaseURL( club ) + "/rg2/rg2api.php?type=events";

      console.log( url );

      const jsonStr = await request( url, { method: "get" } );
      const json = JSON.parse( jsonStr );

      const rawEvents: RGEventRaw[] = json?.data?.events;

      console.log( "Routgadget: Read Routegadget events. URL:" + url + "   Number of events:" + rawEvents.length );

      return rawEvents.map( raw => new RGEvent( raw ) );
   }
}

export class Worldfile {

   public valid: boolean;

   private xCorrection: number;
   private yCorrection: number;
   private AEDB: number;
   A: number;
   B: number;
   C: number;
   D: number;
   E: number;
   F: number;


   constructor ( wf: { A: string; B: string; C: string; D: string; E: string; F: string; } ) {

      if ( wf.A === undefined ) {
         this.valid = false;
         this.A = 0;
         this.B = 0;
         this.C = 0;
         this.D = 0;
         this.E = 0;
         this.F = 0;
      } else {
         this.A = parseFloat( wf.A );
         this.B = parseFloat( wf.B );
         this.C = parseFloat( wf.C );
         this.D = parseFloat( wf.D );
         this.E = parseFloat( wf.E );
         this.F = parseFloat( wf.F );
         this.valid = true;
         // helps make later calculations easier
         this.AEDB = ( this.A * this.E ) - ( this.D * this.B );
         this.xCorrection = ( this.B * this.F ) - ( this.E * this.C );
         this.yCorrection = ( this.D * this.C ) - ( this.A * this.F );
      }
   }

   getX( lng, lat ) {
      return Math.round( ( ( this.E * lng ) - ( this.B * lat ) + this.xCorrection ) / this.AEDB );
   }

   // use worldfile to generate y value
   getY( lng, lat ) {
      return Math.round( ( ( -1 * this.D * lng ) + ( this.A * lat ) + this.yCorrection ) / this.AEDB );
   }

   // use worldfile to generate longitude
   getLon( x, y ) {
      return ( this.A * x ) + ( this.B * y ) + this.C;
   }

   // use worldfile to generate latitude
   getLat( x, y ) {
      return ( this.D * x ) + ( this.E * y ) + this.F;
   }

};
