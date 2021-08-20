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
import { ModalService } from './services/modal.service';
import { PopoverComponent } from './popover/popover.component';
import { PopoverService } from './services/popover.service';
import { TooltipComponent } from './tooltip/tooltip.component';
import { TooltipService } from './services/tooltip.service';
import { PaginationComponent } from './pagination/pagination.component';
import { NotificationModule } from './notification/notification.module';

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
];

const PROVIDERS = [ModalService, PopoverService, TooltipService];

@NgModule({
  declarations: [...COMPONENTS],
  providers: [...PROVIDERS],
  imports: [CommonModule, IconModule, FormComponentsModule, NotificationModule],
  exports: [...COMPONENTS],
})
export class AudiUiModule {}
