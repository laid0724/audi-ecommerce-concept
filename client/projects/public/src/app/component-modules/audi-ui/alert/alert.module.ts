import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { AlertContainerComponent } from './alert-container/alert-container.component';

const COMPONENTS = [
  AlertComponent,
  AlertContainerComponent,
];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule],
  exports: [...COMPONENTS],
})
export class AlertModule {}
