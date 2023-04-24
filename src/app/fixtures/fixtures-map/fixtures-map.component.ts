import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
         EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Fixture, LatLong } from 'app/model/fixture';
import { Canvas, circle, Circle, CircleMarker, CircleMarkerOptions, control, FeatureGroup, Map, tileLayer, TileLayer, Util } from "leaflet";
import { timer } from 'rxjs';

@UntilDestroy( { checkProperties: true } )
@Component( {
   selector: 'app-fixtures-map',
   templateUrl: './fixtures-map.component.html',
   styleUrls: [ './fixtures-map.component.scss' ],
   encapsulation: ViewEncapsulation.None,
   changeDetection: ChangeDetectionStrategy.OnPush
} )
/** Map of fixtures */
export class FixturesMapComponent implements OnInit, AfterViewInit {

   private _fixtures: Fixture[] = [];
   private _selectedFixtureMarker: FixtureMarker = null;
   private _homeLocation: LatLong;

   private _fixtureMarkers = new FeatureGroup<FixtureMarker>();
   private _homeMarkers = new FeatureGroup<Circle>();

   @Input() set fixtures( fixtures: Fixture[] ) {
      this.setFixtures( fixtures );
   }

   @Input() set selectedFixture( selected: Fixture ) {
      this.selectFixture( selected );
   }

   @Input() set homeLocation( home: LatLong ) {
      this.setHomeLocation( home );
   }

   @Output() fixtureSelected = new EventEmitter<Fixture>();

   map: Map = null;

   tileLayer: TileLayer;

   constructor ( private ref: ChangeDetectorRef ) { }

   ngOnInit() {
   }


   ngAfterViewInit() {

      /* Leaflet calculates the map size before angular is full initialise so we need to
        invalidate it once the view is complete. Short delay is required  see https://medium.com/ngconf/integrating-maps-into-your-angular-application-with-leaflet-b9aedb040735 */
      this._loadMap();
   }

   private _loadMap() {

      this.map = new Map( 'map', { preferCanvas: true, zoomControl: false } ).setView( this._homeLocation, 9 );

      control.scale( { position: 'bottomleft' } ).addTo( this.map );
      control.zoom( { position: 'bottomright' } ).addTo( this.map );

      this.tileLayer = tileLayer( 'https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         opacity: 0.75
      } );
      this.tileLayer.addTo( this.map );

      this.map.createPane( 'fixtures' );
      this.map.createPane( 'homemarkers' );

      this._homeMarkers.addTo( this.map );

