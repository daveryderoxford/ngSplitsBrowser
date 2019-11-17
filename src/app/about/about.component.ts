import { Component, OnInit } from "@angular/core";
import { versions } from 'environments/versions';

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.scss"]
})
export class AboutComponent implements OnInit {

  constructor() { }

  ver = versions;

  ngOnInit() {
  }

}
