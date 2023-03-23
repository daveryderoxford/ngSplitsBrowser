import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { RGData } from 'app/model/fixture';

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
        allowFullscreen: true,
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

    selected: number = 0;
    rgData: RGData = null;
    images: string[] = [];

    constructor ( public location: Location,
        private route: ActivatedRoute ) { }

    ngOnInit() {
        this.route.queryParamMap.subscribe( ( params: ParamMap ) => {
            this.rgData = JSON.parse( params.get( 'rgdata' ) );
            this.images = this.rgData.maps.map( m => this.rgData.baseURL + "kartat/" + m.mapfile );
        } );
    }

    routegadgetURL() {
        return this.rgData.baseURL + "rg2/#" + this.rgData.maps[this.selected].id;
    }
}
