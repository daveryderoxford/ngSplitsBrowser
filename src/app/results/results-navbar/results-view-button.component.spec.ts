import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsViewButtonComponent } from './results-view-button.component';

describe('ResultsViewButtonComponent', () => {
  let component: ResultsViewButtonComponent;
  let fixture: ComponentFixture<ResultsViewButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsViewButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsViewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
