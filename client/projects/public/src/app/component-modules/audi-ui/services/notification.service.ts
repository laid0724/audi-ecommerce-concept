import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AudiNotificationType } from '../enums';
import { NotificationModule } from '../notification/notification.module';

export interface AudiNotification {
  message: string;
  type: AudiNotificationType;
}

@Injectable({
  providedIn: NotificationModule,
})
export class NotificationService {
  private _notificationTrigger$ = new ReplaySubject<AudiNotification | null>(
    Infinity
  );
  notificationTrigger$: Observable<AudiNotification | null> =
    this._notificationTrigger$.asObservable();

  notificationTimeout: number | null = 3000;

  show(message: string): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Default,
    };

    this._notificationTrigger$.next(notification);
  }

  info(message: string): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Info,
    };

    this._notificationTrigger$.next(notification);
  }

  warning(message: string): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Warning,
    };

    this._notificationTrigger$.next(notification);
  }

  success(message: string): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Success,
    };

    this._notificationTrigger$.next(notification);
  }

  error(message: string): void {
    const notification: AudiNotification = {
      message,
      type: AudiNotificationType.Danger,
    };

    this._notificationTrigger$.next(notification);
  }
}
