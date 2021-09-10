import { DOCUMENT } from '@angular/common';
import {
  Component,
  OnInit,
  EventEmitter,
  Inject,
  Input,
  Output,
  Renderer2,
} from '@angular/core';
import { CartItem, LanguageCode, LanguageStateService } from '@audi/data';
import { Observable } from 'rxjs';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'audi-cart-nav',
  templateUrl: './cart-nav.component.html',
  styleUrls: ['./cart-nav.component.scss'],
})
export class CartNavComponent implements OnInit {
  cart$: Observable<CartItem[]> = this.cartService.cart$;
  cartMenuIsOpen$: Observable<boolean> = this.cartService.cartMenuIsOpen$;

  _menuIsOpen: boolean = false;

  get menuIsOpen(): boolean {
    return this._menuIsOpen;
  }

  @Input('menuIsOpen')
  set menuIsOpen(isOpen: boolean) {
    this._menuIsOpen = isOpen;

    this.toggleMenuState();
  }

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  @Output() menuIsOpenChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    private cartService: CartService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.cartMenuIsOpen$.subscribe(
      (menuIsOpen: boolean) => (this.menuIsOpen = menuIsOpen)
    );
  }

  toggleMenuState(): void {
    this.menuIsOpen
      ? this.renderer.addClass(this.document.body, 'scroll-disabled')
      : this.renderer.removeClass(this.document.body, 'scroll-disabled');

    this.menuIsOpenChange.emit(this.menuIsOpen);
  }
}
