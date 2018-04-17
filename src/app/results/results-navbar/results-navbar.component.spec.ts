import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsNavbarComponent } from './results-navbar.component';

describe('ResultsNavbarComponent', () => {
  let component: ResultsNavbarComponent;
  let fixture: ComponentFixture<ResultsNavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
