import { HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BusyService,
  CarouselColor,
  CarouselType,
  duplicateValuesValidator,
  Homepage,
  HomepageCarouselItem,
  HomepageService,
  isNullOrEmptyString,
  LanguageCode,
  LanguageStateService,
  Product,
  swapArrayElement,
  URL_REGEX,
} from '@audi/data';
import { ClrForm } from '@clr/angular';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { switchMap, take, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'audi-sys-homepage-management',
  templateUrl: './homepage-management.component.html',
  styleUrls: ['./homepage-management.component.scss'],
})
export class HomepageManagementComponent implements OnInit, OnDestroy {
  @HostListener('document:keydown.escape', ['$event']) onEscapeHandler(
    event: KeyboardEvent
  ) {
    if (this.carouselItemModalOpen) {
      this.closeCarouselItemModal();
    }
  }

  @HostListener('document:keydown.enter', ['$event']) onEnterHandler(
    event: KeyboardEvent
  ) {
    if (this.carouselItemModalOpen) {
      this.onSubmitCarouselItem(this.carouselForm.get('id')?.value);
    }
  }

  @ViewChild('carouselClrForm', { read: ClrForm }) carouselClrForm: ClrForm;
  @ViewChild('featuredProductClrForm', { read: ClrForm })
  featuredProductClrForm: ClrForm;

  carouselForm: FormGroup;
  featuredProductForm: FormGroup;

  carouselItems: HomepageCarouselItem[] = [];
  carouselItemModalOpen: boolean = false;
  carouselItemColorOptions: CarouselColor[] = [
    null,
    ...Object.keys(CarouselColor).map(
      (key) => (CarouselColor as unknown as any)[key]
    ),
  ];
  carouselItemColors = CarouselColor;

  destroy$ = new Subject<boolean>();

  get featuredProductIdsFA(): FormArray {
    return this.featuredProductForm.get('featuredProductIds') as FormArray;
  }

  public getCarouselItem(
    carouselItemId: number
  ): HomepageCarouselItem | undefined {
    return this.carouselItems.find(({ id }) => id === carouselItemId);
  }

  public isNullOrEmptyString: (value: any) => boolean = isNullOrEmptyString;

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

          this.carouselItems = carouselItems;

          this.featuredProductIdsFA.clear();

          featuredProducts.forEach((product: Product) => {
            this.addFeaturedProduct();
          });

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
      id: [null],
      type: [CarouselType.Homepage, [Validators.required]],
      sort: [0, [Validators.required]],
      title: [null],
      subTitle: [null],
      body: [null],
      isVisible: [false, [Validators.required]],
      primaryButtonLabel: [null],
      primaryButtonUrl: [null, [Validators.pattern(URL_REGEX)]],
      secondaryButtonLabel: [null],
      secondaryButtonUrl: [null, [Validators.pattern(URL_REGEX)]],
      color: [CarouselColor.Black, [Validators.required]],
    });
  }

  initFeaturedProductForm(): void {
    this.featuredProductForm = this.fb.group({
      featuredProductIds: this.fb.array([], duplicateValuesValidator()),
    });
  }

  openCarouselItemModal(carouselItem?: HomepageCarouselItem): void {
    if (carouselItem) {
      this.carouselForm.patchValue(carouselItem);
    }

    this.carouselItemModalOpen = true;
  }

  closeCarouselItemModal(): void {
    this.carouselForm.reset({
      type: CarouselType.Homepage,
      isVisible: false,
      sort: 0,
    });
    this.carouselItemModalOpen = false;
  }

  deleteCarouselItemPhotoFn(
    carouselItemId: number
  ): () => Observable<HomepageCarouselItem> {
    const fn = () =>
      this.homepageService.removePhotoFromHomepageCarouselItem(carouselItemId);
    return fn;
  }

  onCarouselItemPhotoChange(changedCarouselItem: HomepageCarouselItem): void {
    const previousCarouselItem = this.carouselItems.find(
      ({ id }) => id === changedCarouselItem.id
    );

    if (previousCarouselItem != undefined) {
      this.carouselItems[this.carouselItems.indexOf(previousCarouselItem)] =
        changedCarouselItem;
    }
  }

  onSortCarouselItem(previousIndex: number, newIndex: number) {
    if (newIndex === -1) {
      return;
    }
    if (newIndex >= this.carouselItems.length) {
      return;
    }
    if (previousIndex === newIndex) {
      return;
    }

    swapArrayElement(this.carouselItems, previousIndex, newIndex);
  }

  onSaveCarouselItemSortingOrder() {
    const newCarouselItemsSortOrder = this.carouselItems.map(({ id }) => id);

    this.homepageService
      .sortHomepageCarouselItems({
        carouselItemIds: newCarouselItemsSortOrder,
      })
      .pipe(take(1))
      .subscribe((carouselItems: HomepageCarouselItem[]) => {
        this.carouselItems = carouselItems;
      });
  }

  removeCarouselItem(carouselItemId: number): void {
    this.homepageService
      .deleteHomepageCarouselItem(carouselItemId)
      .pipe(take(1))
      .subscribe((_) => {
        this.carouselItems = this.carouselItems.filter(
          (c) => c.id !== carouselItemId
        );
      });
  }

  onSubmitCarouselItem(carouselItemId: number | null): void {
    if (this.carouselForm.invalid) {
      this.carouselClrForm.markAsTouched();
      this.carouselForm.markAllAsTouched();
      this.toastr.error('Failed to save', '儲存失敗');
      return;
    }

    const obs$ =
      carouselItemId != null
        ? this.homepageService.updateHomepageCarouselItem(
            this.carouselForm.value
          )
        : this.homepageService.addHomepageCarouselItem(this.carouselForm.value);

    obs$.pipe(take(1)).subscribe((carouselItem: HomepageCarouselItem) => {
      if (!this.carouselItems.map(({ id }) => id).includes(carouselItem.id)) {
        this.carouselItems = [carouselItem, ...this.carouselItems];
      } else {
        const editedItem = this.carouselItems.find(
          ({ id }) => id === carouselItem.id
        );

        if (editedItem !== undefined) {
          this.carouselItems[this.carouselItems.indexOf(editedItem)] =
            carouselItem;
        }
      }
      this.closeCarouselItemModal();
      this.toastr.success('Saved successfully', '儲存成功');
    });
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
