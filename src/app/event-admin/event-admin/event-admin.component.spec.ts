import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EventAdminComponent } from './event-admin.component';
import 'jasmine-expect';

xdescribe('EventAdminComponent', () => {
  let component: EventAdminComponent;
  let fixture: ComponentFixture<EventAdminComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [EventAdminComponent]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
