import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgServersideStringFilterComponent } from './clr-dg-serverside-string-filter.component';

describe('ClrDgServersideStringFilterComponent', () => {
  let component: ClrDgServersideStringFilterComponent;
  let fixture: ComponentFixture<ClrDgServersideStringFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgServersideStringFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgServersideStringFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
