import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMenuButtonComponent } from './class-menu-button.component';

describe('ClassMenuButtonComponent', () => {
  let component: ClassMenuButtonComponent;
  let fixture: ComponentFixture<ClassMenuButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassMenuButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassMenuButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
