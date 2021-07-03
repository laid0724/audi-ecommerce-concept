import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClrDgProductCategoryFilterComponent } from './clr-dg-product-category-filter.component';

describe('ClrDgProductCategoryFilterComponent', () => {
  let component: ClrDgProductCategoryFilterComponent;
  let fixture: ComponentFixture<ClrDgProductCategoryFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClrDgProductCategoryFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClrDgProductCategoryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
