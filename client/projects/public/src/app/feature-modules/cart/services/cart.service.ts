import { Injectable } from '@angular/core';
import { CartItem } from '@audi/data';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart$ = new ReplaySubject<CartItem[]>(1);
  cart$ = this._cart$.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage(): void {
    const localStorageCart = localStorage.getItem('cart');

    if (localStorageCart === null) {
      localStorage.setItem('cart', JSON.stringify([]));
    } else {
      this._cart$.next(JSON.parse(localStorageCart));
    }
  }

  addToCart(item: CartItem): void {}

  updateCart(item: CartItem): void {}

  removeFromCart(item: CartItem): void {}
}
