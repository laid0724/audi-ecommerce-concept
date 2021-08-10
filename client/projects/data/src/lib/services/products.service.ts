import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductCategory } from '../models/product-category';
import { Product } from '../models/product';
import { Observable, throwError } from 'rxjs';
import { ProductCategoryParams } from '../models/product-category-params';
import { ProductParams } from '../models/product-params';
import { PaginatedResult } from '../models/pagination';
import { ProductVariant } from '../models/product-variant';
import { ProductVariantValue } from '../models/product-variant-value';
import {
  getPaginatedResult,
  getPaginationHeaders,
  isNullOrEmptyString,
} from '../helpers';
import { WysiwygGrid } from '../models/wysiwyg';
import { ReplaySubject } from 'rxjs';
import {
  concatMap,
  expand,
  reduce,
  startWith,
  switchMap,
  takeWhile,
} from 'rxjs/operators';

export interface ProductCategoryUpsertRequest {
  id?: number;
  name: string;
  description: string;
  parentId?: number;
}

export interface ProductUpsertRequest {
  id?: number;
  productCategoryId: number;
  name: string;
  wysiwyg: WysiwygGrid;
  isVisible: boolean;
  isDiscounted: boolean;
  discountAmount: number;
  discountDeadline: Date;
  price: number;
  stock: number;
}

export interface ProductVariantUpsertRequest {
  id?: number;
  name: string;
  productId: number;
  variantValueLabel: string;
}
export interface ProductVariantValueUpsertRequest {
  id?: number;
  name: string;
  variantId: number;
  productId: number;
  stock?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private endpoint = '/api/products';

  // TODO: implement caching with map

  // recursively accumulate paged results from paged APIs, bound to a refresher to refetch everything
  // see: https://stackoverflow.com/questions/56786261/recursively-combining-http-results-based-on-response
  allParentCategoriesRefresher$ = new ReplaySubject(1);
  allParentCategories$ = this.allParentCategoriesRefresher$.asObservable().pipe(
    startWith(null),
    switchMap(() =>
      this.getParentProductCategories({
        pageNumber: 1,
        pageSize: 100,
      }).pipe(
        expand((pagedProductCategories: PaginatedResult<ProductCategory[]>) =>
          this.getParentProductCategories({
            pageNumber: pagedProductCategories.pagination.currentPage + 1,
            pageSize: 100,
          })
        ),
        takeWhile(
          (pagedProductCategories: PaginatedResult<ProductCategory[]>) =>
            pagedProductCategories.pagination.currentPage <
            pagedProductCategories.pagination.totalPages,
          true
        ),
        concatMap(
          (pagedProductCategories: PaginatedResult<ProductCategory[]>) =>
            pagedProductCategories.result
        ),
        reduce(
          (
            accumulator: ProductCategory[],
            productCategory: ProductCategory
          ) => {
            accumulator.push(productCategory);
            return accumulator;
          },
          []
        )
      )
    )
  );

  allProductsRefresher$ = new ReplaySubject(1);
  allProducts$ = this.allProductsRefresher$.asObservable().pipe(
    startWith(null),
    switchMap(() =>
      this.getProducts({
        pageNumber: 1,
        pageSize: 100,
      }).pipe(
        expand((pagedProducts: PaginatedResult<Product[]>) =>
          this.getProducts({
            pageNumber: pagedProducts.pagination.currentPage + 1,
            pageSize: 100,
          })
        ),
        takeWhile(
          (pagedProducts: PaginatedResult<Product[]>) =>
            pagedProducts.pagination.currentPage <
            pagedProducts.pagination.totalPages,
          true
        ),
        concatMap(
          (pagedProducts: PaginatedResult<Product[]>) => pagedProducts.result
        ),
        reduce((accumulator: Product[], product: Product) => {
          accumulator.push(product);
          return accumulator;
        }, [])
      )
    )
  );

  constructor(private http: HttpClient) {}

  addProductCategory(
    request: ProductCategoryUpsertRequest
  ): Observable<ProductCategory> {
    return this.http.post<ProductCategory>(
      `${this.endpoint}/categories`,
      request
    );
  }

  updateProductCategory(
    request: ProductCategoryUpsertRequest
  ): Observable<ProductCategory> {
    if (request.id == null) {
      return throwError('No product category id provided');
    }
    return this.http.put<ProductCategory>(
      `${this.endpoint}/categories`,
      request
    );
  }

