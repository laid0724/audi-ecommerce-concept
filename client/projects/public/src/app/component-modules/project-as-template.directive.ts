import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[projectAsTemplate]',
})
export class ProjectAsTemplateDirective {
  // see: https://stackoverflow.com/questions/59185318/get-multiple-ng-template-ref-values-using-contentchildren-in-angular-5
  constructor(public readonly template: TemplateRef<any>) {}
}
