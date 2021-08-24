import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAsTemplateDirective } from './project-as-template.directive';
import { AttributeSetterDirective } from './attribute-setter.directive';

const DIRECTIVES = [ProjectAsTemplateDirective, AttributeSetterDirective];

@NgModule({
  declarations: [...DIRECTIVES],
  imports: [CommonModule],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
