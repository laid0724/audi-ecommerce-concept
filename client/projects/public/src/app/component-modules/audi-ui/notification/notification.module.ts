import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification/notification.component';
import { NotificationContainerComponent } from './notification-container/notification-container.component';
import { NotificationInjectionMarkerDirective } from './notification-injection-marker.directive';
import { NotificationServiceModule } from '../../../../../../data/src/lib/services/notification-service/notification-service.module';

const COMPONENTS = [NotificationComponent, NotificationContainerComponent];

@NgModule({
  declarations: [...COMPONENTS, NotificationInjectionMarkerDirective],
  imports: [CommonModule, NotificationServiceModule],
  exports: [...COMPONENTS, NotificationServiceModule],
})
export class NotificationModule {}
