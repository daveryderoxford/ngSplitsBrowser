import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FixtureSelectComponent } from './fixture-select.component';

describe('FixtureSelectComponent', () => {
  let component: FixtureSelectComponent;
  let fixture: ComponentFixture<FixtureSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FixtureSelectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FixtureSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
