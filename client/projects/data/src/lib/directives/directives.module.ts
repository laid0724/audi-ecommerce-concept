import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectAsTemplateDirective } from './project-as-template.directive';
import { AttributeSetterDirective } from './attribute-setter.directive';
import { ClassSetterDirective } from './class-setter.directive';

const DIRECTIVES = [
  ProjectAsTemplateDirective,
  AttributeSetterDirective,
  ClassSetterDirective,
];

@NgModule({
  declarations: [...DIRECTIVES],
  imports: [CommonModule],
  exports: [...DIRECTIVES],
})
export class DirectivesModule {}
