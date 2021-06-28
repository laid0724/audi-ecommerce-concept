import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProductCategory } from '../models/product-category';
import { Product } from '../models/product';
import { ProductPhoto } from '../models/product-photo';
import { Observable, throwError } from 'rxjs';
import { ProductCategoryParams } from '../models/product-category-params';
import { ProductParams } from '../models/product-params';
import { PaginatedResult } from '../models/pagination';
import { getPaginatedResult, getPaginationHeaders } from '../helpers';
import { WysiwygGrid } from '../models/wysiwyg';

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

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private endpoint = '/api/products';

  // TODO: implement caching with map

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
    const { pageNumber, pageSize, parentId } = productCategoryParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    if (parentId != null) {
      params = params.append('parentId', parentId.toString());
    }

    return getPaginatedResult<ProductCategory[]>(
      this.http,
      `${this.endpoint}/categories/parents`,
      params
    );
  }

  getChildrenProductCategories(
    productCategoryParams: ProductCategoryParams
  ): Observable<PaginatedResult<ProductCategory[]>> {
    const { pageNumber, pageSize, parentId } = productCategoryParams;

    if (parentId == null) {
      return throwError('No parentId provided');
    }

    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('parentId', parentId.toString());

    return getPaginatedResult<ProductCategory[]>(
      this.http,
      `${this.endpoint}/categories/children`,
      params
    );
  }

  getProducts(
    productParams: ProductParams
  ): Observable<PaginatedResult<Product[]>> {
    const { pageNumber, pageSize, productCategoryId } = productParams;
    let params = getPaginationHeaders(pageNumber, pageSize);

    if (productCategoryId != null) {
      params = params.append('productCategoryId', productCategoryId.toString());
    }

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
