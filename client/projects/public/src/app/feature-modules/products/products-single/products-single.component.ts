import { HttpErrorResponse } from '@angular/common/http';
import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { LanguageStateService, Product, ProductsService } from '@audi/data';
import { TranslocoService } from '@ngneat/transloco';
import { filter, switchMap, take } from 'rxjs/operators';
import { NotificationService } from '../../../component-modules/audi-ui/services/notification-service/notification.service';

// TODO: transloco
// TODO: RWD
// TODO: implement product carousel
// TODO: implement product info panel
// TODO: variant selector
// TODO: product out of stock
// TODO: product like/unlike
// TODO: product add to cart
// TODO: product checkout btn
// TODO: similar products carousel

@Component({
  selector: 'audi-products-single',
  templateUrl: './products-single.component.html',
  styleUrls: ['./products-single.component.scss'],
})
export class ProductsSingleComponent implements OnInit, OnDestroy {
  product: Product;

  language = this.languageService.getCurrentLanguage();

  fullpageConfig: any;
  fullpageRef: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private notificationService: NotificationService,
    private languageService: LanguageStateService,
    private transloco: TranslocoService
  ) {
    // for more details on config options please visit fullPage.js docs
    // see: https://github.com/alvarotrigo/fullPage.js
    this.fullpageConfig = {
      // fullpage options
      licenseKey: 'YOUR_KEY_HERE',
      verticalCentered: false,
      fitToSection: true,
      scrollOverflow: true,
      resetSlider: true,
      paddingTop: '56px', // fixed header height
    };
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        filter((params: ParamMap) => params.has('productId')),
        switchMap((params: ParamMap) =>
          this.productService.getProduct(+params.get('productId')!)
        ),
        take(1)
      )
      .subscribe(
        (product: Product) => {
          this.product = product;
        },
        (error: HttpErrorResponse) => {
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        }
      );
  }

  getFullpageRef(fullpageRef: any) {
    this.fullpageRef = fullpageRef;
  }

  ngOnDestroy(): void {
    if (this.fullpageRef) {
      this.fullpageRef.destroy('all');
    }
  }
}
