import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  BusyService,
  clrDateFormat,
  formatClrDateToUTCString,
  formatServerTimeToClrDate,
  getAllErrors,
  GREATER_THAN_ZERO_REGEX,
  isEarlierThanTodayValidator,
  isLessThanValidator,
  Product,
  ProductPhoto,
  ProductSku,
  ProductsService,
  ProductVariant,
  ProductVariantValue,
  WysiwygRowType,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap, map } from 'rxjs/operators';
import {
  addWysiwygRow,
  wysiwygGridValidatorBuilderFn,
} from '../../../component-modules/form-components/wysiwyg-grid/wysiwyg-grid.component';

// TODO: can deactivate guard and dynamically generate modal component to confirm
// FIXME: if you are in an en product, you refresh the page the the language state
//        will default to zh and the product category selector will show zh categories

@Component({
  selector: 'audi-sys-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss'],
})
export class ProductsEditComponent implements OnInit, OnDestroy {
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  productId: number | null = null;
  product: Product | null = null;

  productForm: FormGroup;
  today = clrDateFormat(new Date());

  destroy$ = new Subject<boolean>();

  invalidVariantsAndSkusError = false;

  get invalidVariantsAndSkus$(): Observable<boolean> {
    if (this.productId) {
      const invalidVariantsAndSkus$: Observable<boolean> = this.productService
        .getProductVariants(this.productId)
        .pipe(
          take(1),
          map((variants: ProductVariant[]) => {
            const everyVariantHasValue: boolean = variants.every(
              (v) => v.variantValues.length > 0
            );
            return !everyVariantHasValue || !this.productHasSkus;
          })
        );
      return invalidVariantsAndSkus$;
    }
    return of(false);
  }

  get productHasSkus(): boolean {
    if (this.productId && this.product) {
      return this.product.skus.length > 0;
    }
    return false;
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private toastr: ToastrService,
    private busyService: BusyService
  ) {}