  getProductCategory(categoryId: number): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(
      `${this.endpoint}/categories/${categoryId}`
    );
  }

  deleteProductCategory(categoryId: number): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/categories/${categoryId}`);
  }

  getParentProductCategories(
    productCategoryParams: ProductCategoryParams
  ): Observable<PaginatedResult<ProductCategory[]>> {
    const { pageNumber, pageSize, parentId, name, description } =
      productCategoryParams;

    let params = getPaginationHeaders(pageNumber, pageSize);

    if (parentId != null) {
      params = params.append('parentId', parentId.toString());
    }

    !isNullOrEmptyString(name)
      ? (params = params.append('name', name as string))
      : params.delete('name');

    !isNullOrEmptyString(description)
      ? (params = params.append('description', description as string))
      : params.delete('description');

    return getPaginatedResult<ProductCategory[]>(
      this.http,
      `${this.endpoint}/categories/parents`,
      params
    );
  }

  getChildrenProductCategories(
    productCategoryParams: ProductCategoryParams
  ): Observable<PaginatedResult<ProductCategory[]>> {
    const { pageNumber, pageSize, parentId, name, description } =
      productCategoryParams;

    if (parentId == null) {
      return throwError('No parentId provided');
    }

    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('parentId', parentId.toString());

    !isNullOrEmptyString(name)
      ? (params = params.append('name', name as string))
      : params.delete('name');

    !isNullOrEmptyString(description)
      ? (params = params.append('description', description as string))
      : params.delete('description');

    return getPaginatedResult<ProductCategory[]>(
      this.http,
      `${this.endpoint}/categories/children`,
      params
    );
  }

  getProducts(
    productParams: ProductParams
  ): Observable<PaginatedResult<Product[]>> {
    const { pageNumber, pageSize, ...restOfProductParams } = productParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    Object.keys(restOfProductParams).forEach((key) => {
      const property = (restOfProductParams as unknown as any)[key];
      if (property != null) {
        params = params.append(key, property.toString());
      }
    });

    return getPaginatedResult<Product[]>(this.http, this.endpoint, params);
  }

  getProduct(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.endpoint}/${productId}`);
  }

  addProduct(request: ProductUpsertRequest): Observable<Product> {
    return this.http.post<Product>(this.endpoint, request);
  }

  updateProduct(request: ProductUpsertRequest): Observable<Product> {
    if (request.id == null) {
      return throwError('Missing product id');
    }
    return this.http.put<Product>(this.endpoint, request);
  }

  deleteProduct(productId: number): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/${productId}`);
  }

  getProductVariant(variantId: number): Observable<ProductVariant> {
    return this.http.get<ProductVariant>(
      `${this.endpoint}/variants/${variantId}`
    );
  }

  getProductVariants(productId: number): Observable<ProductVariant[]> {
    return this.http.get<ProductVariant[]>(
      `${this.endpoint}/variants/all/${productId}`
    );
  }

  addProductVariant(
    request: ProductVariantUpsertRequest
  ): Observable<ProductVariant> {
    return this.http.post<ProductVariant>(`${this.endpoint}/variants`, request);
  }

  updateProductVariant(
    request: ProductVariantUpsertRequest
  ): Observable<ProductVariant> {
    return this.http.put<ProductVariant>(`${this.endpoint}/variants`, request);
  }

  deleteProductVariant(variantId: number): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/variants/${variantId}`);
  }

  getProductVariantValue(
    variantValueId: number
  ): Observable<ProductVariantValue> {
    return this.http.get<ProductVariantValue>(
      `${this.endpoint}/variants/values/${variantValueId}`
    );
  }

  getProductVariantValues(
    variantId: number
  ): Observable<ProductVariantValue[]> {
    return this.http.get<ProductVariantValue[]>(
      `${this.endpoint}/variants/values/all/${variantId}`
    );
  }

  addProductVariantValue(
    request: ProductVariantValueUpsertRequest
  ): Observable<ProductVariantValue> {
    return this.http.post<ProductVariantValue>(
      `${this.endpoint}/variants/values`,
      request
    );
  }

  updateProductVariantValue(
    request: ProductVariantValueUpsertRequest
  ): Observable<ProductVariantValue> {
    return this.http.put<ProductVariantValue>(
      `${this.endpoint}/variants/values`,
      request
    );
  }

  deleteProductVariantValue(variantValueId: number): Observable<null> {
    return this.http.delete<null>(
      `${this.endpoint}/variants/values/${variantValueId}`
    );
  }

  setMainProductPhoto(photoId: number): Observable<null> {
    return this.http.put<null>(
      `${this.endpoint}/photos/${photoId}/set-main-photo`,
      {}
    );
  }

  deleteProductPhoto(photoId: number): Observable<null> {
    return this.http.delete<null>(`${this.endpoint}/photos/${photoId}`);
  }
}
