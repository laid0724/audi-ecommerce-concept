import { ViewContainerRef } from '@angular/core';
import { Directive } from '@angular/core';

@Directive({
  selector: '[notificationInjectionMarker]',
})
export class NotificationInjectionMarkerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
