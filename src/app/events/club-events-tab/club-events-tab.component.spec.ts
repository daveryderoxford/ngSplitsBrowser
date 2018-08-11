import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClubEventsTabComponent } from './clubl-events-tab.component';

describe('ClublEventsTabComponent', () => {
  let component: ClubEventsTabComponent;
  let fixture: ComponentFixture<ClubEventsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubEventsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClubEventsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
