import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixturesMapComponent } from './fixtures-map.component';

describe('FixturesMapComponent', () => {
  let component: FixturesMapComponent;
  let fixture: ComponentFixture<FixturesMapComponent>;

  beforeEach(async(() => {
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
