import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventsTabComponent } from './my-events-tab.component';

describe('MyEventsTabComponent', () => {
  let component: MyEventsTabComponent;
  let fixture: ComponentFixture<MyEventsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyEventsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyEventsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
