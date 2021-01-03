import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapRegistrationAdminComponent } from './map-registration-admin.component';

describe('MapRegistrationAdminComponent', () => {
  let component: MapRegistrationAdminComponent;
  let fixture: ComponentFixture<MapRegistrationAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MapRegistrationAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapRegistrationAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it ('should validate non-unique course names', () => {

  });
});
