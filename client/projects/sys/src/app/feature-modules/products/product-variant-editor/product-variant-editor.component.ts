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
    if (this.confirmDeleteVariantModalOpen) {
      this.toggleDeleteVariantModal();
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

    if (this.confirmDeleteVariantModalOpen) {
      this.deleteVariant(this.variantToDelete!.id);
    }
  }

  @ViewChild('variantValueClrForm', { static: false }) variantClrForm: ClrForm;
  @ViewChild('variantClrForm', { static: false }) variantValueClrForm: ClrForm;

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

  _productVariants: ProductVariant[] = [];

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

        this.toggleDeleteVariantModal();
      });
  }

  toggleEditVariantModal(variantId?: number): void {
    const variantIdControl = this.variantForm.get('id');

    if (variantId) {
      variantIdControl?.patchValue(variantId);
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
}
