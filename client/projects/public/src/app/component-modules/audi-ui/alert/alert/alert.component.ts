import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  Type,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { initAudiModules, AudiModuleName, AudiComponents } from '@audi/data';
import { AudiAlertType, AudiColor } from '../../enums';
import { AlertInjectionMarkerDirective } from '../alert-injection-marker.directive';

// this component can be either dynamically created via alert-container-global
// or just simply included in the template via alert-container;
// in addition to being created dynamically, this component can ALSO dynamically generate
// and project components of any type into this template.
// see: https://malcoded.com/posts/angular-dynamic-components/

@Component({
  selector: 'audi-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements AfterViewInit, OnDestroy {
  @ViewChild(AlertInjectionMarkerDirective, { static: false })
  dynamicComponentInjectionPoint: AlertInjectionMarkerDirective;

  public dynamicComponentRef: ComponentRef<any>;
  public dynamicComponentType: Type<any> | null = null;

  @Input() openDelay: number | null = null;
  @Input() timeOut: number | null = null;
  @Input() type: AudiAlertType | string = AudiAlertType.Default;
  @Input() audiStyle: 'dark' | 'light' = 'light';
  @Input() bgColor: AudiColor | string = AudiColor.White;
  @Input() textColor: AudiColor | string = AudiColor.Black;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    // here, we need to load the dynamically inserted component in this life cycle hook or else the audi alert get messed up.
    // but it will result in an ExpressionChangedAfterItHasBeenCheckedError due to the nature of this hook.
    // To prevent that, we need to tell angular to re-run change detection after we have generated the dynamic component.
    if (this.dynamicComponentType !== null) {
      this.loadDynamicComponent(this.dynamicComponentType);
      this.cdr.detectChanges();
    }

    const alert = initAudiModules(AudiModuleName.Alert);

    alert.forEach((m: AudiComponents) => {
      const alertComponents = m.components.upgradeElements();

      // HACK: we are pushing audi's native js functions to the back of the event loop so that
      // ui animation changes are in sync with angular, or else the alert container's height gets buggy
      setTimeout(() => {
        alertComponents.forEach((c: any) => c.update());
      }, this.openDelay ?? 0);

      if (this.timeOut !== null) {
        alertComponents.forEach((n: any) => {
          setTimeout(() => {
            n.close();
          }, this.timeOut as number);
        });
      }
    });
  }

  loadDynamicComponent(componentType: Type<any>): void {
    let componentFactory =
      this.componentFactoryResolver.resolveComponentFactory(componentType);

    let viewContainerRef = this.dynamicComponentInjectionPoint.viewContainerRef;
    viewContainerRef.clear();

    this.dynamicComponentRef =
      viewContainerRef.createComponent(componentFactory);
  }

  ngOnDestroy(): void {
    if (this.dynamicComponentRef) {
      this.dynamicComponentRef.destroy();
    }
  }
}
