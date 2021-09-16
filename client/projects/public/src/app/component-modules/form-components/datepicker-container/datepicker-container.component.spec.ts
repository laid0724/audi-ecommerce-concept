import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatepickerContainerComponent } from './datepicker-container.component';

describe('DatepickerContainerComponent', () => {
  let component: DatepickerContainerComponent;
  let fixture: ComponentFixture<DatepickerContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatepickerContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatepickerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
