import { Component, OnInit } from "@angular/core";
import { Results } from "app/results/model";
import { SearchSelectedItem } from "app/results/results-search/results-search.component";


@Component({
  selector: "app-results-navbar",
  templateUrl: "./results-navbar.component.html",
  styleUrls: ["./results-navbar.component.scss"]
})
export class ResultsNavbarComponent implements OnInit {

  results: Results;

  constructor() { }

  ngOnInit() {
  }

  displayEvents() {

  }

  searchSelected(item: SearchSelectedItem) {
     // Search item may be course, courseclass or competitor
  }

}
