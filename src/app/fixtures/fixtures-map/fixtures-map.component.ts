import {
   AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component,
   EventEmitter, Input, OnInit, Output, ViewEncapsulation
} from '@angular/core';
import { Fixture, LatLong } from 'app/model/fixture';
import { circle, Circle, CircleMarker, control, FeatureGroup, Map, tileLayer,
   TooltipOptions, TileLayer, icon, Marker, Canvas, Layer } from "leaflet";


function drawNumberedCircle( layer: Layer, canvas: Canvas) {
   if ( !canvas._drawing || layer._empty() ) { return; }

   const p = layer._point, ;
   const ctx = this._ctx,
      r = Math.max( Math.round( layer._radius ), 1 );

   this._drawnLayers[ layer._leaflet_id ] = layer;

   ctx.beginPath();
   ctx.moveTo( p.x + r, p.y );
   ctx.lineTo( p.x + 0.43 * r, p.y + 0.25 * r );
   ctx.lineTo( p.x + 0.50 * r, p.y + 0.87 * r );
   ctx.lineTo( p.x, p.y + 0.50 * r );
   ctx.lineTo( p.x - 0.50 * r, p.y + 0.87 * r );
   ctx.lineTo( p.x - 0.43 * r, p.y + 0.25 * r );
   ctx.lineTo( p.x - r, p.y );
   ctx.lineTo( p.x - 0.43 * r, p.y - 0.25 * r );
   ctx.lineTo( p.x - 0.50 * r, p.y - 0.87 * r );
   ctx.lineTo( p.x, p.y - 0.50 * r );
   ctx.lineTo( p.x + 0.50 * r, p.y - 0.87 * r );
   ctx.lineTo( p.x + 0.43 * r, p.y - 0.25 * r );
   ctx.closePath();
   canvas._fillStroke( ctx, layer );
}

   // Add mixin method to canvas renderer to render circle with text lablel
Canvas.include( {
   _updateMarker6Point: function ( layer ) {
      if ( !this._drawing || layer._empty() ) { return; }

      const p = layer._point, ;
         const ctx = this._ctx,
         r = Math.max( Math.round( layer._radius ), 1 );

      this._drawnLayers[ layer._leaflet_id ] = layer;

      ctx.beginPath();
      ctx.moveTo( p.x + r, p.y );
      ctx.lineTo( p.x + 0.43 * r, p.y + 0.25 * r );
      ctx.lineTo( p.x + 0.50 * r, p.y + 0.87 * r );
      ctx.lineTo( p.x, p.y + 0.50 * r );
      ctx.lineTo( p.x - 0.50 * r, p.y + 0.87 * r );
      ctx.lineTo( p.x - 0.43 * r, p.y + 0.25 * r );
      ctx.lineTo( p.x - r, p.y );
      ctx.lineTo( p.x - 0.43 * r, p.y - 0.25 * r );
      ctx.lineTo( p.x - 0.50 * r, p.y - 0.87 * r );
      ctx.lineTo( p.x, p.y - 0.50 * r );
      ctx.lineTo( p.x + 0.50 * r, p.y - 0.87 * r );
      ctx.lineTo( p.x + 0.43 * r, p.y - 0.25 * r );
      ctx.closePath();
      this._fillStroke( ctx, layer );
   }
} );

interface HasFixture {
   fixture: Fixture;
}

