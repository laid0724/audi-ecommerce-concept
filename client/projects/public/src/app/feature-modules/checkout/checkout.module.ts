import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { TranslocoModule } from '@ngneat/transloco';
import { BadgeModule } from '../../component-modules/audi-ui/badge/badge.module';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { CardModule } from '../../component-modules/audi-ui/card/card.module';
import { AddressFgModule } from '../../component-modules/address-fg/address-fg.module';
import { CreditCardFgModule } from '../../component-modules/credit-card-fg/credit-card-fg.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { ModalModule } from '../../component-modules/audi-ui/modal/modal.module';
import { SpinnerModule } from '../../component-modules/audi-ui/spinner/spinner.module';
import { ImgHeaderModule } from '../../component-modules/img-header/img-header.module';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';

const COMPONENTS = [CheckoutPageComponent, CheckoutSuccessComponent];

const IMPORT_MODULES = [
  CommonModule,
  CheckoutRoutingModule,
  FormComponentsModule,
  ButtonModule,
  BadgeModule,
  CardModule,
  NavModule,
  TranslocoModule,
  AddressFgModule,
  CreditCardFgModule,
  IconModule,
  ModalModule,
  SpinnerModule,
  ImgHeaderModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
})
export class CheckoutModule {}
