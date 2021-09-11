import { Injectable } from '@angular/core';
import { CartItem, LanguageCode, LanguageStateService } from '@audi/data';
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

  private currentLanguage: LanguageCode;

  constructor(private languageService: LanguageStateService) {
    languageService.language$.subscribe((language: LanguageCode) => {
      this.currentLanguage = language;
      this.loadCartFromLocalStorage(language);
    });
  }

  loadCartFromLocalStorage(language: LanguageCode): void {
    const localStorageCart = localStorage.getItem(`cart-${language}`);

    if (localStorageCart === null) {
      this.resetCart();
    } else {
      this._cart$.next(JSON.parse(localStorageCart));
    }
  }

  addToCart(item: CartItem): void {
    const localStorageCart = localStorage.getItem(
      `cart-${this.currentLanguage}`
    );
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
      } else {
        updatedCart = [...parsedLocalStorageCart, item];
      }

      localStorage.setItem(
        `cart-${this.currentLanguage}`,
        JSON.stringify(updatedCart)
      );
      this._cart$.next(updatedCart);
    }
  }

  updateCartQuantity(item: CartItem, newQuantity: number): void {
    const localStorageCart = localStorage.getItem(
      `cart-${this.currentLanguage}`
    );

    if (localStorageCart) {
      const parsedLocalStorageCart: CartItem[] = JSON.parse(localStorageCart);

      const cartItemToUpdate = parsedLocalStorageCart.find(
        (cartItem: CartItem) => cartItem.productSku.id === item.productSku.id
      );

      if (cartItemToUpdate) {
        const indexOfCartItemToUpdate =
          parsedLocalStorageCart.indexOf(cartItemToUpdate);

        const existingQuantity = cartItemToUpdate.quantity;

        if (newQuantity > existingQuantity) {
          if (cartItemToUpdate.productSku.stock - (existingQuantity + 1) < 0) {
            console.error('stock insufficient');
            return;
          }
        }

        if (newQuantity <= 0) {
          this.removeFromCart(cartItemToUpdate);
          return;
        }

        parsedLocalStorageCart[indexOfCartItemToUpdate].quantity = newQuantity;

        localStorage.setItem(
          `cart-${this.currentLanguage}`,
          JSON.stringify(parsedLocalStorageCart)
        );

        this._cart$.next(parsedLocalStorageCart);
      }
    }
  }

  removeFromCart(item: CartItem): void {
    const localStorageCart = localStorage.getItem(
      `cart-${this.currentLanguage}`
    );
    if (localStorageCart) {
      const parsedLocalStorageCart: CartItem[] = JSON.parse(localStorageCart);

      const targetCartItem = parsedLocalStorageCart.find(
        (cartItem: CartItem) => cartItem.productSku.id === item.productSku.id
      );

      const updatedCart = parsedLocalStorageCart.filter(
        (cartItem: CartItem) => cartItem !== targetCartItem
      );

      localStorage.setItem(
        `cart-${this.currentLanguage}`,
        JSON.stringify(updatedCart)
      );
      this._cart$.next(updatedCart);
    }
  }

  resetCart(): void {
    localStorage.setItem(`cart-${this.currentLanguage}`, JSON.stringify([]));
    this._cart$.next([]);
  }

  openCartMenu(): void {
    this._cartMenuIsOpen$.next(true);
  }

  closeCartMenu(): void {
    this._cartMenuIsOpen$.next(false);
  }
}
