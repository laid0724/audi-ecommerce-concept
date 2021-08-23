import { Component, AfterViewInit, Input } from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import { AudiColor } from '../../enums';

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
  @Input() notificationTimeout: number | null = null;

  ngAfterViewInit(): void {
    const notifications = initAudiModules(AudiModuleName.Notification);

    notifications.forEach((m: AudiComponents) => {
      const notificationComponents = m.components.upgradeElements();

      if (this.notificationTimeout !== null) {
        notificationComponents.forEach((n: any) => {
          setTimeout(() => {
            n.close();
          }, this.notificationTimeout as number);
        });
      }
    });
  }
}
