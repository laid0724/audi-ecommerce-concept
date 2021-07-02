import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPhotoUploaderComponent } from './product-photo-uploader.component';

describe('ProductPhotoUploaderComponent', () => {
  let component: ProductPhotoUploaderComponent;
  let fixture: ComponentFixture<ProductPhotoUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductPhotoUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductPhotoUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
