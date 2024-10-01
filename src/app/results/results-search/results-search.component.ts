/** Componnet to results for club class or */
/* eslint-disable @typescript-eslint/quotes */
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyAutocompleteSelectedEvent as MatAutocompleteSelectedEvent, MatLegacyAutocompleteTrigger as MatAutocompleteTrigger, MatLegacyAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { UntilDestroy } from '@ngneat/until-destroy';
//import { Subscription } from 'rxjs/Subscription';
import { Competitor, Course, CourseClass, Results } from '../model';
import { ResultsSelectionService } from '../results-selection.service';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type SearchSelectedItem = Competitor | CourseClass | Course;

interface FilterPanelGroup {
  name: string;
  options: Array<SearchSelectedItem>;
}

@UntilDestroy( { checkProperties: true } )
@Component({
    selector: 'app-results-search',
    templateUrl: './results-search.component.html',
    styleUrls: ['./results-search.component.scss'],
    standalone: true,
    imports: [MatLegacyAutocompleteModule, ReactiveFormsModule, MatIconModule, NgFor, MatLegacyOptionModule]
})
export class ResultsSearchComponent implements OnInit {

  @HostBinding('class.docs-expanded') _isExpanded: boolean;

  @ViewChild(MatAutocompleteTrigger, { static: true })
  private _autocompleteTrigger: MatAutocompleteTrigger;

  results: Results;

  // Filter panel contents consisting of groups for courses, classes and competitors
  filterPanelContents: Array<FilterPanelGroup> = [];

  searchControl: UntypedFormControl = new UntypedFormControl('');
  subscription: any;

  constructor(private rs: ResultsSelectionService) { }

  ngOnInit() {
    this.rs.selectedResults.subscribe(results => {
      this.results = results;
    });

    // When the search input control changes update the panel contents
    this.searchControl.valueChanges.subscribe((val) => this.updateSearchPanelContents(val));

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
    console.log('Search: Item selected ' + val.name);
    this.searchControl.setValue('');
  }

  private updateSelections(selection: SearchSelectedItem) {
    // Select the competitor and the courses and class of the competiror
    if (selection instanceof Competitor) {
      this.rs.selectCompetitors(selection);
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

  toggleIsExpanded(evt?: any) {
    if (!this._isExpanded && evt === null || evt && evt.tagName === 'MD-OPTION') {
      // input not expanded and blurring || input is expanded and we clicked on an option
      return;
    } else if (this._isExpanded && evt === undefined) {
      // input is expanded and we are not blurring
      this._delayDropdown(false);
    } else {
      // defualt behaviour: not expanded and focusing || expanded and blurring
      this._delayDropdown(this._isExpanded);
      this._isExpanded = !this._isExpanded;
    }
  }

  _delayDropdown(isExpanded: boolean) {
    if (isExpanded) {
      this._autocompleteTrigger.closePanel();
    } else {
      this._autocompleteTrigger.closePanel();
      setTimeout(() => this._autocompleteTrigger.openPanel(), 210);
    }
  }

  _resetSearch() {
    this.searchControl.reset();
    this.searchControl.setValue('');
  }
}

