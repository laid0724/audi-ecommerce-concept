import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { ProductCategory, ProductsService } from '@audi/data';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryResolver implements Resolve<ProductCategory[]> {
  constructor(private productsService: ProductsService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<ProductCategory[]> {
    return this.productsService.allParentCategories$.pipe(
      map((productCategories: ProductCategory[]) =>
        productCategories.flatMap((pc) => [pc, ...pc.children])
      ),
      take(1)
    );
  }
}
