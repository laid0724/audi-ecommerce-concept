import { HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ParamMap,
  QueryParamsHandling,
  Router,
} from '@angular/router';
import {
  BusyService,
  PaginatedResult,
  Pagination,
  ProductCategory,
  ProductCategoryParams,
  ProductsService,
  setQueryParams,
} from '@audi/data';
import { ClrDatagridStateInterface, ClrForm } from '@clr/angular';
import { Observable, of, Subject } from 'rxjs';
import { startWith, switchMap, take, takeUntil } from 'rxjs/operators';
import { ClrServerSideStringFilter } from '../../../component-modules/clr-datagrid-utilities/datagrid-filters';

@Component({
  selector: 'audi-sys-products-category-list',
  templateUrl: './products-category-list.component.html',
  styleUrls: ['./products-category-list.component.scss'],
})
export class ProductsCategoryListComponent implements OnInit, OnDestroy {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen) {
      this.cancelDelete();
    }
    if (this.editModalOpen) {
      this.cancelEdit();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.confirmDeleteModalOpen && this.productCategoryToDelete !== null) {
      this.onDelete(this.productCategoryToDelete.id);
    }
    if (this.editModalOpen) {
      this.onSubmit();
    }
  }

  @ViewChild(ClrForm, { static: false }) clrForm: ClrForm;

  productCategories: ProductCategory[];
  paging: Pagination;

  detailPaneState = null;
  editModalOpen = false;
  confirmDeleteModalOpen = false;

  productCategoryNameFilter: ClrServerSideStringFilter;
  productCategoryDescriptionFilter: ClrServerSideStringFilter;
  datagridLoading = true;

  parentCategory$: Observable<ProductCategory>;
  productCategoryToDelete: ProductCategory | null = null;

  productCategoryForm: FormGroup;

  initialQueryParams = {
    pageNumber: 1,
    pageSize: 10,
    name: undefined,
    description: undefined
  };

  productCategoryParams: ProductCategoryParams = this.initialQueryParams;

  refresher$ = new Subject<ProductCategoryParams>();
  destroy$ = new Subject<boolean>();

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router,
    private busyService: BusyService,
    private fb: FormBuilder
  ) {
    this.productCategoryNameFilter = new ClrServerSideStringFilter('name');
    this.productCategoryDescriptionFilter = new ClrServerSideStringFilter(
      'description'
    );
  }

  ngOnInit(): void {
    this.initProductCategoryForm();

    this.refresher$
      .pipe(
        startWith(this.productCategoryParams),
        switchMap((productCategoryParams: ProductCategoryParams) => {
          // HACK: move this assignment to the back of the call stack so ExpressionChangedAfterItHasBeenCheckedError wont be triggered
          setTimeout(() => {
            this.datagridLoading = true;
          }, 0);

          return this.route.queryParamMap.pipe(
            switchMap((params: ParamMap) => {
              if (params.has('parentId') && params.get('parentId') !== null) {
                const parentId = parseInt(params.get('parentId') as string);

                this.parentCategory$ = this.productsService
                  .getProductCategory(parentId)
                  .pipe(take(1));

                return this.productsService.getChildrenProductCategories({
                  ...productCategoryParams,
                  parentId,
                });
              }

              this.parentCategory$ = of();
              return this.productsService.getParentProductCategories(
                productCategoryParams
              );
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((res: PaginatedResult<ProductCategory[]>) => {
        this.productCategories = res.result;
        this.paging = res.pagination;
        setTimeout(() => {
          this.datagridLoading = false;
        }, 0);
        this.busyService.idle();
      });
  }

  initProductCategoryForm(): void {
    this.productCategoryForm = this.fb.group({
      id: [null],
      name: [null, Validators.required],
      description: [null, Validators.required],
      parentId: [null],
    });
  }

  refreshDatagrid(state: ClrDatagridStateInterface): void {
    if (
      this.datagridLoading ||
      state == null ||
      Object.keys(state).length === 0
    ) {
      return;
    }

    this.productCategoryParams = {
      ...this.productCategoryParams,
      pageNumber: state.page?.current as number,
      pageSize: state.page?.size as number,
      name: undefined,
      description: undefined,
    };

    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = <{ property: string; value: string }>filter;
        if (['name', 'description'].includes(property)) {
          this.productCategoryParams = {
            ...this.productCategoryParams,
            [property]: value,
          };
        }
      }
    }

    this.refresher$.next(this.productCategoryParams);
  }

  promptAddSubcategory(parentCategoryId: number): void {
    this.promptEdit();
    this.productCategoryForm.get('parentId')?.patchValue(parentCategoryId);
  }

  promptEdit(categoryId?: number): void {
    this.editModalOpen = true;

    if (categoryId) {
      const category = this.productCategories.find(
        ({ id }) => id === categoryId
      );
      if (category !== undefined) {
        this.productCategoryForm.patchValue(category);
      }
    } else {
      this.productCategoryForm.reset();
    }
  }

  cancelEdit(): void {
    this.editModalOpen = false;
    this.productCategoryForm.reset();
  }

  onSubmit(): void {
    if (this.productCategoryForm.invalid) {
      this.clrForm.markAsTouched();
      this.productCategoryForm.markAllAsTouched();
      return;
    }

    const formValue = this.productCategoryForm.value;
    const { id } = formValue;

    let apiToHit;

    if (id) {
      apiToHit = this.productsService.updateProductCategory(formValue);
    } else {
      apiToHit = this.productsService.addProductCategory(formValue);
    }

    apiToHit.subscribe((productCategory: ProductCategory) => {
      this.refresher$.next(this.productCategoryParams);
      this.productsService.allParentCategoriesRefresher$.next();
      this.editModalOpen = false;
    });
  }

  promptDelete(productCategory: ProductCategory): void {
    this.productCategoryToDelete = productCategory;
    this.confirmDeleteModalOpen = true;
  }

  cancelDelete(): void {
    this.productCategoryToDelete = null;
    this.confirmDeleteModalOpen = false;
  }

  onDelete(categoryId: number): void {
    this.productsService.deleteProductCategory(categoryId).subscribe(() => {
      this.productCategoryToDelete = null;
      this.confirmDeleteModalOpen = false;
      this.refresher$.next(this.productCategoryParams);
    });
  }

  resetQueryParams(queryParams = {}, queryParamsHandling = ''): void {
    this.paging.currentPage = 1;
    setQueryParams(
      this.router,
      this.route,
      queryParams,
      queryParamsHandling as QueryParamsHandling
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
