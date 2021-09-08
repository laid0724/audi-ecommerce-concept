import { DOCUMENT } from '@angular/common';
import { Component, Inject, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountService,
  CartItem,
  LanguageCode,
  LanguageStateService,
  User,
} from '@audi/data';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '../../feature-modules/cart/services/cart.service';

@Component({
  selector: 'audi-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  menuIsOpen = false;
  cartMenuIsOpen = false;

  language$: Observable<LanguageCode> = this.languageService.language$;
  cart$: Observable<CartItem[]> = this.cartService.cart$;
  isLoggedIn$: Observable<boolean> = this.accountService.currentUser$.pipe(
    map((user: User | null) => !!user)
  );

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private languageService: LanguageStateService,
    private accountService: AccountService,
    private cartService: CartService,
    private router: Router,
    private renderer: Renderer2
  ) {}

  toggleMenuState(isOpen?: boolean): void {
    this.menuIsOpen = isOpen ?? !this.menuIsOpen;

    this.menuIsOpen
      ? this.renderer.addClass(this.document.body, 'scroll-disabled')
      : this.renderer.removeClass(this.document.body, 'scroll-disabled');
  }

  closeAllMenu(): void {
    this.toggleMenuState(false);
    this.cartMenuIsOpen = false;
  }

  directToLogin(): void {
    this.router.navigate(
      ['/', this.languageService.getCurrentLanguage(), 'login'],
      {
        queryParams: { redirectTo: this.router.routerState.snapshot.url },
      }
    );
  }

  logout(): void {
    this.accountService.logout();
  }
}
