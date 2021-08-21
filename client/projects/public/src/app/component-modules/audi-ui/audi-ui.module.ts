import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconModule } from './icon/icon.module';
import { FormComponentsModule } from 'projects/sys/src/app/component-modules/form-components/form-components.module';
import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { CardComponent } from './card/card.component';
import { ModalComponent } from './modal/modal.component';
import { CardGridComponent } from './card-grid/card-grid.component';
import { CardGridItemComponent } from './card-grid-item/card-grid-item.component';
import { PopoverComponent } from './popover/popover.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { PaginationComponent } from './pagination/pagination.component';
import { NotificationModule } from './notification/notification.module';
import { AlertModule } from './alert/alert.module';
import { ModalServiceModule } from './services/modal-service/modal-service.module';
import { PopoverServiceModule } from './services/popover-service/popover-service.module';
import { TooltipServiceModule } from './services/tooltip-service/tooltip-service.module';
import { BadgeComponent } from './badge/badge.component';
import { IconWithBadgeComponent } from './icon-with-badge/icon-with-badge.component';

const COMPONENTS = [
  ButtonComponent,
  ButtonGroupComponent,
  CardComponent,
  CardGridComponent,
  CardGridItemComponent,
  ModalComponent,
  PopoverComponent,
  TooltipComponent,
  PaginationComponent,
  BadgeComponent,
  IconWithBadgeComponent
];

const SERVICE_MODULES = [
  ModalServiceModule,
  PopoverServiceModule,
  TooltipServiceModule,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    IconModule,
    FormComponentsModule,
    NotificationModule,
    AlertModule,
    ...SERVICE_MODULES,
  ],
  exports: [
    ...COMPONENTS,
    ...SERVICE_MODULES,
    IconModule,
    NotificationModule,
    AlertModule,
  ],
})
export class AudiUiModule {}
