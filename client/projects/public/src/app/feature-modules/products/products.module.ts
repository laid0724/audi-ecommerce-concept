import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsRoutingModule } from './products-routing.module';
import { TranslocoModule } from '@ngneat/transloco';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';
import { PaginationModule } from '../../component-modules/audi-ui/pagination/pagination.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { SliderModule } from '../../component-modules/slider/slider.module';
import { FooterModule } from '../../core/footer/footer.module';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { FlyoutModule } from '../../component-modules/audi-ui/flyout/flyout.module';
import { ModalModule } from '../../component-modules/audi-ui/modal/modal.module';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { CardModule } from '../../component-modules/audi-ui/card/card.module';
import { WysiwygGridDisplayModule } from '../../component-modules/wysiwyg-grid-display/wysiwyg-grid-display.module';
import { SpinnerModule } from '../../component-modules/audi-ui/spinner/spinner.module';
import { ImgHeaderModule } from '../../component-modules/img-header/img-header.module';

import { ProductCardModule } from './components/product-card/product-card.module';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsSingleComponent } from './products-single/products-single.component';

const AUDI_MODULES = [
  SliderModule,
  IconModule,
  ButtonModule,
  PaginationModule,
  NavModule,
  FlyoutModule,
  ModalModule,
  FormComponentsModule,
  CardModule,
  SpinnerModule
];

const COMPONENTS = [ProductsListComponent, ProductsSingleComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    FooterModule,
    TranslocoModule,
    AngularFullpageModule,
    WysiwygGridDisplayModule,
    ImgHeaderModule,
    ProductCardModule,
    ...AUDI_MODULES,
  ],
})
export class ProductsModule {}
