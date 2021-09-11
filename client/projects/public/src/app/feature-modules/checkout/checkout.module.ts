import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPageComponent } from './checkout-page/checkout-page.component';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { IconWithBadgeModule } from '../../component-modules/audi-ui/icon-with-badge/icon-with-badge.module';
import { BreadcrumbModule } from '../../component-modules/audi-ui/breadcrumb/breadcrumb.module';

const COMPONENTS = [CheckoutPageComponent];

const IMPORT_MODULES = [
  CommonModule,
  CheckoutRoutingModule,
  FormComponentsModule,
  ButtonModule,
  IconModule,
  IconWithBadgeModule,
  BreadcrumbModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
})
export class CheckoutModule {}
