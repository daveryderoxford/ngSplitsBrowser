import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FixturesMapComponent } from './fixtures-map.component';

describe('FixturesMapComponent', () => {
  let component: FixturesMapComponent;
  let fixture: ComponentFixture<FixturesMapComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturesMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturesMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
