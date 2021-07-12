import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedImageUploaderComponent } from './featured-image-uploader.component';

describe('FeaturedImageUploaderComponent', () => {
  let component: FeaturedImageUploaderComponent;
  let fixture: ComponentFixture<FeaturedImageUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturedImageUploaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturedImageUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
