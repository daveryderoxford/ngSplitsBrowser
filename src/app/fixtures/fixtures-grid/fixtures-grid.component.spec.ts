import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesGridComponent } from './fixtures-grid.component';

describe('FixturesGridComponent', () => {
  let component: FixturesGridComponent;
  let fixture: ComponentFixture<FixturesGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturesGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
