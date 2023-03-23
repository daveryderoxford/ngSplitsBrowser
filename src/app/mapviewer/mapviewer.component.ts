import { BreakpointObserver } from '@angular/cdk/layout';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RGData } from 'app/model/fixture';
import { AngularImageViewerComponent } from './angular-image_viewer/angular-image-viewer.component';

@Component( {
        selector: 'app-mapviewer',
        templateUrl: './mapviewer.component.html',
        styleUrls: ['./mapviewer.component.scss']
    } )
export class MapviewerComponent implements OnInit {

    config = {
        btnClass: "hide",
        containerBackgroundColor: '#fff',
        allowKeyboardNavigation: true,
        allowFullscreen: false,
        wheelZoom: true,
        btnShow: {
            next: false,
            prev: false,
            zoomIn: false,
            zoomOut: false,
            rotateClockwise: false,
            rotateCounterClockwise: false
        }
    };

    rgData: RGData = null;
    images: string[] = [];
    handset: boolean;

    constructor ( public location: Location,
        private route: ActivatedRoute,
        private breakpointObserver: BreakpointObserver, ) { }

    ngOnInit() {

        this.breakpointObserver.observe( ['(min-width: 500px) and (min-height: 400px)'] ).subscribe( state => this.handset = !state.matches );

        this.route.queryParamMap.subscribe( ( params: ParamMap ) => {
            this.rgData = JSON.parse( params.get( 'rgdata' ) );
            this.images = this.rgData.maps.map( m => this.rgData.baseURL + "kartat/" + m.mapfile );
        } );
    }

    routegadgetURL(index: number) {
        return this.rgData.baseURL + "rg2/#" + this.rgData.maps[index].id;
    }

  
}
