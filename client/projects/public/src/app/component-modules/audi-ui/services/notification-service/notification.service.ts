import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AudiNotificationType } from '../../enums';
import { NotificationServiceModule } from './notification-service.module';

export interface AudiNotification {
  message: string;
  type: AudiNotificationType;
  timeout: number | null;
}

@Injectable({
  providedIn: NotificationServiceModule,
})
export class NotificationService {
  private _notificationTrigger$ = new ReplaySubject<AudiNotification | null>(
    Infinity
  );
  notificationTrigger$: Observable<AudiNotification | null> =
    this._notificationTrigger$.asObservable();

  show(message: string, timeout: number | null = null): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Default,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  info(message: string, timeout: number | null = null): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Info,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  warning(message: string, timeout: number | null = null): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Warning,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  success(message: string, timeout: number | null = null): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Success,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  error(message: string, timeout: number | null = null): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Danger,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }
}