class FixtureMarker extends CircleMarker implements HasFixture {
   fixture: Fixture;
}

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

      const londonLatLng = { lat: 51.509865, lng: -0.118092 };

      this.map = new Map( 'map', { preferCanvas: true, zoomControl: false } ).setView( londonLatLng, 9 );
      control.scale( { position: 'bottomleft' } ).addTo( this.map );
      control.zoom( { position: 'bottomright' } ).addTo( this.map );

      this.tileLayer = tileLayer( 'https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         opacity: 0.75
      } );
      this.tileLayer.addTo( this.map );

      this.map.createPane( 'fixtures' );
      this.map.createPane( 'homemarkers' );

      this._homeMarkers.addTo( this.map );

      this.setHomeLocation( londonLatLng );
      this.setFixtures( this._fixtures );
   }

   ngAfterViewInit() {
      /* Leaflet calculates the map size before angular is full initialise so we need to
      invalidate it once the view is complete. */
      this.map.invalidateSize();
   }

   setHomeLocation( latLng: LatLong ) {

      // TODO Can be called on  that is called before the map is created.
      // not sure how to fix this.  Cant create map in constructor as element is not avaliable.
      // Even ngChanges lifecycle s too early.  Also related to have to call in ngInit
      if (!this.map) {
         return;
      }

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

         if ( !fixture.hidden ) {

            const weeks = this.weeksAhead( fixture.date );

            const MaxNumberedWeeks = 5;
            const MinRadius = 6;

            let marker;

            if ( weeks < 5) {
               const i = this.weekIcon(weeks);
               marker = new Marker( fixture.latLong, { icon: i, zIndexOffset: 601} );
            } else {

            let radius: number;
            let label: string;
            if ( weeks <= MaxNumberedWeeks ) {
               radius = MinRadius + ( MaxNumberedWeeks - weeks );
               label = ( weeks + 1 ).toString();
            } else {
               radius = MinRadius;
               label = "";
            }

             marker = new FixtureMarker( fixture.latLong, {
               radius: radius,
               fillColor: this.getColour( weeks ),
               color: "#000000",
               pane: 'fixtures'
            } );

            // Tooltip in centre of circle
            if ( label !== "" ) {
               const tooltipOptions: TooltipOptions = {
                  permanent: true,
                  direction: 'center',
                  className: 'text',
                  pane: 'fixtures'
               };
               //    c.bindTooltip( label, tooltipOptions );
            }
         }

            marker.fixture = fixture;

            marker.on( {
               click: evt => {
                  const fixtureMarker: FixtureMarker = evt.target;

                  if ( fixtureMarker !== this._selectedFixtureMarker ) {
                     this.toggleHighlight( fixtureMarker );
                     this.fixtureSelected.emit( fixtureMarker.fixture );

                  }
               }
            } );

            if ( weeks < 5 ) {
               this._fixtureMarkers.addLayer( marker );
            }

         }
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

   weekIcon( week: number)  {
      return icon( {
         iconUrl: './assets/images/fixture1.png',
         iconSize: [ 21, 21 ], // size of the icon
         iconAnchor: [ 11, 11 ], // point of the icon which will correspond to marker's location
         popupAnchor: [ 0, -11 ] // point from which the popup should open relative to the iconAnchor
      } );
   }

   toggleHighlight( fixtureMarker: FixtureMarker ) {
      if ( this._selectedFixtureMarker ) {
         this._selectedFixtureMarker.setStyle( { weight: 0 } );
      }

      this._selectedFixtureMarker = fixtureMarker;
      this._selectedFixtureMarker.setStyle( { weight: 4 } );
      console.log( "Map Fixture selected " + fixtureMarker.fixture.name );
   }

   /** Returns the number of weeks in the future from now */
   private weeksAhead( date: string ): number {
      const millsecondsToWeeks = 7 * 24 * 60 * 60 * 1000;
      const weeks = Math.round( ( new Date( date ).valueOf() - new Date().valueOf() ) / millsecondsToWeeks );
      return weeks;
   }

   private getColour( weeksAhead: number ) {
      if ( weeksAhead < 1 ) { return "#ff000000"; }
      if ( weeksAhead < 2 ) { return "#ff880000"; }
      if ( weeksAhead < 3 ) { return "#ffff0000"; }
      if ( weeksAhead < 4 ) { return "#00ff0000"; }
      if ( weeksAhead < 5 ) { return "#0088ff00"; }
      if ( weeksAhead < 6 ) { return "#8800ff00"; }
      return "#666666";
   }

   selectFixture( fixture: Fixture ) {

      console.log( 'click' );

      const layers = this._fixtureMarkers.getLayers() as FixtureMarker[];

      const found = layers.find( fixtureMarker => fixture && fixtureMarker.fixture.id === fixture.id );

      if ( found && found !== this._selectedFixtureMarker ) {
         console.log( 'selected' + found.fixture.name );
         this.toggleHighlight( found );
         this.map.panTo( found.fixture.latLong );
      }
   }
}


L.Canvas.include( {
   _updateMarker6Point: function ( layer ) {
      if ( !this._drawing || layer._empty() ) { return; }

      const p = layer._point,
         ctx = this._ctx,
         r = Math.max( Math.round( layer._radius ), 1 );

      this._drawnLayers[ layer._leaflet_id ] = layer;

      ctx.beginPath();
      ctx.moveTo( p.x + r, p.y );
      ctx.lineTo( p.x + 0.43 * r, p.y + 0.25 * r );
      ctx.lineTo( p.x + 0.50 * r, p.y + 0.87 * r );
      ctx.lineTo( p.x, p.y + 0.50 * r );
      ctx.lineTo( p.x - 0.50 * r, p.y + 0.87 * r );
      ctx.lineTo( p.x - 0.43 * r, p.y + 0.25 * r );
      ctx.lineTo( p.x - r, p.y );
      ctx.lineTo( p.x - 0.43 * r, p.y - 0.25 * r );
      ctx.lineTo( p.x - 0.50 * r, p.y - 0.87 * r );
      ctx.lineTo( p.x, p.y - 0.50 * r );
      ctx.lineTo( p.x + 0.50 * r, p.y - 0.87 * r );
      ctx.lineTo( p.x + 0.43 * r, p.y - 0.25 * r );
      ctx.closePath();
      this._fillStroke( ctx, layer );
   }
} );

class NumberedCircleMarker extends CircleMarker {

   // override update path to render the function
   _updatePath = function() {
      this._renderer._updateMarker6Point();
   };
}



