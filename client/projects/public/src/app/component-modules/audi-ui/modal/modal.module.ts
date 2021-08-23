import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { ModalServiceModule } from '../services/modal-service/modal-service.module';

const COMPONENTS = [ModalComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ModalServiceModule],
  exports: [...COMPONENTS, ModalServiceModule],
})
export class ModalModule {}
