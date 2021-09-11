import { Component, Input } from '@angular/core';
import { CartItem } from '@audi/data';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'audi-cart-item-quantity-selector',
  templateUrl: './cart-item-quantity-selector.component.html',
  styleUrls: ['./cart-item-quantity-selector.component.scss'],
})
export class CartItemQuantitySelectorComponent {
  @Input() cartItem: CartItem;

  get notEnoughStock(): boolean {
    return this.cartItem.productSku.stock - (this.cartItem.quantity + 1) < 0;
  }

  constructor(private cartService: CartService) {}

  onIncreaseQuantity(): void {
    if (this.notEnoughStock) {
      return;
    }

    this.cartService.updateCartQuantity(
      this.cartItem,
      this.cartItem.quantity + 1
    );
  }

  onDecreaseQuantity(): void {
    if (this.cartItem.quantity === 1) {
      this.cartService.removeFromCart(this.cartItem);
      return;
    }

    this.cartService.updateCartQuantity(
      this.cartItem,
      this.cartItem.quantity - 1
    );
  }
}
