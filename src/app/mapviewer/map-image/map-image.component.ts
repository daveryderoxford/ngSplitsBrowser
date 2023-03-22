import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';



@Component( {
  selector: 'app-map-image',
  templateUrl: './map-image.component.html',
  styleUrls: ['./map-image.component.scss']
} )
export class MapImageComponent implements OnInit  {


  @Input() set imageURL( imageURL: string ) {
   // this.imageOverlay?.setUrl( imageURL );
  };

  constructor (private http: HttpClient) { }

  ngOnInit() {
    const i = 1;
  }
  

}
