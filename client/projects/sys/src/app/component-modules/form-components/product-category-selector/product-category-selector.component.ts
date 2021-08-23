import { forwardRef, Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import {
  LanguageStateService,
  ProductCategory,
  ProductsService,
} from '@audi/data';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

type CategoriesToShow = 'all' | 'parent' | 'children';

@Component({
  selector: 'audi-sys-product-category-selector',
  templateUrl: './product-category-selector.component.html',
  styleUrls: ['./product-category-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ProductCategorySelectorComponent),
      multi: true,
    },
  ],
})
export class ProductCategorySelectorComponent
  implements OnInit, ControlValueAccessor, OnDestroy
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective: FormControlDirective;

  @Input()
  label = '產品分類 Product Category';

  @Input()
  helperText = '';

  @Input()
  clrLayout: 'horizontal' | 'vertical' = 'horizontal';

  @Input()
  show: CategoriesToShow = 'all';

  @Input()
  excludedId: number;

  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;

  get control(): FormControl {
    return (this.formControl ||
      this.controlContainer.control?.get(this.formControlName)) as FormControl;
  }

  productCategories: ProductCategory[];

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
        switchMap((_) => this.productsService.allParentCategories$),
        takeUntil(this.destroy$)
      )
      .subscribe((parentCategories: ProductCategory[]) => {
        switch (this.show) {
          case 'parent':
            this.productCategories = parentCategories;
            break;
          case 'children':
            this.productCategories = parentCategories
              .flatMap((pc) => [pc, ...pc.children])
              .filter((pc) => !pc.isTopLevel);
            break;
          default:
            this.productCategories = parentCategories.flatMap((pc) => [
              pc,
              ...pc.children,
            ]);
            break;
        }

        if (this.excludedId != null) {
          this.productCategories = this.productCategories.filter(
            (pc) => pc.id !== this.excludedId
          );
        }

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
