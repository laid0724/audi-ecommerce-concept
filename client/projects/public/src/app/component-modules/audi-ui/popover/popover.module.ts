import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopoverComponent } from './popover.component';
import { PopoverServiceModule } from '../services/popover-service/popover-service.module';

const COMPONENTS = [PopoverComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, PopoverServiceModule],
  exports: [...COMPONENTS],
})
export class PopoverModule {}
