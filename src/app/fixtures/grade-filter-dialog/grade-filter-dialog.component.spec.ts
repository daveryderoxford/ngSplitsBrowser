import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GradeFilterComponent } from './grade-filter-dialog.component';

describe('FilterComponent', () => {
  let component: GradeFilterComponent;
  let fixture: ComponentFixture<GradeFilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GradeFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GradeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
