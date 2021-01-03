import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FixturesGridComponent } from './fixtures-grid.component';

describe('FixturesGridComponent', () => {
  let component: FixturesGridComponent;
  let fixture: ComponentFixture<FixturesGridComponent>;

  beforeEach(waitForAsync(() => {
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
