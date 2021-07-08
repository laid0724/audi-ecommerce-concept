import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductVariantEditorComponent } from './product-variant-editor.component';

describe('ProductVariantEditorComponent', () => {
  let component: ProductVariantEditorComponent;
  let fixture: ComponentFixture<ProductVariantEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductVariantEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductVariantEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
