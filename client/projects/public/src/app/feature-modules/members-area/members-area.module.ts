import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { TranslocoModule } from '@ngneat/transloco';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { MembersAreaRoutingModule } from './members-area-routing.module';
import { ImgHeaderModule } from '../../component-modules/img-header/img-header.module';
import { RouterModule } from '@angular/router';
import { AddressFgModule } from '../../component-modules/address-fg/address-fg.module';
import { ButtonModule } from '../../component-modules/audi-ui/button/button.module';
import { IconModule } from '../../component-modules/audi-ui/icon/icon.module';
import { ModalModule } from '../../component-modules/audi-ui/modal/modal.module';
import { SpinnerModule } from '../../component-modules/audi-ui/spinner/spinner.module';

import { MembersAreaContainerComponent } from './members-area-container/members-area-container.component';
import { MembersPersonalInfoComponent } from './members-personal-info/members-personal-info.component';
import { MembersLikedProductComponent } from './members-liked-product/members-liked-product.component';
import { MembersOrderListComponent } from './members-order-list/members-order-list.component';
import { MembersOrderSingleComponent } from './members-order-single/members-order-single.component';
import { ProductCardModule } from '../products/components/product-card/product-card.module';

const COMPONENTS = [
  MembersAreaContainerComponent,
  MembersPersonalInfoComponent,
  MembersLikedProductComponent,
  MembersOrderListComponent,
  MembersOrderSingleComponent,
];

const IMPORT_MODULES = [
  CommonModule,
  MembersAreaRoutingModule,
  NavModule,
  TranslocoModule,
  FormComponentsModule,
  ImgHeaderModule,
  RouterModule,
  AddressFgModule,
  ButtonModule,
  IconModule,
  ModalModule,
  SpinnerModule,
  ProductCardModule
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
})
export class MembersAreaModule {}
