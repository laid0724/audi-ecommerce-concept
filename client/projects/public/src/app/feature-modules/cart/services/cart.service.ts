import { Injectable } from '@angular/core';
import { CartItem } from '@audi/data';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartItem[] = [];

  constructor() {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage(): void {
    const localStorageCart = localStorage.getItem('cart');

    if (localStorageCart === null) {
      localStorage.setItem('cart', JSON.stringify([]));
    } else {
      this.cart = JSON.parse(localStorageCart);
    }
  }

  addToCart(item: CartItem): void {}

  updateCart(item: CartItem): void {}

  removeFromCart(item: CartItem): void {}
}
