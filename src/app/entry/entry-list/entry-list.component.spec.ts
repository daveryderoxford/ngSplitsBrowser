import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EntryListComponent } from './entry-list.component';

describe('EntryListComponent', () => {
  let component: EntryListComponent;
  let fixture: ComponentFixture<EntryListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
