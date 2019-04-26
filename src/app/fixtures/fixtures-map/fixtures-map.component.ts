import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { Fixture, LatLong } from 'app/model/fixture';
import { circle, Circle, CircleMarker, FeatureGroup, LayerGroup, Map, tileLayer, TooltipOptions } from "leaflet";

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

   constructor () { }

   ngOnInit() {

      const londonLatLng = { lat: 51.509865, lng: -0.118092 };

      this.map = new Map( 'map', { preferCanvas: true } ).setView( londonLatLng, 9 );

      tileLayer( 'http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
         opacity: 0.75
      } ).addTo( this.map );

      this._homeMarkers.addTo( this.map );
      this._fixtureMarkers.addTo( this.map );

      this.setHomeLocation( londonLatLng );
      this.setFixtures( this._fixtures );
   }

   ngAfterViewInit() {
      /* Leaflet calculates the map size before angular is full initialise so we need to
      invalidate it once the view is complete. */
      this.map.invalidateSize();
   }

   setHomeLocation( latLng: LatLong ) {

      this._homeMarkers.clearLayers();

      const MileToMeter = 1609.34;

      for ( const radius of [ 20, 40, 60, 80 ] ) {
         this._homeMarkers.addLayer( circle( latLng, { radius: radius * MileToMeter } ) );
      }

      this._homeMarkers.setStyle( {
         color: '#000000',
         weight: 6,
         opacity: 0.08,
         fill: false
      });

      if (this.map) {
         this.map.panTo( latLng );
      }
   }

   setFixtures( fixtures: Fixture[] ) {

      this._fixtures = fixtures;

      if ( !this.map ) {
         return;
      }

      const fixturesToDraw = fixtures.filter( fix => fix.latLong);

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
            color: "#000000"
         } );

         c.fixture = fixture;

         // Tooltip in centre of circle
         if ( label !== "" ) {
            const tooltipOptions: TooltipOptions = {
               permanent: true,
               direction: 'center',
               className: 'text',
            };
            c.bindTooltip( label, tooltipOptions );
         }

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

   }

   selectFeature( fixtureMarker: FixtureMarker ) {
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

      const found = layers.find( fixtureMarker => fixtureMarker.fixture === fixture );

      if ( found && found !== this._selectedFixtureMarker ) {
         this.selectFeature( found );
         this.map.panTo( found.fixture.latLong );
      }
   }
}

class FixtureMarker extends CircleMarker {
   fixture: Fixture;
}
