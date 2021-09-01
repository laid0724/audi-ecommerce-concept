import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutComponent } from './flyout.component';
import { FlyoutTriggerSetterDirective } from './flyout-trigger-class-setter.directive';
import { FlyoutServiceModule } from '../services/flyout-service/flyout-service.module';

const COMPONENTS = [FlyoutComponent];

const DIRECTIVES = [FlyoutTriggerSetterDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule, FlyoutServiceModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class FlyoutModule {}
