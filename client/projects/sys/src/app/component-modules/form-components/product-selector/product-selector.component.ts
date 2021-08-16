import {
  Component,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { ProductsService, LanguageStateService, Product } from '@audi/data';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-product-selector',
  templateUrl: './product-selector.component.html',
  styleUrls: ['./product-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductSelectorComponent),
      multi: true,
    },
  ],
})
export class ProductSelectorComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input()
  label = '產品 Product';

  @Input()
  helperText = '';

  @Input()
  clrLayout: 'horizontal' | 'vertical' = 'horizontal';

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  get control(): FormControl {
    return (this.formControl ||
      this.controlContainer.control?.get(this.formControlName)) as FormControl;
  }

  products: Product[];

  loading = true;

  destroy$ = new Subject<boolean>();

  onChangeFn: any;
  onTouchedFn: any;

  constructor(
    private controlContainer: ControlContainer,
    private productsService: ProductsService,
    private languageState: LanguageStateService
  ) {}

  ngOnInit(): void {
    // we are chaining from the language state so that when language is selected this is refreshed accordingly
    this.languageState.language$
      .pipe(
        switchMap((_) => this.productsService.allProducts$),
        takeUntil(this.destroy$)
      )
      .subscribe((products: Product[]) => {
        this.products = products;
        this.loading = false;
      });
  }

  writeValue(value: any): void {
    this.formControlDirective.valueAccessor!.writeValue(value);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnTouched(fn);
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor!.registerOnChange(fn);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective.valueAccessor!.setDisabledState!(isDisabled);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
