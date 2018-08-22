import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyResultsTableComponent } from './my-results-table.component';

describe('MyResultsTableComponent', () => {
  let component: MyResultsTableComponent;
  let fixture: ComponentFixture<MyResultsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyResultsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyResultsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
