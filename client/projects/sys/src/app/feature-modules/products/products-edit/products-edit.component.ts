import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import {
  formatClrDateToUTCString,
  getAllErrors,
  isEqualOrGreaterThanValidator,
  NON_NEGATIVE_NUMBER_REGEX,
  Product,
  ProductsService,
  WysiwygRowType,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import {
  addWysiwygRow,
  wysiwygGridValidatorBuilderFn,
} from '../../../component-modules/forms-component/wysiwyg-grid/wysiwyg-grid.component';

@Component({
  selector: 'audi-sys-products-edit',
  templateUrl: './products-edit.component.html',
  styleUrls: ['./products-edit.component.scss'],
})
export class ProductsEditComponent implements OnInit, OnDestroy {
  // TODO: can deactivate guard and dynamically generate modal component to confirm
  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  productId: number | null = null;
  product: Product | null = null;

  productForm: FormGroup;

  destroy$ = new Subject<boolean>();

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private toastr: ToastrService
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
              this.productForm.patchValue(product);

              const { wysiwyg } = product;

              const wysiwygGrid = this.productForm.get('wysiwygGrid');

              if (wysiwygGrid) {
                const rowsFA: FormArray = wysiwygGrid.get('rows') as FormArray;

                rowsFA.clear();

                if (Array.isArray(wysiwyg?.rows) && wysiwyg?.rows?.length > 0) {
                  wysiwyg.rows.forEach((row) => {
                    const widthLayout = row.columns
                      .map(({ width }) => width)
                      .toString()
                      .replace(',', '-') as WysiwygRowType;
                    addWysiwygRow(this.fb, rowsFA, widthLayout);
                  });
                  wysiwygGrid.patchValue(wysiwyg);
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

    getProductInfoFromParams$.subscribe();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      // TODO: photos
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
      wysiwygGrid: this.fb.group(
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
      discountDeadline: [{ value: null, disabled: true }],
    });
  }

  onSetMainPhoto(): void {}
  onAddPhoto(): void {}
  onDeletePhoto(): void {}

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.clrForm.markAsTouched();
      this.productForm.markAllAsTouched();
      console.log(getAllErrors(this.productForm));
      return;
    }

    // const { discountDeadline } = this.productForm.value;

    let formValue = {
      ...this.productForm.value,
      // discountDeadline: formatClrDateToUTCString(discountDeadline),
    };

    let upsertObservable$;

    if (this.productId != null) {
      formValue = {
        ...formValue,
        productId: this.productId,
      };
      upsertObservable$ = this.productService.updateProduct(formValue);
    } else {
      upsertObservable$ = this.productService.addProduct(formValue);
    }

    if (upsertObservable$ != undefined) {
      upsertObservable$.subscribe((product: Product) => {
        if (this.productId == null) {
          this.router.navigate([`/manage/products/items/${product.id}`], {
            queryParamsHandling: '',
          });
          this.toastr.success('成功建立產品 Product created successfully');
        } else {
          this.toastr.info('更新成功 Product');
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
