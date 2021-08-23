import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconWithBadgeComponent } from './icon-with-badge.component';
import { BadgeModule } from '../badge/badge.module';
import { IconModule } from '../icon/icon.module';

const COMPONENTS = [IconWithBadgeComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, BadgeModule, IconModule],
  exports: [...COMPONENTS],
})
export class IconWithBadgeModule {}
