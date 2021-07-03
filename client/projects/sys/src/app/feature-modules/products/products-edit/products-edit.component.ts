import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  BusyService,
  clrDateFormat,
  formatClrDateToUTCString,
  formatServerTimeToClrDate,
  getAllErrors,
  isEarlierThanTodayValidator,
  isEqualOrGreaterThanValidator,
  NON_NEGATIVE_NUMBER_REGEX,
  Product,
  ProductPhoto,
  ProductsService,
  WysiwygRowType,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';
import {
  addWysiwygRow,
  wysiwygGridValidatorBuilderFn,
} from '../../../component-modules/forms-component/wysiwyg-grid/wysiwyg-grid.component';

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
      productCategoryId: [null, Validators.required],
      price: [
        null,
        [Validators.required, Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)],
      ],
      stock: [
        null,
        [Validators.required, Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)],
      ],
      wysiwyg: this.fb.group(
        {
          rows: this.fb.array([]),
        },
        {
          validators: [wysiwygGridValidatorBuilderFn([Validators.required])],
        }
      ),
      isVisible: [false, Validators.required],
      isDiscounted: [false, Validators.required],
      discountAmount: [
        { value: null, disabled: true },
        [
          Validators.pattern(NON_NEGATIVE_NUMBER_REGEX),
          isEqualOrGreaterThanValidator('price'),
        ],
      ],
      discountDeadline: [
        { value: null, disabled: true },
        [isEarlierThanTodayValidator],
      ],
    });
  }

  onPhotoChanges(photos: ProductPhoto[]): void {
    if (this.product != null) {
      this.product.photos = photos;
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.clrForm.markAsTouched();
      this.productForm.markAllAsTouched();
      console.log(getAllErrors(this.productForm));
      return;
    }

    const { discountDeadline } = this.productForm.value;

    let formValue = {
      ...this.productForm.value,
      discountDeadline: formatClrDateToUTCString(discountDeadline),
    };

    let upsertObservable$;

    if (this.productId != null) {
      formValue = {
        ...formValue,
        id: this.productId,
      };

      upsertObservable$ = this.productService.updateProduct(formValue);
    } else {
      upsertObservable$ = this.productService.addProduct(formValue);
    }

    if (upsertObservable$ != undefined) {
      upsertObservable$.pipe(take(1)).subscribe((product: Product) => {
        if (this.productId == null) {
          this.router.navigate([`/manage/products/items/${product.id}`], {
            queryParamsHandling: '',
          });
          this.toastr.success('成功建立產品 Product created successfully');
        } else {
          this.toastr.info('更新成功 Product updated');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
