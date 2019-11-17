import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureActionsComponent } from './fixture-actions.component';

describe('FixtureActionsComponent', () => {
  let component: FixtureActionsComponent;
  let fixture: ComponentFixture<FixtureActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixtureActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixtureActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
