import { Component, AfterViewInit, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import { AudiColor } from '../../enums';
import { NotificationService } from '../../services/notification-service/notification.service';

@Component({
  selector: 'audi-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements AfterViewInit {
  @Input() audiStyle: 'dark' | 'light' = 'light';
  @Input() bgColor: AudiColor | string = '';
  @Input() textColor: AudiColor | string = '';
  @Input() toastMessage: string = '';

  constructor(private notificationService: NotificationService) {}

  ngAfterViewInit(): void {
    const notifications = initAudiModules(AudiModuleName.Notification);

    notifications.forEach((m: AudiComponents) => {
      const notificationComponents = m.components.upgradeElements();

      if (this.notificationService.notificationTimeout !== null) {
        notificationComponents.forEach((n: any) => {
          setTimeout(() => {
            n.close();
          }, this.notificationService.notificationTimeout as number);
        });
      }
    });
  }
}
