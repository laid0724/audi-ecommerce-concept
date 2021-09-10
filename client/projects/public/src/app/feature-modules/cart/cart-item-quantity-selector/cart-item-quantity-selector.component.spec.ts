import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartItemQuantitySelectorComponent } from './cart-item-quantity-selector.component';

describe('CartItemQuantitySelectorComponent', () => {
  let component: CartItemQuantitySelectorComponent;
  let fixture: ComponentFixture<CartItemQuantitySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartItemQuantitySelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartItemQuantitySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
