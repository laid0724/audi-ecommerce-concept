import { Injectable, Type } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { AudiAlertStyle } from '@audi/data';
import { AlertServiceModule } from './alert-service.module';

export interface AudiGlobalAlert {
  style: AudiAlertStyle;
  componentToInject: Type<any>;
  openDelay?: number;
  timeOut?: number;
}

@Injectable({
  providedIn: AlertServiceModule,
})
export class AlertService {
  private _alertTrigger$ = new ReplaySubject<AudiGlobalAlert | null>(Infinity);
  alertTrigger$: Observable<AudiGlobalAlert | null> =
    this._alertTrigger$.asObservable();

  show(componentToInject: Type<any>, openDelay?: number, timeOut?: number): void {
    const alert: AudiGlobalAlert = {
      componentToInject,
      style: AudiAlertStyle.Default,
      openDelay: openDelay ?? undefined,
      timeOut: timeOut ?? undefined,
    };

    this._alertTrigger$.next(alert);
  }

  warning(
    componentToInject: Type<any>,
    openDelay?: number,
    timeOut?: number
  ): void {
    const alert: AudiGlobalAlert = {
      componentToInject,
      style: AudiAlertStyle.Warning,
      openDelay: openDelay ?? undefined,
      timeOut: timeOut ?? undefined,
    };

    this._alertTrigger$.next(alert);
  }

  success(
    componentToInject: Type<any>,
    openDelay?: number,
    timeOut?: number
  ): void {
    const alert: AudiGlobalAlert = {
      componentToInject,
      style: AudiAlertStyle.Success,
      openDelay: openDelay ?? undefined,
      timeOut: timeOut ?? undefined,
    };

    this._alertTrigger$.next(alert);
  }

  error(componentToInject: Type<any>, openDelay?: number, timeOut?: number): void {
    const alert: AudiGlobalAlert = {
      componentToInject,
      style: AudiAlertStyle.Danger,
      openDelay: openDelay ?? undefined,
      timeOut: timeOut ?? undefined,
    };

    this._alertTrigger$.next(alert);
  }
}
