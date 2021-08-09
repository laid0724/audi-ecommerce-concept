import { OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  BusyService,
  duplicateValuesValidator,
  Homepage,
  HomepageCarouselItem,
  HomepageService,
  LanguageCode,
  LanguageStateService,
  Product,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-homepage-management',
  templateUrl: './homepage-management.component.html',
  styleUrls: ['./homepage-management.component.scss'],
})
export class HomepageManagementComponent implements OnInit, OnDestroy {
  @ViewChild('carouselFormRef', { read: ClrForm }) carouselClrForm: ClrForm;
  @ViewChild('featuredProductFormRef', { read: ClrForm })
  featuredProductClrForm: ClrForm;

  carouselForm: FormGroup;
  featuredProductForm: FormGroup;

  get carouselItemsFA(): FormArray {
    return this.carouselForm.get('carouselItems') as FormArray;
  }

  get featuredProductIdsFA(): FormArray {
    return this.featuredProductForm.get('featuredProductIds') as FormArray;
  }

  destroy$ = new Subject<boolean>();

  constructor(
    private languageService: LanguageStateService,
    private homepageService: HomepageService,
    private busyService: BusyService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initCarouselForm();
    this.initFeaturedProductForm();

    this.languageService.language$
      .pipe(
        switchMap((language: LanguageCode) =>
          this.homepageService.getHomepage()
        ),
        tap((homepage: Homepage) => {
          const { carouselItems, featuredProducts } = homepage;

          this.carouselItemsFA.clear();
          this.featuredProductIdsFA.clear();

          carouselItems.forEach(
            (homepageCarouselItem: HomepageCarouselItem) => {
              this.addCarouselItem();
            }
          );

          featuredProducts.forEach((product: Product) => {
            this.addFeaturedProduct();
          });

          this.carouselItemsFA.patchValue(carouselItems);

          this.featuredProductIdsFA.patchValue(
            featuredProducts.map((fp) => fp.id)
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((_) => this.busyService.idle());
  }

  initCarouselForm(): void {
    this.carouselForm = this.fb.group({
      carouselItems: this.fb.array([]),
    });
  }

  initFeaturedProductForm(): void {
    this.featuredProductForm = this.fb.group({
      featuredProductIds: this.fb.array([], duplicateValuesValidator()),
    });
  }

  addCarouselItem(): void {
    // TODO

    this.carouselItemsFA.push(this.fb.group({}));
  }

  removeCarouselItem(i: number): void {
    // TODO

    this.carouselItemsFA.removeAt(i);
  }

  onSubmitCarouselItems(): void {
    if (this.carouselForm.invalid) {
      this.carouselClrForm.markAsTouched();
      this.carouselForm.markAllAsTouched();
      this.toastr.error('Failed to save', '儲存失敗');
      return;
    }

    // todo
  }

  // this should be of type CdkDragDrop<any[]> but angular compiler
  // insists that the event being passed in from the template and throws error
  onDropCarouselItem(dropEvent: any) {
    if (dropEvent.previousIndex === dropEvent.currentIndex) {
      return;
    }

    // TODO: call api each time

    // const draggedRow = this.featuredProductIdsFA.at(dropEvent.previousIndex);
    // this.featuredProductIdsFA.removeAt(dropEvent.previousIndex);
    // this.featuredProductIdsFA.insert(dropEvent.currentIndex, draggedRow);
    // this.featuredProductIdsFA.updateValueAndValidity();
  }

  addFeaturedProduct(): void {
    this.featuredProductIdsFA.push(
      this.fb.control(null, [Validators.required])
    );
  }

  removeFeaturedProduct(i: number): void {
    this.featuredProductIdsFA.removeAt(i);
  }

  onSubmitFeaturedProduct(): void {
    if (this.featuredProductForm.invalid) {
      this.featuredProductClrForm.markAsTouched();
      this.featuredProductForm.markAllAsTouched();
      this.toastr.error('Failed to save', '儲存失敗');
      return;
    }

    this.homepageService
      .updateHomepageFeaturedProducts({
        featuredProductIds: this.featuredProductForm.value.featuredProductIds,
      })
      .pipe(take(1))
      .subscribe(() => {
        this.toastr.success(
          'Featured products updated successfully',
          '精選商品儲存成功'
        );
      });
  }

  onDropFeaturedProduct(dropEvent: any) {
    if (dropEvent.previousIndex === dropEvent.currentIndex) {
      return;
    }

    const draggedRow = this.featuredProductIdsFA.at(dropEvent.previousIndex);
    this.featuredProductIdsFA.removeAt(dropEvent.previousIndex);
    this.featuredProductIdsFA.insert(dropEvent.currentIndex, draggedRow);
    this.featuredProductIdsFA.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
