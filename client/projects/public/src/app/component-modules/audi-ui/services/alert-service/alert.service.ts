import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AudiAlertType, AudiAlertStyle } from '../../enums';
import { AlertServiceModule } from './alert-service.module';

export interface AudiAlert {
  message: string;
  type: AudiAlertType;
  style: AudiAlertStyle;
  delay?: number;
  timeOut?: number;
}

@Injectable({
  providedIn: AlertServiceModule
})
export class AlertService {
  private _alertTrigger$ = new ReplaySubject<AudiAlert | null>(Infinity);
  alertTrigger$: Observable<AudiAlert | null> =
    this._alertTrigger$.asObservable();

  show(message: string, delay?: number, timeOut?: number): void {
    const alert: AudiAlert = {
      message,
      type: AudiAlertType.Global,
      style: AudiAlertStyle.Default,
      delay: delay ?? 0,
      timeOut: timeOut ?? 0,
    };

    this._alertTrigger$.next(alert);
  }

  warning(message: string, delay?: number, timeOut?: number): void {
    const alert: AudiAlert = {
      message,
      type: AudiAlertType.Global,
      style: AudiAlertStyle.Warning,
      delay: delay ?? 0,
      timeOut: timeOut ?? 0,
    };

    this._alertTrigger$.next(alert);
  }

  success(message: string, delay?: number, timeOut?: number): void {
    const alert: AudiAlert = {
      message,
      type: AudiAlertType.Global,
      style: AudiAlertStyle.Success,
      delay: delay ?? 0,
      timeOut: timeOut ?? 0,
    };

    this._alertTrigger$.next(alert);
  }

  error(message: string, delay?: number, timeOut?: number): void {
    const alert: AudiAlert = {
      message,
      type: AudiAlertType.Global,
      style: AudiAlertStyle.Danger,
      delay: delay ?? 0,
      timeOut: timeOut ?? 0,
    };

    this._alertTrigger$.next(alert);
  }
}
