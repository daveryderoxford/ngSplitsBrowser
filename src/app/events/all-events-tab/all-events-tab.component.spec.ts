import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllEventsTabComponent } from './all-events-tab.component';

describe('AllEventsTabComponent', () => {
  let component: AllEventsTabComponent;
  let fixture: ComponentFixture<AllEventsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllEventsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllEventsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
