/** Componnet to results for club class or */
/* eslint-disable @typescript-eslint/quotes */
import { Component, HostBinding, OnInit, viewChild, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger, MatAutocompleteModule } from '@angular/material/autocomplete';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Competitor, Course, CourseClass, Results } from '../model';
import { ResultsSelectionService } from '../results-selection.service';
import { MatOptionModule } from '@angular/material/core';

import { MatIconModule } from '@angular/material/icon';
import { ResultsDataService } from '../results-data.service ';
import { toSignal } from '@angular/core/rxjs-interop';
import { M } from "../../../../node_modules/@angular/material/module.d-D1Ym5Wf2";

type SearchSelectedItem = Competitor | CourseClass | Course;

interface FilterPanelGroup {
  name: string;
  options: Array<SearchSelectedItem>;
}

@UntilDestroy({ checkProperties: true })
@Component({
    selector: 'app-results-search',
    templateUrl: './results-search.html',
    styleUrls: ['./results-search.scss'],
    imports: [MatAutocompleteModule, ReactiveFormsModule, MatIconModule, MatOptionModule, M]
})
export class ResultsSearch implements OnInit {
  private rd = inject(ResultsDataService);
  private rs = inject(ResultsSelectionService);

  @HostBinding('class.docs-expanded') _isExpanded: boolean;

  private _autocompleteTrigger = viewChild(MatAutocompleteTrigger);

  // Filter panel contents consisting of groups for courses, classes and competitors
  filterPanelContents: Array<FilterPanelGroup> = [];

  searchControl: FormControl = new FormControl('');
  subscription: any;

  ngOnInit() {
    // When the search input control changes update the panel contents
    this.searchControl.valueChanges.subscribe((val) => this.updateSearchPanelContents(val));
  }

  private updateSearchPanelContents(searchstring: string | SearchSelectedItem) {
    const results = this.rd.results();

    if (!results) { return; }

    // If a selction has not been made the value of the contol is a string.   If a seelction has been made it is the object selected
    searchstring = (typeof searchstring === 'string') ? searchstring : searchstring.name;

    const courses = results.findCourses(searchstring);
    const classes = results.findCourseClasss(searchstring);
    const competitors = this.rd.results()?.findCompetitors(searchstring);

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
    //  this.rs.selectCourse(selection.courseClass.course);
    } else if (selection instanceof CourseClass) {
      this.rs.selectClass(selection);
    //  this.rs.selectCourse(selection.course);
    } else if (selection instanceof Course) {
    //  this.rs.selectCourse(selection);
      if (selection.length > 0) {
         this.rs.selectClass(selection.classes[0]);
      }
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

  isCompetitor = (option: SearchSelectedItem): boolean => (option instanceof Competitor);
  asCompetitor = (option: SearchSelectedItem): Competitor => (option as Competitor);

  _delayDropdown(isExpanded: boolean) {
    if (isExpanded) {
      this._autocompleteTrigger().closePanel();
    } else {
      this._autocompleteTrigger().closePanel();
      setTimeout(() => this._autocompleteTrigger().openPanel(), 210);
    }
  }

  _resetSearch() {
    this.searchControl.reset();
    this.searchControl.setValue('');
  }
}

