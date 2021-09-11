import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  HostListener,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NON_NEGATIVE_NUMBER_REGEX,
  Product,
  ProductSku,
  ProductsService,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { take } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-product-sku-editor',
  templateUrl: './product-sku-editor.component.html',
  styleUrls: ['./product-sku-editor.component.scss'],
})
export class ProductSkuEditorComponent implements OnInit {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.editStockModalOpen) {
      this.onCloseModal();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.editStockModalOpen) {
      this.onUpdateStock();
    }
  }

  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;
  form: FormGroup;

  @Input() product: Product;
  @Input()
  label = '產品庫存管理 Product Stock Management';

  @Output() generatedSkus: EventEmitter<ProductSku[]> = new EventEmitter<
    ProductSku[]
  >();

  editStockModalOpen: boolean = false;
  skuToEdit: ProductSku | null = null;

  get everyVariantHasValue(): boolean {
    const everyVariantHasValue: boolean = this.product.variants.every(
      (v) => v.variantValues.length > 0
    );

    return everyVariantHasValue;
  }

  constructor(
    private fb: FormBuilder,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.form = this.fb.group({
      skuId: [null, [Validators.required]],
      stock: [
        0,
        [Validators.required, Validators.pattern(NON_NEGATIVE_NUMBER_REGEX)],
      ],
    });
  }

  onGenerateSku(): void {
    this.productService
      .generateProductSkus(this.product.id)
      .pipe(take(1))
      .subscribe((skus: ProductSku[]) => {
        this.product.skus = skus;
        this.generatedSkus.emit(skus);
      });
  }

  onUpdateStock(): void {
    if (this.form.invalid) {
      this.clrForm.markAsTouched();
      this.form.markAllAsTouched();
      return;
    }

    this.productService
      .updateProductSkuStock(this.form.value)
      .pipe(take(1))
      .subscribe((sku: ProductSku) => {
        const oldSku = this.product.skus.find((oldSku) => oldSku.id === sku.id);

        if (oldSku) {
          const oldSkuIndex = this.product.skus.indexOf(oldSku);

          this.product.skus[oldSkuIndex] = sku;

          this.generatedSkus.emit(this.product.skus);
        }

        this.onCloseModal();
      });
  }

  onOpenModal(sku: ProductSku): void {
    this.skuToEdit = sku;

    this.form.patchValue({
      skuId: sku.id,
      stock: sku.stock,
    });

    this.editStockModalOpen = true;
  }

  onCloseModal(): void {
    this.editStockModalOpen = false;
    this.skuToEdit = null;
    this.form.reset();
  }
}
