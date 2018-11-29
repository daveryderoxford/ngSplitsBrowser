import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompareWithComponent } from './compare-with.component';

describe('CompareWithComponent', () => {
  let component: CompareWithComponent;
  let fixture: ComponentFixture<CompareWithComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareWithComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareWithComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
