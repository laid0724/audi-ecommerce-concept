import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[alertInjectionMarker]',
})
export class AlertInjectionMarkerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
