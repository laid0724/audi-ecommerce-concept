import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AudiNotificationType } from '@audi/data';
import { NotificationServiceModule } from './notification-service.module';

export interface AudiNotification {
  message: string;
  title: string | null;
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

  show(
    message: string,
    title: string | null = null,
    timeout: number | null = null
  ): void {
    const notification: AudiNotification = {
      message,
      title,
      type: AudiNotificationType.Default,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  info(
    message: string,
    title: string | null = null,
    timeout: number | null = null
  ): void {
    const notification: AudiNotification = {
      message,
      title,
      type: AudiNotificationType.Info,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  warning(
    message: string,
    title: string | null = null,
    timeout: number | null = null
  ): void {
    const notification: AudiNotification = {
      message,
      title,
      type: AudiNotificationType.Warning,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  success(
    message: string,
    title: string | null = null,
    timeout: number | null = null
  ): void {
    const notification: AudiNotification = {
      message,
      title,
      type: AudiNotificationType.Success,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }

  error(
    message: string,
    title: string | null = null,
    timeout: number | null = null
  ): void {
    const notification: AudiNotification = {
      message,
      title,
      type: AudiNotificationType.Danger,
      timeout,
    };

    this._notificationTrigger$.next(notification);
  }
}
