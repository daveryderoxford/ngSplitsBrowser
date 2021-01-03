import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FixturesOptionsComponent } from './fixtures-options.component';

describe('FixturesOptionsComponent', () => {
  let component: FixturesOptionsComponent;
  let fixture: ComponentFixture<FixturesOptionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FixturesOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixturesOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
