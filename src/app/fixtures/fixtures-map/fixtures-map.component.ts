import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fixture, SBPoint } from 'app/model/fixture';

import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Polygon from 'ol/geom/Polygon';
import Select from 'ol/interaction/Select';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import Projection from 'ol/proj/Projection';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';

@Component( {
   selector: 'app-fixtures-map',
   templateUrl: './fixtures-map.component.html',
   styleUrls: [ './fixtures-map.component.scss' ]
} )
/** Map of fixtures */
export class FixturesMapComponent implements OnInit {

   @Input() set fixtures( fixtures: Fixture[] ) {
      this.createFixtureFeatures( fixtures );
   }

   @Input() set selectedFixture( selected: Fixture ) {
      this.selectFixture( selected );
   }

   @Input() set homeLatLong( home: SBPoint ) {
      this.setHomeLocation( home );
   }

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   map: Map;

   fixturesLayer: VectorLayer; // Layer containing fixture circles
   homeLayer: VectorLayer;  // Layer containing home location with concentric circles
   osmMapLayer: TileLayer; // Base OSM tile map layer

   features = new Array<Feature>(); // Features displayed on fxtures
   selection: Select;  // Selected features

   private readonly DisplayProjection = new Projection( "EPSG:4326" );
   private readonly OpenLayersProjection = new Projection( "EPSG:900913" );

   constructor () {
      // OpenLayers.ImgPath = "http://js.mapbox.com/theme/dark/"

   }

   ngOnInit() {
      /* Layers */
      this.homeLayer = this.createHomeLayer();
      this.osmMapLayer = this.createOSMMapLayer();
      this.fixturesLayer = this.createFixtureLayer();

      const MaxExtend = 20037508.34;

      /*  this.map = new Map( "map",
           {
              maxExtent: new Extent( -1 * b, -1 * b, b, b ),
              maxResolution: 156543.0399,
              units: 'm',
              projection: this.EPSG900913, // Open layers projection
              displayProjection: this.EPSG4326  // WGS84 Projection
           } ); */

      const londonLonLat = [ -0.118092, 51.509865];

      this.map = new Map( {
         target: 'map',
         layers: [ this.osmMapLayer ],
         view: new View( {
            projection: "EPSG:3857",
            maxZoom: 50,
            minZoom: 7,
            zoom: 10,
            center: fromLonLat( londonLonLat),
       //     extent: theRestrictedExtent

         } ),
      } );

      const defaultLatLong: SBPoint = { x: 51.502, y: -0.133 };  // Default long/lat in london
      //   this.setHomeLocation( defaultLatLong );

      this.selection = new Select( {
         layers: [ this.fixturesLayer ],
         // style: {
         //    stroke: { width: 4 }
         //   }
      } );

      this.map.addInteraction( this.selection );

      this.selection.on( 'select', ( feat: Feature ) => {
         this.fixtureSelected.emit( feat.get( 'Fixture' ) );
      } );
   }

   private createFixtureFeatures( fixtures: Fixture[] ) {

      const source = new VectorSource();

      return;

      for ( const fixture of fixtures ) {

         const point = new Point( fixture.latLong.x, fixture.latLong.y ).transform( this.DisplayProjection, this.OpenLayersProjection );

         const feature = new Feature ( {
          //  geometery:
           // style:
         }

         );

         feature.set( 'fixture', fixture );

         const weeks = ( new Date( fixture.date ).valueOf() - new Date().valueOf() ) / ( 7 * 24 * 60 * 60 * 1000 );
     //    feature.attributes.fillColor = this.getColour( weeks );

         const MaxNumberedWeeks = 5;
         const MinRadius = 6;

         if ( weeks <= MaxNumberedWeeks ) {
      //      feature.attributes.pointRadius = MinRadius + ( MaxNumberedWeeks - weeks );
     //       feature.attributes.label = weeks + 1;
         } else {
     //       feature.attributes.pointRadius = MinRadius;
    //        feature.attributes.label = "";
         }

         feature.zOrder = 1000 - weeks;

         source.addFeature( feature );
      }
      this.fixturesLayer.setSource( source );
   }

   private getColour( weeks_ahead: number ) {
      if ( weeks_ahead < 1 ) { return "#ff0000"; }
      if ( weeks_ahead < 2 ) { return "#ff8800"; }
      if ( weeks_ahead < 3 ) { return "#ffff00"; }
      if ( weeks_ahead < 4 ) { return "#00ff00"; }
      if ( weeks_ahead < 5 ) { return "#0088ff"; }
      if ( weeks_ahead < 6 ) { return "#8800ff"; }
      return "#666666";
   }

   private setHomeLocation( home: SBPoint ) {

      const source = new VectorSource();

      const center = new Point( home.x, home.y ).transform( this.DisplayProjection, this.OpenLayersProjection );

      /*    const radiusFactor = 1 / Math.cos( home.x * ( Math.PI / 180 ) );

          const circle1 = new Vector( Polygon.createRegularPolygon( center, 50000.0 * radiusFactor, 100, 0 ) );

          const circle2 = new Vector( Polygon.createRegularPolygon( center, 100000.0 * radiusFactor, 100, 0 ) );

          const circle3 = new Vector( Polygon.createRegularPolygon( center, 150000.0 * radiusFactor, 100, 0 ) ); */


      for (const radius of [ 50000.0, 100000.0, 150000.0] ) {
         const feat = new Feature();
    //     feat.setGeometry ( Polygon.circular( center, radius ) );
     //    source.addFeature( feat );
      }

      this.homeLayer.setSource( source );

      this.map.getView().setCenter( fromLonLat(center), 8 );

   }

   /** Select a given fixture centring the map on the feature */
   private selectFixture( selected: Fixture ) {
      for ( const feature of this.features ) {

         if ( feature.get( 'Fixture' ) === selected ) {
            const p = { x: feature.geometry.x, y: feature.geometry.y };
            this.map.moveTo( p );
            break;
         }
      }
   }

   private createOSMMapLayer(): TileLayer {

      const layer = new TileLayer( {
         source: new OSM(),
         opacity: 0.7,
       //  zIndex: 2,
      } );

      return layer;

   }

   private createHomeLayer(): VectorLayer {

      const layer = new VectorLayer( {
         opacity: 0.1,
         zIndex: 1,
   //      style: {
     //       stroke: { width: 6 },
       //  }
      } );

      return layer;
   }

   private createFixtureLayer(): VectorLayer {

      const layer = new VectorLayer( {
         opacity: 0.7,
         zIndex: 0,
     //    style: {
     //       stroke: { width: 4 },
     //       text: { scale: 12, }
     //    }
      } );

      return layer;
   }

}
