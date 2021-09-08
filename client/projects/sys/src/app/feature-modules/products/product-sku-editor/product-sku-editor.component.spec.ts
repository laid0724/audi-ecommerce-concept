import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductSkuEditorComponent } from './product-sku-editor.component';

describe('ProductSkuEditorComponent', () => {
  let component: ProductSkuEditorComponent;
  let fixture: ComponentFixture<ProductSkuEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductSkuEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductSkuEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
