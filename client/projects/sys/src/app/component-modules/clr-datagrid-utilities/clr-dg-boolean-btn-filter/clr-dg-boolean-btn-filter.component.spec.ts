import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgBooleanBtnFilterComponent } from './clr-dg-boolean-btn-filter.component';

describe('ClrDgBooleanBtnFilterComponent', () => {
  let component: ClrDgBooleanBtnFilterComponent;
  let fixture: ComponentFixture<ClrDgBooleanBtnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgBooleanBtnFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgBooleanBtnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
