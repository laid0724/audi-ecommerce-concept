import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { AlertContainerComponent } from './alert-container/alert-container.component';
import { AlertContainerGlobalComponent } from './alert-container-global/alert-container-global.component';
import { AlertInjectionMarkerDirective } from './alert-injection-marker.directive';
import { AlertServiceModule } from '../services/alert-service/alert-service.module';

const COMPONENTS = [
  AlertComponent,
  AlertContainerComponent,
  AlertContainerGlobalComponent,
];

@NgModule({
  declarations: [...COMPONENTS, AlertInjectionMarkerDirective],
  imports: [CommonModule, AlertServiceModule],
  exports: [...COMPONENTS, AlertServiceModule],
})
export class AlertModule {}
