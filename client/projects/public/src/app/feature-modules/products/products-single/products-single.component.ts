import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  AccountService,
  BusyService,
  isNullOrEmptyString,
  LanguageStateService,
  PaginatedResult,
  Product,
  ProductPhoto,
  ProductSku,
  ProductsService,
  User,
} from '@audi/data';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';

// TODO: product add to cart

@Component({
  selector: 'audi-products-single',
  templateUrl: './products-single.component.html',
  styleUrls: ['./products-single.component.scss'],
})
export class ProductsSingleComponent implements OnInit, OnDestroy {
  product: Product;
  similarProducts: Product[];

  user: User | null = null;

  addToCartForm: FormGroup;
  variantSelectionForm: FormGroup;

  fullpageConfig: any;
  fullpageRef: any;

  language = this.languageService.getCurrentLanguage();
  isLoading = true;

  get imgUrls(): string[] {
    if (this.product) {
      return this.product.photos.map((p) => p.url);
    }
    return [];
  }

  get hasWysiwygContent(): boolean {
    const rows = this.product.wysiwyg.rows;
    return (
      this.product &&
      this.product.wysiwyg &&
      rows &&
      Array.isArray(rows) &&
      rows.length > 0 &&
      rows.some((row) =>
        row.columns.some((column) => !isNullOrEmptyString(column.content))
      )
    );
  }

  get outOfStock(): boolean {
    return this.product.stock === 0;
  }

  get selectedValueIds(): number[] {
    const selectedValueIds = this.selections.value.map((v: string) => +v);

    return selectedValueIds;
  }

  get selectionIsEmpty(): boolean {
    return this.selectedValueIds.some((v: number) => v === 0);
  }

  get selectionHasStock(): boolean {
    const matchingSku = this.product.skus.find((sku: ProductSku) =>
      sku.variantValueIds.every((id) => this.selectedValueIds.includes(id))
    );

    if (matchingSku !== undefined && matchingSku.stock > 0) return true;

    return false;
  }

  get selections(): FormArray {
    const selections = this.variantSelectionForm.get('selections') as FormArray;
    return selections;
  }

  public isNullOrEmptyString: (val: string | null | undefined) => boolean =
    isNullOrEmptyString;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private accountService: AccountService,
    private productService: ProductsService,
    private languageService: LanguageStateService,
    private busyService: BusyService
  ) {
    // for more details on config options please visit fullPage.js docs
    // see: https://github.com/alvarotrigo/fullPage.js
    this.fullpageConfig = {
      // fullpage options
      licenseKey: 'YOUR_KEY_HERE',
      verticalCentered: false,
      fitToSection: true,
      scrollOverflow: true,
      resetSlider: true,
      paddingTop: '56px', // fixed header height
    };
  }

  ngOnInit(): void {
    this.initVariantSelectionForm();
    this.initAddToCartForm();

    this.accountService.currentUser$.subscribe((user: User | null) => {
      this.user = user;
    });

    this.route.paramMap
      .pipe(
        tap((_) => (this.isLoading = true)),
        filter((params: ParamMap) => params.has('productId')),
        switchMap((params: ParamMap) =>
          this.productService.getProduct(+params.get('productId')!)
        ),
        tap((product: Product) => {
          this.product = product;

          this.selections.clear();

          product.variants.forEach((variant) => {
            this.selections.push(this.fb.control(null));
          });
        }),
        switchMap((product: Product) =>
          this.productService.getIsVisibleProducts({
            pageNumber: 1,
            pageSize: 10,
            includeChildrenProducts: true,
            productCategoryId: product.productCategoryId,
          })
        ),
        tap(
          (paginatedProducts: PaginatedResult<Product[]>) =>
            (this.similarProducts = paginatedProducts.result.filter(
              (p) => p.id !== this.product.id
            ))
        )
      )
      .subscribe(
        (_) => {
          this.isLoading = false;
          this.busyService.clear();
          this.busyService.idle();
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        }
      );
  }

  initVariantSelectionForm(): void {
    this.variantSelectionForm = this.fb.group({
      selections: this.fb.array([]),
    });
  }

  initAddToCartForm(): void {
    // TODO
  }

  convertToFormControl(abstractControl: AbstractControl | null): FormControl {
    const control = abstractControl as FormControl;
    return control;
  }

  getFullpageRef(fullpageRef: any) {
    this.fullpageRef = fullpageRef;

    if (this.hasWysiwygContent) {
      /*
        the height of the full page sections gets messed up after
        the wysiwyg content renders (if height is > than 1 section page)
        need to re-init the fullpage ref to refit sections to the correct section
        heights
      */
      this.fullpageRef.reBuild();
    }
  }

  getProductMainPhoto(photos: ProductPhoto[]): ProductPhoto | undefined {
    return photos.find((p) => p.isMain);
  }

  productIsLikedByUser(productId: number): boolean {
    if (this.user) {
      return this.user.likedProductIds.some((id) => id === productId);
    }

    return false;
  }

  onAddToCart(): void {
    // TODO:
  }

  onLikeClicked(e: Event, productId: number): void {
    e.preventDefault();
    e.stopPropagation();

    if (this.user != null) {
      this.productIsLikedByUser(productId)
        ? this.unlikeProduct(productId)
        : this.likeProduct(productId);
    }

    if (this.user == null) {
      this.directToLogin();
    }
  }

  likeProduct(productId: number): void {
    this.productService
      .likeProduct(productId)
      .pipe(take(1))
      .subscribe((likedProducts: Product[]) => {
        this.accountService.setCurrentUser({
          ...(this.user as User),
          likedProductIds: likedProducts.map((p: Product) => p.id) as number[],
        });
      });
  }

  unlikeProduct(productId: number): void {
    this.productService
      .unlikeProduct(productId)
      .pipe(take(1))
      .subscribe((likedProducts: Product[]) => {
        this.accountService.setCurrentUser({
          ...(this.user as User),
          likedProductIds: likedProducts.map((p: Product) => p.id) as number[],
        });
      });
  }

  directToLogin(): void {
    this.router.navigate(['/', this.language, 'login'], {
      queryParams: { redirectTo: this.router.routerState.snapshot.url },
    });
  }

  ngOnDestroy(): void {
    if (this.fullpageRef) {
      this.fullpageRef.destroy('all');
    }
  }
}
