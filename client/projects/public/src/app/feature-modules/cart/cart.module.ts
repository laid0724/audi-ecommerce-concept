import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { TranslocoModule } from '@ngneat/transloco';

import { CartRoutingModule } from './cart-routing.module';
import { CartPageComponent } from './cart-page/cart-page.component';
import { CartNavComponent } from './cart-nav/cart-nav.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { CartItemQuantitySelectorComponent } from './cart-item-quantity-selector/cart-item-quantity-selector.component';

const COMPONENTS = [
  CartPageComponent,
  CartNavComponent,
  CartItemComponent,
  CartItemQuantitySelectorComponent,
];

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
