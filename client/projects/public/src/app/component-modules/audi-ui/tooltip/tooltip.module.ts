import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TooltipComponent } from './tooltip.component';
import { TooltipServiceModule } from '../services/tooltip-service/tooltip-service.module';

const COMPONENTS = [TooltipComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, TooltipServiceModule],
  exports: [...COMPONENTS],
})
export class TooltipModule {}
