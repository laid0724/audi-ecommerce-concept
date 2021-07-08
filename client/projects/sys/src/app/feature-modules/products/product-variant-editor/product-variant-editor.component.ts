import {
  Component,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NON_NEGATIVE_NUMBER_REGEX,
  Product,
  ProductsService,
  ProductVariant,
  ProductVariantValue,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { indexOf } from 'lodash';
import { take } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-product-variant-editor',
  templateUrl: './product-variant-editor.component.html',
  styleUrls: ['./product-variant-editor.component.scss'],
})
export class ProductVariantEditorComponent implements OnInit {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.editVariantModalOpen) {
      this.toggleEditVariantModal();
    }
    if (this.editVariantValueModalOpen) {
      this.toggleEditVariantValueModal();
    }
    if (this.confirmDeleteVariantModalOpen) {
      this.toggleDeleteVariantModal();
    }
    if (this.confirmDeleteVariantValueModalOpen) {
      this.toggleDeleteVariantValueModal();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.editVariantModalOpen) {
      this.variantId == null
        ? this.addVariant()
        : this.updateVariant(this.variantId as unknown as number);
    }
    if (this.editVariantValueModalOpen) {
      this.variantValueId == null
        ? this.addVariantValue()
        : this.updateVariantValue(this.variantValueId as unknown as number);
    }
    if (this.confirmDeleteVariantModalOpen) {
      this.deleteVariant(this.variantToDelete!.id);
    }
    if (this.confirmDeleteVariantValueModalOpen) {
      this.deleteVariantValue(this.variantValueToDelete!.id);
    }
  }

  @ViewChild('variantClrForm', { read: ClrForm })
  variantClrForm: ClrForm;
  @ViewChild('variantValueClrForm', { read: ClrForm })
  variantValueClrForm: ClrForm;

  @Input()
  product: Product;
  @Input()
  label = '產品選項 Product Options';
  @Input()
  hasError: boolean | null = false;

  variantForm: FormGroup;
  variantValueForm: FormGroup;

  variantToDelete: ProductVariant | null;
  variantValueToDelete: ProductVariantValue | null;

  editVariantModalOpen = false;
  editVariantValueModalOpen = false;
  confirmDeleteVariantModalOpen = false;
  confirmDeleteVariantValueModalOpen = false;

  get productId(): number {
    return this.product.id;
  }

  get variantId(): number | null {
    const variantId = this.variantForm.get('id')?.value;
    return variantId;
  }

  get variantValueId(): number | null {
    const variantValueId = this.variantValueForm.get('id')?.value;
    return variantValueId;
  }

  private _productVariants: ProductVariant[] = [];

  get productVariants(): ProductVariant[] {
    return this._productVariants ?? [];
  }

  set productVariants(value: ProductVariant[]) {
    this._productVariants = value;
  }

  constructor(
    private productService: ProductsService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.productVariants = this.product.variants;

    this.initForms();
  }

  initForms(): void {
    this.variantForm = this.fb.group({
      id: [null],
      productId: [this.productId, Validators.required],
      name: [null, Validators.required],
    });

    this.variantValueForm = this.fb.group({
      id: [null],
      productId: [this.productId, Validators.required],
      variantId: [null, Validators.required],
      name: [null, Validators.required],
      stock: [
        0,
        [Validators.required, Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)],
      ],
    });
  }

  addVariant(): void {
    if (this.variantForm.invalid) {
      this.variantClrForm.markAsTouched();
      this.variantForm.markAllAsTouched();
      return;
    }

    this.productService
      .addProductVariant(this.variantForm.value)
      .pipe(take(1))
      .subscribe((productVariant: ProductVariant) => {
        this.productVariants = [...this.productVariants, productVariant];

        this.checkValidityForErrorState();
        this.toggleEditVariantModal();
      });
  }

  updateVariant(variantId: number): void {
    if (this.variantForm.invalid) {
      this.variantClrForm.markAsTouched();
      this.variantForm.markAllAsTouched();
      return;
    }

    this.productService
      .updateProductVariant({
        ...this.variantForm.value,
        id: variantId,
      })
      .pipe(take(1))
      .subscribe((updatedProductVariant: ProductVariant) => {
        const productVariantPreviousState = this.productVariants.find(
          (pv: ProductVariant) => pv.id === updatedProductVariant.id
        );

        const previousStateIndex = this.productVariants.indexOf(
          productVariantPreviousState as ProductVariant
        );

        this.productVariants[previousStateIndex] = updatedProductVariant;

        this.toggleEditVariantModal();
      });
  }

  deleteVariant(variantId: number): void {
    this.productService
      .deleteProductVariant(variantId)
      .pipe(take(1))
      .subscribe(() => {
        this.productVariants = this.productVariants.filter(
          (pv) => pv.id !== variantId
        );

        this.checkValidityForErrorState();
        this.toggleDeleteVariantModal();
      });
  }

  toggleEditVariantModal(variantId?: number): void {
    const variantIdControl = this.variantForm.get('id');
    const variantNameControl = this.variantForm.get('name');

    if (variantId) {
      variantIdControl?.patchValue(variantId);
      variantNameControl?.patchValue(
        this.productVariants.find((pv) => pv.id === variantId)?.name
      );
    } else {
      this.variantForm.reset({
        productId: this.productId,
      });
    }

    this.editVariantModalOpen = !this.editVariantModalOpen;
  }

  toggleDeleteVariantModal(variant?: ProductVariant): void {
    if (variant) {
      this.variantToDelete = variant;
    } else {
      this.variantToDelete = null;
    }

    this.confirmDeleteVariantModalOpen = !this.confirmDeleteVariantModalOpen;
  }

  addVariantValue(): void {
    if (this.variantValueForm.invalid) {
      this.variantValueClrForm.markAsTouched();
      this.variantValueForm.markAllAsTouched();
      return;
    }

    this.productService
      .addProductVariantValue(this.variantValueForm.value)
      .pipe(take(1))
      .subscribe((variantValue: ProductVariantValue) => {
        const affectedVariant = this.productVariants.find(
          (pv) => pv.id === variantValue.variantId
        );

        if (affectedVariant !== undefined) {
          affectedVariant.variantValues = [
            ...affectedVariant.variantValues,
            variantValue,
          ];
        }

        this.checkValidityForErrorState();
        this.toggleEditVariantValueModal();
      });
  }

  updateVariantValue(variantValueId: number): void {
    if (this.variantValueForm.invalid) {
      this.variantValueClrForm.markAsTouched();
      this.variantValueForm.markAllAsTouched();
      return;
    }

    this.productService
      .updateProductVariantValue({
        ...this.variantValueForm.value,
        id: variantValueId,
      })
      .pipe(take(1))
      .subscribe((updatedVariantValue: ProductVariantValue) => {
        const affectedVariant = this.productVariants.find((pv) =>
          pv.variantValues.map((vv) => vv.id).includes(updatedVariantValue.id)
        );

        if (affectedVariant !== undefined) {
          const indexOfAffectedVariant =
            this.productVariants.indexOf(affectedVariant);

          const previousVariantValues =
            this.productVariants[indexOfAffectedVariant].variantValues;

          const previousVariantValue = previousVariantValues.find(
            (vv) => vv.id === updatedVariantValue.id
          );

          if (previousVariantValue != null) {
            const indexOfPreviousVariantValue =
              previousVariantValues.indexOf(previousVariantValue);

            previousVariantValues[indexOfPreviousVariantValue] =
              updatedVariantValue;
          }
        }

        this.toggleEditVariantValueModal();
      });
  }

  deleteVariantValue(variantValueId: number): void {
    this.productService
      .deleteProductVariantValue(variantValueId)
      .pipe(take(1))
      .subscribe(() => {
        const variant = this.productVariants.find(
          (pv) =>
            pv.variantValues.find((vv) => vv.id === variantValueId) !==
            undefined
        );

        if (variant !== undefined) {
          const indexOfVariant = this.productVariants.indexOf(variant);

          this.productVariants[indexOfVariant].variantValues =
            this.productVariants[indexOfVariant].variantValues.filter(
              (vv) => vv.id !== variantValueId
            );
        }

        this.checkValidityForErrorState();
        this.toggleDeleteVariantValueModal();
      });
  }

  toggleEditVariantValueModal(
    variantId?: number,
    variantValueId?: number
  ): void {
    const variantIdControl = this.variantValueForm.get('variantId');
    const variantValueIdControl = this.variantValueForm.get('id');
    const variantValueNameControl = this.variantValueForm.get('name');
    const variantValueStockControl = this.variantValueForm.get('stock');

    if (variantId) {
      variantIdControl?.patchValue(variantId);
      if (variantValueId) {
        variantValueIdControl?.patchValue(variantValueId);

        const matchingVariantValue = this.productVariants
          .find((pv) => pv.id === variantId)
          ?.variantValues.find((vv) => vv.id === variantValueId);

        if (matchingVariantValue != null) {
          variantValueNameControl?.patchValue(matchingVariantValue.name);
          variantValueStockControl?.patchValue(matchingVariantValue.stock);
        }
      }
    } else {
      this.variantValueForm.reset({
        productId: this.productId,
      });
    }

    this.editVariantValueModalOpen = !this.editVariantValueModalOpen;
  }

  toggleDeleteVariantValueModal(variantValue?: ProductVariantValue): void {
    if (variantValue) {
      this.variantValueToDelete = variantValue;
    } else {
      this.variantValueToDelete = null;
    }

    this.confirmDeleteVariantValueModalOpen =
      !this.confirmDeleteVariantValueModalOpen;
  }

  checkValidityForErrorState(): void {
    const someVariantHasValue: boolean = this.productVariants.some(
      (v) => v.variantValues.length > 0
    );

    this.hasError = !someVariantHasValue;
  }
}
