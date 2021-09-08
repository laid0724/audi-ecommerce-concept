import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';

import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CartNavComponent } from './cart-nav/cart-nav.component';
import { TranslocoModule } from '@ngneat/transloco';

const COMPONENTS = [CartPageComponent, CartNavComponent];

const IMPORT_MODULES = [
  CommonModule,
  CartRoutingModule,
  ButtonModule,
  IconModule,
  TranslocoModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
  exports: [...COMPONENTS],
})
export class CartModule {}
