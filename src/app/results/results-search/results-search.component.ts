/** Componnet to results for club class or */
// tslint:disable:quotemark
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
import {filter} from 'rxjs/operators/filter';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import { Results, Competitor, CourseClass, Course } from 'app/results/model';

export type SearchSelectedItem = Competitor | CourseClass | Course;

interface FilterPanelGroup {
    name: string;
    options: Array<SearchSelectedItem>;
}

@Component({
  selector: 'app-results-search',
  templateUrl: './results-search.component.html',
  styleUrls: ['./results-search.component.scss']
})
export class ResultsSearchComponent implements OnInit {

  @Input() public results: Results;
  @Output() public onItemSelected = new EventEmitter<SearchSelectedItem>();

  // Filter panel contents consisting of groups for courses, classes and competitors
  filterPanelContents: Array<FilterPanelGroup> = [];

  searchForm: FormGroup;

  constructor() {

   }

  ngOnInit() {

    this.searchForm = new FormGroup({
       searchControl: new FormControl()
    });

    // When the search input control changes update the panel contents
    this.searchForm.get("searchControl").valueChanges.subscribe( (val) => this.updateSearchPanelContents(val));
  }

  private updateSearchPanelContents(searchstring: string) {
     const courses = this.results.findCourses(searchstring);
     const classes = this.results.findCourseClasss(searchstring);
     const competitors = this.results.findCompetitors(searchstring);

    this.filterPanelContents = [];

    if (courses.length > 0) {
       this.filterPanelContents.push( { name: "Courses", options: courses } );
    }

    if (classes.length > 0) {
       this.filterPanelContents.push( { name: "Classes", options: classes } );
    }

    if (competitors.length > 0) {
       this.filterPanelContents.push( { name: "Results", options: competitors } );
    }

  }

  // Fired when an option is selected.  Emit the selected object and reset the search term
  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const val = event.option.value;
    this.onItemSelected.emit(val);
    console.log("Item selected " + val.name);
    this.searchForm.get("searchControl").setValue("");
  }
}
