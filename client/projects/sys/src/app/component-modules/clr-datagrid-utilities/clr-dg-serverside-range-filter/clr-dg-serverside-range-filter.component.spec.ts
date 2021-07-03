import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgServersideRangeFilterComponent } from './clr-dg-serverside-range-filter.component';

describe('ClrDgServersideRangeFilterComponent', () => {
  let component: ClrDgServersideRangeFilterComponent;
  let fixture: ComponentFixture<ClrDgServersideRangeFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgServersideRangeFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgServersideRangeFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
