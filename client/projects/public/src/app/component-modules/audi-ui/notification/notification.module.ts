import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NotificationInjectionMarkerDirective } from './notification-injection-marker.directive';

const COMPONENTS = [NotificationComponent, NotificationContainerComponent];

@NgModule({
  declarations: [...COMPONENTS, NotificationInjectionMarkerDirective],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class NotificationModule {}
