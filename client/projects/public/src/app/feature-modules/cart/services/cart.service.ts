import { Injectable } from '@angular/core';
import { CartItem } from '@audi/data';
import { ReplaySubject } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart$ = new ReplaySubject<CartItem[]>(1);
  cart$ = this._cart$.asObservable();

  private _cartMenuIsOpen$ = new ReplaySubject<boolean>(1);
  cartMenuIsOpen$ = this._cartMenuIsOpen$.asObservable().pipe(startWith(false));

  constructor() {
    this.loadCartFromLocalStorage();
  }

  loadCartFromLocalStorage(): void {
    const localStorageCart = localStorage.getItem('cart');

    if (localStorageCart === null) {
      localStorage.setItem('cart', JSON.stringify([]));
      this._cart$.next([]);
    } else {
      this._cart$.next(JSON.parse(localStorageCart));
    }
  }

  addToCart(item: CartItem): void {
    const localStorageCart = localStorage.getItem('cart');
    if (localStorageCart) {
      const parsedLocalStorageCart: CartItem[] = JSON.parse(localStorageCart);

      const existingCartItem = parsedLocalStorageCart.find(
        (cartItem: CartItem) => cartItem.productSku.id === item.productSku.id
      );

      let updatedCart: CartItem[];

      if (existingCartItem) {
        const indexOfExistingSku =
          parsedLocalStorageCart.indexOf(existingCartItem);

        const existingQuantity =
          parsedLocalStorageCart[indexOfExistingSku].quantity;

        if (existingCartItem.productSku.stock - (existingQuantity + 1) < 0) {
          console.error('stock insufficient');
          return;
        }

        parsedLocalStorageCart[indexOfExistingSku].quantity += 1;

        updatedCart = [...parsedLocalStorageCart];

        console.log(updatedCart);
      } else {
        updatedCart = [...parsedLocalStorageCart, item];
      }

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      this._cart$.next(updatedCart);
    }
  }

  updateCart(item: CartItem): void {
    // TODO: for quantity +/-
  }

  removeFromCart(item: CartItem): void {
    const localStorageCart = localStorage.getItem('cart');
    if (localStorageCart) {
      const parsedLocalStorageCart: CartItem[] = JSON.parse(localStorageCart);

      const targetCartItem = parsedLocalStorageCart.find(
        (cartItem: CartItem) => cartItem.productSku.id === item.productSku.id
      );

      const updatedCart = parsedLocalStorageCart.filter(
        (cartItem: CartItem) => cartItem !== targetCartItem
      );

      localStorage.setItem('cart', JSON.stringify(updatedCart));
      this._cart$.next(updatedCart);
    }
  }

  openCartMenu(): void {
    this._cartMenuIsOpen$.next(true);
  }

  closeCartMenu(): void {
    this._cartMenuIsOpen$.next(false);
  }
}
