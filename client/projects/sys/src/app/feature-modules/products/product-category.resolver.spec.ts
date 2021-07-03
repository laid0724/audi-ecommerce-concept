import { TestBed } from '@angular/core/testing';

import { ProductCategoryResolver } from './product-category.resolver';

describe('ProductCategoryResolver', () => {
  let resolver: ProductCategoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProductCategoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
