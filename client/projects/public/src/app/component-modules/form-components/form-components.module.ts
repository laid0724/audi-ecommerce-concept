import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '../audi-ui/icon/icon.module';
import { TranslocoModule } from '@ngneat/transloco';
import { DpDatePickerModule } from 'ng2-date-picker';

import { ControlDescriptionComponent } from './control-description/control-description.component';
import { ControlValidComponent } from './control-valid/control-valid.component';
import { ControlErrorComponent } from './control-error/control-error.component';
import { InputContainerComponent } from './input-container/input-container.component';
import { TextareaContainerComponent } from './textarea-container/textarea-container.component';
import { SelectContainerComponent } from './select-container/select-container.component';
import { RadioContainerComponent } from './radio-container/radio-container.component';
import { ControlGridComponent } from './control-grid/control-grid.component';
import { ProjectAsFieldDirective } from './project-as-field.directive';
import { ProjectAsFieldsDirective } from './project-as-fields.directive';
import { CheckboxContainerComponent } from './checkbox-container/checkbox-container.component';
import { ToggleContainerComponent } from './toggle-container/toggle-container.component';
import { DatepickerContainerComponent } from './datepicker-container/datepicker-container.component';

const COMPONENTS = [
  ControlDescriptionComponent,
  ControlValidComponent,
  ControlErrorComponent,
  ControlGridComponent,
  InputContainerComponent,
  TextareaContainerComponent,
  SelectContainerComponent,
  RadioContainerComponent,
  CheckboxContainerComponent,
  ToggleContainerComponent,
  DatepickerContainerComponent,
];

const DIRECTIVES = [ProjectAsFieldDirective, ProjectAsFieldsDirective];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IconModule,
    TranslocoModule,
    DpDatePickerModule,
  ],
  exports: [...COMPONENTS, ...DIRECTIVES, FormsModule, ReactiveFormsModule],
})
export class FormComponentsModule {}
