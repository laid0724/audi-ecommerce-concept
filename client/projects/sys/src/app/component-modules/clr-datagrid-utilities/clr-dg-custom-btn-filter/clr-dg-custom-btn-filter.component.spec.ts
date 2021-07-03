import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgCustomBtnFilterComponent } from './clr-dg-custom-btn-filter.component';

describe('ClrDgCustomBtnFilterComponent', () => {
  let component: ClrDgCustomBtnFilterComponent;
  let fixture: ComponentFixture<ClrDgCustomBtnFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgCustomBtnFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgCustomBtnFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
