import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AccountService,
  LanguageCode,
  LanguageStateService,
  Product,
  ProductsService,
  User,
} from '@audi/data';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-members-liked-product',
  templateUrl: './members-liked-product.component.html',
  styleUrls: ['./members-liked-product.component.scss'],
})
export class MembersLikedProductComponent implements OnInit, OnDestroy {
  user: User | null = null;
  likedProducts: Product[] = [];

  loading = true;

  destroy$ = new Subject<boolean>();

  get language(): LanguageCode {
    return this.languageService.getCurrentLanguage();
  }

  constructor(
    private accountService: AccountService,
    private productService: ProductsService,
    private languageService: LanguageStateService
  ) {}

  ngOnInit(): void {
    this.accountService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: User | null) => {
        this.user = user;
      });

    this.productService
      .getLikedProducts()
      .pipe(take(1))
      .subscribe((likedProducts: Product[]) => {
        this.likedProducts = likedProducts;
        this.loading = false;
      });
  }

  isLikedByUser(productId: number): boolean {
    if (this.user) {
      return this.user.likedProductIds.includes(productId);
    }
    return false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
