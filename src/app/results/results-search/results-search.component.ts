/** Componnet to results for club class or */
// tslint:disable:quotemark
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Competitor, Course, CourseClass, Results } from '../model';
import { ResultsSelectionService } from '../results-selection.service';

type SearchSelectedItem = Competitor | CourseClass | Course;

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

  results: Results;

  // Filter panel contents consisting of groups for courses, classes and competitors
  filterPanelContents: Array<FilterPanelGroup> = [];

  searchForm: FormGroup;

  constructor(private rs: ResultsSelectionService) { }

  ngOnInit() {
    this.rs.selectedResults.subscribe(results => {
      this.results = results;
    });

    this.searchForm = new FormGroup({
      searchControl: new FormControl()
    });

    // When the search input control changes update the panel contents
    this.searchForm.get('searchControl').valueChanges.subscribe((val) => this.updateSearchPanelContents(val));
  }

  private updateSearchPanelContents(searchstring: string | SearchSelectedItem) {
    if (!this.results) { return; }

    // If a selction has not been made the value of the contol is a string.   If a seelction has been made it is the object selected
    searchstring = (typeof searchstring === 'string') ? searchstring : searchstring.name;

    const courses = this.results.findCourses(searchstring);
    const classes = this.results.findCourseClasss(searchstring);
    const competitors = this.results.findCompetitors(searchstring);

    this.filterPanelContents = [];

    if (courses.length > 0) {
      this.filterPanelContents.push({ name: 'Courses', options: courses });
    }

    if (classes.length > 0) {
      this.filterPanelContents.push({ name: 'Classes', options: classes });
    }

    if (competitors.length > 0) {
      this.filterPanelContents.push({ name: 'Results', options: competitors });
    }
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const val = event.option.value;
    this.updateSelections(val);
    console.log('Item selected ' + val.name);
    this.searchForm.get('searchControl').setValue('');
  }

  private updateSelections(selection: SearchSelectedItem) {
    // Select the competitor and the courses and class of the competiror
    if (selection instanceof Competitor) {
      this.rs.selectCompetitor(selection);
      this.rs.selectClass(selection.courseClass);
      this.rs.selectCourse(selection.courseClass.course);
    } else if (selection instanceof CourseClass) {
      this.rs.selectClass(selection);
      this.rs.selectCourse(selection.course);
    } else if (selection instanceof Course) {
      this.rs.selectCourse(selection);
    }
  }

  displayFn(value?: SearchSelectedItem): string | undefined {
    return value ? value.name : undefined;
  }
}