      this.setHomeLocation( this._homeLocation );
      this.setFixtures( this._fixtures );

   }

   setHomeLocation( latLng: LatLong ) {

      this._homeLocation = latLng;

      // TODO Can be called on  that is called before the map is created.
      // not sure how to fix this.  Cant create map in constructor as element is not avaliable.
      // Even ngChanges lifecycle s too early.  Also related to have to call in ngInit
      if ( !this.map ) {
         return;
      }
      console.log( "***** setting home locations to: lat: " + latLng.lat + "   long: " + latLng.lng);

      this._homeMarkers.clearLayers();

      this.map.getPane( 'homemarkers' ).style.pointerEvents = 'none';
      this.map.getPane( 'homemarkers' ).style.zIndex = '450';

      const MileToMeter = 1609.34;

      for ( const radius of [ 20, 40, 60, 80 ] ) {
         this._homeMarkers.addLayer( circle( latLng, { radius: radius * MileToMeter, pane: 'homemarkers' } ) );
      }

      this._homeMarkers.setStyle( {
         color: '#000000',
         weight: 6,
         opacity: 0.08,
         fill: false,
      } );

      this.map.panTo( latLng );
   }

   setFixtures( fixtures: Fixture[] ) {

      this._fixtures = fixtures;

      if ( !this.map ) {
         return;
      }

      this.ref.detach();

      this.map.getPane( 'fixtures' ).style.zIndex = '600';

      this._fixtureMarkers.removeFrom( this.map );

      this._fixtureMarkers.clearLayers();

      const fixturesToDraw = fixtures.filter( fix => fix.latLong );

      for ( const fixture of fixturesToDraw.reverse() ) {

         const weeks = this.weeksAhead( fixture.date );

         const MaxNumberedWeeks = 5;
         const MinRadius = 6;

         let radius: number;
         let label: string;
         if ( weeks <= MaxNumberedWeeks ) {
            radius = MinRadius + ( MaxNumberedWeeks - weeks );
            label = ( weeks + 1 ).toString();
         } else {
            radius = MinRadius;
            label = "";
         }

         const c = new FixtureMarker( fixture.latLong, {
            radius: radius,
            fillColor: this.getColour( weeks ),
            color: "#000000",
            pane: 'fixtures',
            text: label
         } );

         c.fixture = fixture;

         c.on( {
            click: evt => {
               const fixtureMarker: FixtureMarker = evt.target;

               if ( fixtureMarker !== this._selectedFixtureMarker ) {
                  this.selectFeature( fixtureMarker );
                  this.fixtureSelected.emit( fixtureMarker.fixture );

               }
            }
         } );

         this._fixtureMarkers.addLayer( c );

      }

      const fixtureStyle = {
         weight: 0,
         opacity: 0.85,
         fillOpacity: 0.85,
      };

      this._fixtureMarkers.setStyle( fixtureStyle );
      this._fixtureMarkers.addTo( this.map );

      this.ref.reattach();

   }

   selectFeature( fixtureMarker: FixtureMarker ) {
      if ( this._selectedFixtureMarker ) {
         this._selectedFixtureMarker.setStyle( { weight: 0 } );
      }

      this._selectedFixtureMarker = fixtureMarker;
      this._selectedFixtureMarker.setStyle( { weight: 4 } );
      //  console.log( "Map Fixture selected " + fixtureMarker.fixture.name );
   }

   /** Returns the number of weeks in the future from now
    * times within the next 7 days return 0.
   */
   private weeksAhead( date: string ): number {
      const millsecondsToWeeks = 7 * 24 * 60 * 60 * 1000;
      const oneDay = 24 * 60 * 60 * 1000;
      const weeks = Math.floor( ( new Date( date ).valueOf() + oneDay - new Date().valueOf() ) / millsecondsToWeeks );
      return weeks;
   }

   private getColour( weeksAhead: number ) {
      if ( weeksAhead < 1 ) { return "#ff0000"; }
      if ( weeksAhead < 2 ) { return "#ff8800"; }
      if ( weeksAhead < 3 ) { return "#ffff00"; }
      if ( weeksAhead < 4 ) { return "#00ff00"; }
      if ( weeksAhead < 5 ) { return "#0088ff"; }
      if ( weeksAhead < 6 ) { return "#8800ff"; }
      return "#666666";
   }

   selectFixture( fixture: Fixture ) {

      const layers = this._fixtureMarkers.getLayers() as FixtureMarker[];

      const found = layers.find( fixtureMarker => fixture && fixtureMarker.fixture.id === fixture.id );

      if ( found && found !== this._selectedFixtureMarker ) {
         this.selectFeature( found );
         this.map.panTo( found.fixture.latLong );
      }
   }
}


// Augment Canvas with LabeledFixture renderer

interface LabeledCircleMarkerProtected extends LabeledCircleMarker {
   _point;
   _empty;
   _radius;
   options;
}

// Augment Canvas object to be able to draw circle with text
Canvas.include( {
   _labeledCircleMarker: function ( layer: LabeledCircleMarkerProtected ) {

      if ( !this._drawing || layer._empty() ) { return; }

      // render circle
      this._updateCircle( layer );

      // render text label in the middle of the circle
      const p = layer._point;
      const ctx: CanvasRenderingContext2D = this._ctx;

      const fontsize = Math.max( Math.round( layer._radius * 1.2 ), 1 );

      ctx.font = 'normal ' + fontsize.toString() + "px Verdana";
      ctx.textAlign = "center";
      ctx.fillStyle = "#000000";
      ctx.textBaseline = "middle";

      const text = layer.options.text;

      if ( text !== "" ) {
         ctx.fillText( layer.options.text, p.x, p.y );
      }
   }
} );

interface LabeledCircleMarkerOptions extends CircleMarkerOptions {
   text?: string;
}

class LabeledCircleMarker extends CircleMarker {

   constructor ( latlng: LatLong, opt: LabeledCircleMarkerOptions ) {
      super( latlng, opt );
   }

   _updatePath() {
      // @ts-ignore  Ignore error that _renderer is not exposed in .d.ts file
      this._renderer._labeledCircleMarker( this );
   }

   initialize( latlng: LatLong, opt: LabeledCircleMarkerOptions ) {
      // @ts-ignore  Ignore error that initialize is not exposed in .d.ts file
      super.initialize( latlng, opt );
      Util.setOptions( this, opt );
   }

   setText( text: string ) {
      ( <LabeledCircleMarkerOptions> this.options ).text = text;
      return this.redraw();
   }

   getText(): string {
      return ( <LabeledCircleMarkerOptions> this.options ).text;
   }
}

class FixtureMarker extends LabeledCircleMarker {
   fixture: Fixture;
}
