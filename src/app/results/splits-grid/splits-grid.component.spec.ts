import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SplitsGridComponent } from './splits-grid.component';

describe('SplitsGridComponent', () => {
  let component: SplitsGridComponent;
  let fixture: ComponentFixture<SplitsGridComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitsGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
