import { Component, Input } from '@angular/core';
import { CartItem, Product } from '@audi/data';
import { isProductDiscounted } from '../../../helpers';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'audi-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() cartItem: CartItem;

  public isDiscounted: (product: Product) => boolean = isProductDiscounted;

  get price(): number {
    return this.isDiscounted(this.cartItem.product)
      ? this.cartItem.product.price - this.cartItem.product.discountAmount
      : this.cartItem.product.price;
  }

  get productMainPhotoUrl(): string {
    if (
      this.cartItem.product.photos &&
      Array.isArray(this.cartItem.product.photos) &&
      this.cartItem.product.photos.length > 0
    ) {
      const mainPhoto = this.cartItem.product.photos.find((p) => p.isMain);
      if (mainPhoto) {
        return mainPhoto.url;
      }
    }

    return 'assets/images/placeholder-original.png';
  }

  constructor(private cartService: CartService) {}

  removeItem(): void {
    this.cartService.removeFromCart(this.cartItem);
  }
}
