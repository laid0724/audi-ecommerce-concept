import { ViewContainerRef, Directive} from '@angular/core';

@Directive({
  selector: '[notificationInjectionMarker]',
})
export class NotificationInjectionMarkerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
