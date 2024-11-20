import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FastestPanelComponent } from './fastest-panel.component';

describe('FastestPanelComponent', () => {
  let component: FastestPanelComponent;
  let fixture: ComponentFixture<FastestPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FastestPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FastestPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
