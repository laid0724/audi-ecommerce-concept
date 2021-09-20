import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  Type,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AudiAlertStyle, AudiAlertType, AudiColor } from '@audi/data';
import {
  AlertService,
  AudiGlobalAlert,
} from '../../services/alert-service/alert.service';
import { AlertConfig } from '../alert-container/alert-container.component';
import { AlertInjectionMarkerDirective } from '../alert-injection-marker.directive';
import { AlertComponent } from '../alert/alert.component';

// dynamically create AlertComponent by listening to AlertService;
// AlertComponent also allows projection via both ng-content and viewContainerRef, so for global
// alerts we dynamically project custom components into AlertComponent's viewContainerRef via the service too.
// see: https://malcoded.com/posts/angular-dynamic-components/

@Component({
  selector: 'audi-alert-container-global',
  templateUrl: './alert-container-global.component.html',
  styleUrls: ['./alert-container-global.component.scss'],
})
export class AlertContainerGlobalComponent implements OnInit, OnDestroy {
  @ViewChild(AlertInjectionMarkerDirective, { static: true })
  alertHost: AlertInjectionMarkerDirective;

  componentRefs: ComponentRef<AlertComponent>[] = [];

  _alertSubscription: Subscription;

  constructor(
    private alertService: AlertService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this._alertSubscription = this.alertService.alertTrigger$.subscribe(
      (alert: AudiGlobalAlert | null) => {
        if (alert) {
          switch (alert.style) {
            case AudiAlertStyle.Default:
              this.showAlert(alert);
              break;
            case AudiAlertStyle.Warning:
              this.showWarningAlert(alert);
              break;
            case AudiAlertStyle.Success:
              this.showSuccessAlert(alert);
              break;
            case AudiAlertStyle.Danger:
              this.showDangerAlert(alert);
              break;
            default:
              this.showAlert(alert);
              break;
          }
        }
      }
    );
  }

  private showAlertBase(
    componentToInject: Type<any>,
    stylingConfig: AlertConfig,
    openDelay?: number,
    timeOut?: number
  ): void {
    const componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;

    const componentRef = hostViewContainerRef.createComponent(componentFactory);

    componentRef.instance.dynamicComponentType = componentToInject;
    componentRef.instance.type = AudiAlertType.Global;
    componentRef.instance.audiStyle = stylingConfig.audiStyle;
    componentRef.instance.bgColor = stylingConfig.bgColor;
    componentRef.instance.textColor = stylingConfig.textColor;

    if (openDelay != null) {
      componentRef.instance.openDelay = openDelay;
    }

    if (timeOut != null) {
      componentRef.instance.timeOut = timeOut;
    }

    this.componentRefs.push(componentRef);
  }

  private showAlert(globalAlert: AudiGlobalAlert): void {
    const { componentToInject, openDelay, timeOut } = globalAlert;

    const stylingConfig: AlertConfig = {
      audiStyle: 'light',
      bgColor: AudiColor.White,
      textColor: AudiColor.Black,
    };

    this.showAlertBase(componentToInject, stylingConfig, openDelay, timeOut);
  }

  private showSuccessAlert(globalAlert: AudiGlobalAlert): void {
    const { componentToInject, openDelay, timeOut } = globalAlert;

    const stylingConfig: AlertConfig = {
      audiStyle: 'light',
      bgColor: AudiColor.White,
      textColor: AudiColor.Success,
    };

    this.showAlertBase(componentToInject, stylingConfig, openDelay, timeOut);
  }

  private showWarningAlert(globalAlert: AudiGlobalAlert): void {
    const { componentToInject, openDelay, timeOut } = globalAlert;

    const stylingConfig: AlertConfig = {
      audiStyle: 'dark',
      bgColor: AudiColor.Black,
      textColor: AudiColor.Warning,
    };

    this.showAlertBase(componentToInject, stylingConfig, openDelay, timeOut);
  }

  private showDangerAlert(globalAlert: AudiGlobalAlert): void {
    const { componentToInject, openDelay, timeOut } = globalAlert;

    const stylingConfig: AlertConfig = {
      audiStyle: 'dark',
      bgColor: AudiColor.Error,
      textColor: AudiColor.White,
    };

    this.showAlertBase(componentToInject, stylingConfig, openDelay, timeOut);
  }

  ngOnDestroy(): void {
    this.alertHost.viewContainerRef.clear(); // destroys all view in this template ref
    this.componentRefs.forEach((c) => c.destroy());
    if (this._alertSubscription) {
      this._alertSubscription.unsubscribe();
    }
  }
}
