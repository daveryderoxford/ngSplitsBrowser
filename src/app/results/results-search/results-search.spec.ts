import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsSearch } from './results-search.';

describe('ResultsSearchComponent', () => {
  let component: ResultsSearch;
  let fixture: ComponentFixture<ResultsSearch>;


  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsSearch);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

