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
import { ButtonModule } from './button/button.module';
import { CardModule } from './card/card.module';
import { PaginationModule } from './pagination/pagination.module';
import { BadgeModule } from './badge/badge.module';
import { IconWithBadgeModule } from './icon-with-badge/icon-with-badge.module';
import { IndicatorModule } from './indicator/indicator.module';
import { SpinnerModule } from './spinner/spinner.module';
import { ProgressBarModule } from './progress-bar/progress-bar.module';
import { HeaderModule } from './header/header.module';

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
  FormComponentsModule,
  ButtonModule,
  CardModule,
  PaginationModule,
  BadgeModule,
  IconWithBadgeModule,
  IndicatorModule,
  SpinnerModule,
  ProgressBarModule,
  HeaderModule,
];

@NgModule({
  imports: [CommonModule, ...MODULES],
  exports: [...MODULES],
})
export class AudiUiModule {}
