import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '../audi-ui/icon/icon.module';
import { ControlDescriptionComponent } from './control-description/control-description.component';
import { ControlValidComponent } from './control-valid/control-valid.component';
import { ControlErrorComponent } from './control-error/control-error.component';
import { InputContainerComponent } from './input-container/input-container.component';

const COMPONENTS = [
  ControlDescriptionComponent,
  ControlValidComponent,
  ControlErrorComponent,
  InputContainerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconModule],
  exports: [...COMPONENTS],
})
export class FormComponentsModule {}
