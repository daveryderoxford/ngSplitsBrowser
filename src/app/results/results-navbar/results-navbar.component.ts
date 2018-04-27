import { Component, OnInit } from "@angular/core";
import { Results } from "app/results/model";

@Component({
  selector: "app-results-navbar",
  templateUrl: "./results-navbar.component.html",
  styleUrls: ["./results-navbar.component.scss"]
})
export class ResultsNavbarComponent implements OnInit {

  displayOptions: Array<string> = [];

  constructor() { }

  ngOnInit() {
  }

  displayEvents() {

  }

}
