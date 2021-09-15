import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavModule } from '../../component-modules/audi-ui/nav/nav.module';
import { TranslocoModule } from '@ngneat/transloco';
import { FormComponentsModule } from '../../component-modules/form-components/form-components.module';
import { MembersAreaRoutingModule } from './members-area-routing.module';

import { MembersAreaContainerComponent } from './members-area-container/members-area-container.component';
import { MembersPersonalInfoComponent } from './members-personal-info/members-personal-info.component';
import { MembersLikedProductComponent } from './members-liked-product/members-liked-product.component';
import { MembersOrderListComponent } from './members-order-list/members-order-list.component';
import { MembersOrderSingleComponent } from './members-order-single/members-order-single.component';
import { ImgHeaderModule } from '../../component-modules/img-header/img-header.module';
import { RouterModule } from '@angular/router';

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
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [...IMPORT_MODULES],
})
export class MembersAreaModule {}
