import {
  Component,
  ComponentRef,
  OnDestroy,
  ViewChild,
  ComponentFactoryResolver,
  OnInit,
} from '@angular/core';
import { isNullOrEmptyString } from '@audi/data';
import { Subscription } from 'rxjs';
import { AudiColor, AudiNotificationType } from '../../enums';
import {
  AudiNotification,
  NotificationService,
} from '../../services/notification-service/notification.service';
import { NotificationInjectionMarkerDirective } from '../notification-injection-marker.directive';
import { NotificationComponent } from '../notification/notification.component';

export interface NotificationConfig {
  audiStyle: 'dark' | 'light';
  bgColor?: AudiColor | string;
  textColor?: AudiColor | string;
  timeout: number | null;
}

// notifications are dynamically generated
// see: https://malcoded.com/posts/angular-dynamic-components/

@Component({
  selector: 'audi-notification-container',
  templateUrl: './notification-container.component.html',
  styleUrls: ['./notification-container.component.scss'],
})
export class NotificationContainerComponent implements OnInit, OnDestroy {
  @ViewChild(NotificationInjectionMarkerDirective, { static: true })
  notificationHost: NotificationInjectionMarkerDirective;

  componentRefs: ComponentRef<NotificationComponent>[] = [];

  _notificationSubscription: Subscription;

  constructor(
    private notificationService: NotificationService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this._notificationSubscription =
      this.notificationService.notificationTrigger$.subscribe(
        (notification: AudiNotification | null) => {
          if (notification) {
            const { message, title, type, timeout } = notification;

            switch (type) {
              case AudiNotificationType.Default:
                this.showNotification(message, title, timeout);
                break;
              case AudiNotificationType.Info:
                this.showInfoNotification(message, title, timeout);
                break;
              case AudiNotificationType.Warning:
                this.showWarningNotification(message, title, timeout);
                break;
              case AudiNotificationType.Success:
                this.showSuccessNotification(message, title, timeout);
                break;
              case AudiNotificationType.Danger:
                this.showDangerNotification(message, title, timeout);
                break;
              default:
                this.showNotification(message, title, timeout);
                break;
            }
          }
        }
      );
  }

  private showNotificationBase(
    message: string,
    title: string | null = null,
    settings?: NotificationConfig
  ): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(
        NotificationComponent
      );

    const hostViewContainerRef = this.notificationHost.viewContainerRef;

    const componentRef = hostViewContainerRef.createComponent(componentFactory);

    if (settings != null) {
      if (!isNullOrEmptyString(settings.audiStyle)) {
        componentRef.instance.audiStyle = settings.audiStyle!;
      }
      if (!isNullOrEmptyString(settings.bgColor)) {
        componentRef.instance.bgColor = settings.bgColor!;
      }
      if (!isNullOrEmptyString(settings.textColor)) {
        componentRef.instance.textColor = settings.textColor!;
      }

      componentRef.instance.notificationTimeout = settings.timeout;
    }

    if (!isNullOrEmptyString(title)) {
      componentRef.instance.toastTitle = title!;
    }

    componentRef.instance.toastMessage = message;

    this.componentRefs.push(componentRef);
  }

  private showNotification(
    message: string,
    title: string | null,
    timeout: number | null
  ): void {
    this.showNotificationBase(message, title, {
      audiStyle: 'light',
      timeout,
    });
  }

  private showInfoNotification(
    message: string,
    title: string | null,
    timeout: number | null
  ): void {
    this.showNotificationBase(message, title, {
      audiStyle: 'dark',
      timeout,
    });
  }

  private showSuccessNotification(
    message: string,
    title: string | null,
    timeout: number | null
  ): void {
    this.showNotificationBase(message, title, {
      audiStyle: 'dark',
      bgColor: AudiColor.Success,
      textColor: AudiColor.White,
      timeout,
    });
  }

  private showDangerNotification(
    message: string,
    title: string | null,
    timeout: number | null
  ): void {
    this.showNotificationBase(message, title, {
      audiStyle: 'dark',
      bgColor: AudiColor.Error,
      textColor: AudiColor.White,
      timeout,
    });
  }

  private showWarningNotification(
    message: string,
    title: string | null,
    timeout: number | null
  ): void {
    this.showNotificationBase(message, title, {
      audiStyle: 'dark',
      bgColor: AudiColor.Warning,
      textColor: AudiColor.White,
      timeout,
    });
  }

  ngOnDestroy(): void {
    this.notificationHost.viewContainerRef.clear(); // destroys all view in this template ref
    this.componentRefs.forEach((c) => c.destroy());
    if (this._notificationSubscription) {
      this._notificationSubscription.unsubscribe();
    }
  }
}
