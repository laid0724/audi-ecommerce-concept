import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgDateRangeFilterComponent } from './clr-dg-date-range-filter.component';

describe('ClrDgDateRangeFilterComponent', () => {
  let component: ClrDgDateRangeFilterComponent;
  let fixture: ComponentFixture<ClrDgDateRangeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgDateRangeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgDateRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
