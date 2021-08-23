import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlyoutComponent } from './flyout.component';
import { FlyoutTriggerSetterDirective } from './flyout-trigger-class-setter.directive';

const COMPONENTS = [FlyoutComponent];

const DIRECTIVES = [FlyoutTriggerSetterDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [CommonModule],
  exports: [...COMPONENTS, ...DIRECTIVES],
})
export class FlyoutModule {}
