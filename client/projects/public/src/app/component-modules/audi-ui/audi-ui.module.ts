import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormComponentsModule } from 'projects/sys/src/app/component-modules/form-components/form-components.module';
import { IconModule } from './icon/icon.module';
import { NotificationModule } from './notification/notification.module';
import { AlertModule } from './alert/alert.module';
import { NavModule } from './nav/nav.module';
import { ModalModule } from './modal/modal.module';
import { PopoverModule } from './popover/popover.module';
import { TooltipModule } from './tooltip/tooltip.module';
import { BreadcrumbModule } from './breadcrumb/breadcrumb.module';
import { FlyoutModule } from './flyout/flyout.module';

import { ButtonComponent } from './button/button.component';
import { ButtonGroupComponent } from './button-group/button-group.component';
import { CardComponent } from './card/card.component';
import { CardGridComponent } from './card-grid/card-grid.component';
import { CardGridItemComponent } from './card-grid-item/card-grid-item.component';
import { PaginationComponent } from './pagination/pagination.component';
import { BadgeComponent } from './badge/badge.component';
import { IconWithBadgeComponent } from './icon-with-badge/icon-with-badge.component';
import { IndicatorComponent } from './indicator/indicator.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ProgressBarComponent } from './progress-bar/progress-bar.component';
import { HeaderComponent } from './header/header.component';

const COMPONENTS = [
  ButtonComponent,
  ButtonGroupComponent,
  CardComponent,
  CardGridComponent,
  CardGridItemComponent,
  PaginationComponent,
  BadgeComponent,
  IconWithBadgeComponent,
  IndicatorComponent,
  SpinnerComponent,
  ProgressBarComponent,
  HeaderComponent,
];

const MODULES = [
  IconModule,
  NotificationModule,
  AlertModule,
  NavModule,
  BreadcrumbModule,
  ModalModule,
  PopoverModule,
  TooltipModule,
  FlyoutModule,
  FormComponentsModule
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ...MODULES],
  exports: [...COMPONENTS, ...MODULES],
})
export class AudiUiModule {}
