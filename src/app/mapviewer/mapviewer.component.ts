import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component( {
    selector: 'app-mapviewer',
    templateUrl: './mapviewer.component.html',
    styleUrls: ['./mapviewer.component.scss']
} )
export class MapviewerComponent implements OnInit {

    title: string;
    selected: number = 0;
    maps = new Array(5);

    constructor ( public location: Location,
        private route: ActivatedRoute ) {

        this.route.paramMap.subscribe( ( params: ParamMap ) => {
        //    this.maps = JSON.parse(params.get( 'rgmaps' ));
        } );
    }

    ngOnInit(): void {
       const i = 0;
    }
}