  ngOnInit(): void {
    this.initForm();

    const isDiscountedControl = this.productForm.get('isDiscounted');
    const priceControl = this.productForm.get('priceControl');
    const discountDeadlineControl = this.productForm.get('discountDeadline');
    const discountAmountControl = this.productForm.get('discountAmount');
    const isVisibleControl = this.productForm.get('isVisible');

    if (
      isDiscountedControl &&
      discountAmountControl &&
      discountDeadlineControl
    ) {
      isDiscountedControl.valueChanges.subscribe((isDiscounted: boolean) => {
        if (isDiscounted) {
          discountDeadlineControl.enable();
          discountAmountControl.enable();
        } else {
          discountDeadlineControl.disable();
          discountAmountControl.disable();
        }
      });
    }

    if (priceControl && discountAmountControl) {
      priceControl.valueChanges.subscribe((price: number) => {
        discountAmountControl.updateValueAndValidity({ onlySelf: true });
      });
    }

    const getProductInfoFromParams$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => {
        if (params.has('productId')) {
          const productId = parseInt(params.get('productId') as string);
          this.productId = productId;
          return this.productService.getProduct(productId).pipe(
            tap((product: Product) => {
              if (isVisibleControl) {
                isVisibleControl.enable();
              }

              this.product = product;

              this.productForm.patchValue({
                ...product,
                discountDeadline: formatServerTimeToClrDate(
                  product?.discountDeadline as Date
                ),
              });

              const { wysiwyg } = product;

              const wysiwygControl = this.productForm.get('wysiwyg');

              if (wysiwygControl) {
                const rowsFA: FormArray = wysiwygControl.get(
                  'rows'
                ) as FormArray;

                rowsFA.clear();

                if (Array.isArray(wysiwyg?.rows) && wysiwyg?.rows?.length > 0) {
                  wysiwyg.rows.forEach((row) => {
                    const widthLayout = row.columns
                      .map(({ width }) => width)
                      .toString()
                      .replace(',', '-') as WysiwygRowType;
                    addWysiwygRow(this.fb, rowsFA, widthLayout);
                  });
                  wysiwygControl.patchValue(wysiwyg);
                }
              }
            })
          );
        }

        return this.route.queryParamMap.pipe(
          tap((queryParams: ParamMap) => {
            const productCategoryIdControl =
              this.productForm.get('productCategoryId');
            if (queryParams.has('productCategoryId')) {
              const productCategoryId = parseInt(
                queryParams.get('productCategoryId') as string
              );
              productCategoryIdControl?.patchValue(productCategoryId);
            } else {
              productCategoryIdControl?.reset();
            }
          })
        );
      }),
      takeUntil(this.destroy$)
    );

    getProductInfoFromParams$.subscribe((_) => {
      this.busyService.idle();
    });
  }

  initForm(): void {
    this.productForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      productCategoryId: [null, Validators.required],
      price: [
        null,
        [Validators.required, Validators.pattern(GREATER_THAN_ZERO_REGEX)],
      ],
      wysiwyg: this.fb.group(
        {
          rows: this.fb.array([]),
        },
        {
          validators: [wysiwygGridValidatorBuilderFn([Validators.required])],
        }
      ),
      isVisible: [
        { value: false, disabled: true },
        [Validators.required],
        this.invalidVariantsAndSkusAsyncValidator(),
      ],
      isDiscounted: [false, Validators.required],
      discountAmount: [
        { value: null, disabled: true },
        [
          Validators.required,
          Validators.pattern(GREATER_THAN_ZERO_REGEX),
          isLessThanValidator('price'),
        ],
      ],
      discountDeadline: [
        { value: null, disabled: true },
        [isEarlierThanTodayValidator],
      ],
    });
  }

  invalidVariantsAndSkusAsyncValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      return this.invalidVariantsAndSkus$.pipe(
        map((isInvalid) => {
          if (control.value === true) {
            return isInvalid ? { invalidVariantsAndSkusError: true } : null;
          } else {
            return null;
          }
        })
      );
    };
  }

  onVariantUpdate(variants: any): void {
    if (this.product !== null) {
      this.product.variants = variants;

      const everyVariantHasValue: boolean = variants.every(
        (v: ProductVariant) => v.variantValues.length > 0
      );
      if (variants.length < 1 || !everyVariantHasValue) {
        this.productService
          .hideProduct(this.product.id)
          .pipe(take(1))
          .subscribe((_) => {
            this.productForm.get('isVisible')?.setValue(false);
          });
      }

      const allVariantValueIds = variants
        .flatMap((variant: ProductVariant) => variant.variantValues)
        .map((variantValue: ProductVariantValue) => variantValue.id);

      this.product.skus = this.product.skus.filter((sku: ProductSku) =>
        sku.variantValueIds.every((id) => allVariantValueIds.includes(id))
      );
    }
  }

  onSkusGeneration(skus: any): void {
    if (this.product !== null) {
      this.product.skus = skus;
    }
  }

  onPhotoChanges(photos: ProductPhoto[]): void {
    if (this.product != null) {
      this.product.photos = photos;
    }
  }

  onCreate(): void {
    if (this.productForm.invalid) {
      this.clrForm.markAsTouched();
      this.productForm.markAllAsTouched();
      console.log(getAllErrors(this.productForm));
      this.toastr.error('Saving failed', '儲存失敗');
      return;
    }

    const { discountDeadline } = this.productForm.value;

    let formValue = {
      ...this.productForm.value,
      discountDeadline: formatClrDateToUTCString(discountDeadline),
    };

    this.productService
      .addProduct(formValue)
      .pipe(take(1))
      .subscribe((product: Product) => {
        this.router.navigate([`/manage/products/items/${product.id}`], {
          queryParamsHandling: '',
        });
        this.toastr.success('Product created successfully', '成功建立產品');
      });
  }

  onSave(): void {
    this.invalidVariantsAndSkus$.subscribe(
      (invalidVariantsAndSkusError: boolean) => {
        if (this.productForm.invalid || invalidVariantsAndSkusError) {
          if (invalidVariantsAndSkusError) {
            this.invalidVariantsAndSkusError = true;
          }

          this.clrForm.markAsTouched();
          this.productForm.markAllAsTouched();

          let errors = getAllErrors(this.productForm);

          if (invalidVariantsAndSkusError) {
            errors = {
              ...errors,
              productForm: { invalidVariantsAndSkusError },
            };
          }

          console.log(errors);

          this.toastr.error('Saving failed', '儲存失敗');
        } else {
          this.invalidVariantsAndSkusError = false;

          const { discountDeadline } = this.productForm.value;

          let formValue = {
            ...this.productForm.value,
            id: this.productId,
            discountDeadline: formatClrDateToUTCString(discountDeadline),
          };

          this.productService
            .updateProduct(formValue)
            .pipe(take(1))
            .subscribe((product: Product) => {
              this.product = product;
              this.toastr.info('Product updated', '更新成功');
            });
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
